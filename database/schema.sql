-- Tabla para elementos de cumplimiento LOPIVI
CREATE TABLE IF NOT EXISTS cumplimiento_lopivi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entidad_id UUID REFERENCES entidades(id) ON DELETE CASCADE,
  elemento_tipo VARCHAR(50) NOT NULL, -- 'plan_proteccion', 'delegado_principal', 'delegado_suplente', 'personal_formado', 'protocolos_actualizados', 'canal_comunicacion', 'registro_casos', 'auditoria_anual'
  estado BOOLEAN DEFAULT false,
  fecha_completado TIMESTAMP,
  fecha_vencimiento TIMESTAMP,
  responsable_id UUID REFERENCES usuarios(id),
  documentos_adjuntos JSONB DEFAULT '[]',
  observaciones TEXT,
  porcentaje_parcial INTEGER DEFAULT 0, -- Para elementos que pueden estar parcialmente completados
  datos_adicionales JSONB DEFAULT '{}', -- Para almacenar datos específicos de cada elemento
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(entidad_id, elemento_tipo)
);

-- Tabla para auditorías LOPIVI
CREATE TABLE IF NOT EXISTS auditorias_lopivi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entidad_id UUID REFERENCES entidades(id) ON DELETE CASCADE,
  fecha_auditoria DATE NOT NULL,
  tipo VARCHAR(20) DEFAULT 'anual', -- 'anual', 'trimestral', 'extraordinaria'
  estado VARCHAR(20) DEFAULT 'pendiente', -- 'pendiente', 'en_progreso', 'completada', 'cancelada'
  puntuacion_total INTEGER DEFAULT 0,
  puntuacion_maxima INTEGER DEFAULT 100,
  observaciones TEXT,
  auditor_externo VARCHAR(255),
  documentos_generados JSONB DEFAULT '[]',
  elementos_evaluados JSONB DEFAULT '[]',
  recomendaciones TEXT,
  fecha_siguiente_auditoria DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla para histórico de cambios en cumplimiento
CREATE TABLE IF NOT EXISTS historial_cumplimiento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entidad_id UUID REFERENCES entidades(id) ON DELETE CASCADE,
  elemento_tipo VARCHAR(50) NOT NULL,
  estado_anterior BOOLEAN,
  estado_nuevo BOOLEAN,
  porcentaje_anterior INTEGER,
  porcentaje_nuevo INTEGER,
  usuario_modificador UUID REFERENCES usuarios(id),
  motivo_cambio TEXT,
  documentos_relacionados JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_cumplimiento_entidad ON cumplimiento_lopivi(entidad_id);
CREATE INDEX IF NOT EXISTS idx_cumplimiento_estado ON cumplimiento_lopivi(estado);
CREATE INDEX IF NOT EXISTS idx_auditorias_entidad ON auditorias_lopivi(entidad_id);
CREATE INDEX IF NOT EXISTS idx_auditorias_fecha ON auditorias_lopivi(fecha_auditoria);
CREATE INDEX IF NOT EXISTS idx_historial_entidad ON historial_cumplimiento(entidad_id);

-- Función para calcular porcentaje total de cumplimiento
CREATE OR REPLACE FUNCTION calcular_cumplimiento_total(p_entidad_id UUID)
RETURNS INTEGER AS $$
DECLARE
  total_elementos INTEGER := 8; -- Número total de elementos LOPIVI
  elementos_completados INTEGER;
  porcentaje INTEGER;
BEGIN
  SELECT COUNT(*) INTO elementos_completados
  FROM cumplimiento_lopivi
  WHERE entidad_id = p_entidad_id AND estado = true;

  porcentaje := ROUND((elementos_completados::FLOAT / total_elementos::FLOAT) * 100);

  RETURN porcentaje;
END;
$$ LANGUAGE plpgsql;

-- Función para inicializar elementos de cumplimiento para nueva entidad
CREATE OR REPLACE FUNCTION inicializar_cumplimiento_entidad(p_entidad_id UUID)
RETURNS VOID AS $$
DECLARE
  elementos TEXT[] := ARRAY[
    'plan_proteccion',
    'delegado_principal',
    'delegado_suplente',
    'personal_formado',
    'protocolos_actualizados',
    'canal_comunicacion',
    'registro_casos',
    'auditoria_anual'
  ];
  elemento TEXT;
BEGIN
  FOREACH elemento IN ARRAY elementos
  LOOP
    INSERT INTO cumplimiento_lopivi (entidad_id, elemento_tipo, estado)
    VALUES (p_entidad_id, elemento, false)
    ON CONFLICT (entidad_id, elemento_tipo) DO NOTHING;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Tabla para gestión de casos LOPIVI (NUEVA)
CREATE TABLE IF NOT EXISTS casos_lopivi (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    entidad_id UUID NOT NULL REFERENCES entidades(id),
    delegado_principal_id UUID REFERENCES delegados_lopivi(id),
    delegado_suplente_id UUID REFERENCES delegados_lopivi(id),
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'pendiente', 'resuelto', 'cerrado')),
    prioridad VARCHAR(20) DEFAULT 'media' CHECK (prioridad IN ('alta', 'media', 'baja')),
    menor_afectado_nombre VARCHAR(255), -- Encriptado en producción
    observaciones TEXT,
    acciones_tomadas TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_resolucion TIMESTAMP WITH TIME ZONE,

    -- Índices
    INDEX idx_casos_entidad (entidad_id),
    INDEX idx_casos_delegado_principal (delegado_principal_id),
    INDEX idx_casos_delegado_suplente (delegado_suplente_id),
    INDEX idx_casos_estado (estado),
    INDEX idx_casos_fecha_creacion (fecha_creacion)
);

-- Tabla para formación del personal LOPIVI (NUEVA)
CREATE TABLE IF NOT EXISTS formacion_personal_lopivi (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    personal_id UUID NOT NULL REFERENCES personal_entidad(id),
    entidad_id UUID NOT NULL REFERENCES entidades(id),
    fecha_formacion DATE NOT NULL,
    tipo_formacion VARCHAR(50) DEFAULT 'lopivi_basica' CHECK (tipo_formacion IN (
        'lopivi_basica', 'lopivi_avanzada', 'delegado_principal', 'delegado_suplente',
        'actualizacion', 'especializada'
    )),
    horas_formacion INTEGER DEFAULT 8,
    calificacion VARCHAR(20),
    entidad_formadora VARCHAR(255),
    instructor_id UUID REFERENCES delegados_lopivi(id),
    certificado_emitido BOOLEAN DEFAULT FALSE,
    fecha_vencimiento_certificado DATE,
    observaciones TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Índices
    INDEX idx_formacion_personal (personal_id),
    INDEX idx_formacion_entidad (entidad_id),
    INDEX idx_formacion_fecha (fecha_formacion),
    INDEX idx_formacion_vencimiento (fecha_vencimiento_certificado)
);

-- Tabla para clientes de Stripe (NUEVA)
CREATE TABLE IF NOT EXISTS stripe_customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    delegado_id UUID NOT NULL REFERENCES delegados_lopivi(id),
    entidad_id UUID NOT NULL REFERENCES entidades(id),
    stripe_customer_id VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    activo BOOLEAN DEFAULT TRUE,

    -- Índices
    INDEX idx_stripe_delegado (delegado_id),
    INDEX idx_stripe_customer_id (stripe_customer_id)
);

-- Tabla para tarjetas guardadas de delegados (NUEVA)
CREATE TABLE IF NOT EXISTS tarjetas_delegados (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    delegado_id UUID NOT NULL REFERENCES delegados_lopivi(id),
    entidad_id UUID NOT NULL REFERENCES entidades(id),
    marca_tarjeta VARCHAR(20) NOT NULL, -- visa, mastercard, amex, etc.
    ultimos_4_digitos VARCHAR(4) NOT NULL,
    mes_vencimiento INTEGER NOT NULL CHECK (mes_vencimiento BETWEEN 1 AND 12),
    año_vencimiento INTEGER NOT NULL,
    titular_tarjeta VARCHAR(255) NOT NULL,
    token_stripe_customer VARCHAR(255) NOT NULL, -- Payment method ID de Stripe
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_eliminacion TIMESTAMP WITH TIME ZONE,

    -- Índices
    INDEX idx_tarjetas_delegado (delegado_id),
    INDEX idx_tarjetas_activas (delegado_id, activa)
);

-- Tabla para transacciones de pagos (NUEVA)
CREATE TABLE IF NOT EXISTS transacciones_pagos (
    id VARCHAR(50) PRIMARY KEY, -- TXN-timestamp-delegado
    delegado_id UUID NOT NULL REFERENCES delegados_lopivi(id),
    entidad_id UUID NOT NULL REFERENCES entidades(id),
    stripe_payment_intent_id VARCHAR(255) NOT NULL UNIQUE,
    concepto VARCHAR(255) NOT NULL,
    monto_sin_iva DECIMAL(10,2) NOT NULL,
    iva DECIMAL(10,2) NOT NULL,
    monto_total DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(20) NOT NULL CHECK (metodo_pago IN ('existente', 'nueva')),
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'completado', 'fallido', 'reembolsado')),
    fecha_transaccion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    detalles_json JSONB, -- Información adicional de Stripe

    -- Índices
    INDEX idx_transacciones_delegado (delegado_id),
    INDEX idx_transacciones_entidad (entidad_id),
    INDEX idx_transacciones_fecha (fecha_transaccion),
    INDEX idx_transacciones_stripe (stripe_payment_intent_id)
);

-- Agregar campos faltantes a delegados_lopivi para certificaciones (ACTUALIZACIÓN)
ALTER TABLE delegados_lopivi
ADD COLUMN IF NOT EXISTS certificacion_vigente BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS fecha_vencimiento_certificacion DATE,
ADD COLUMN IF NOT EXISTS fecha_ultima_renovacion TIMESTAMP WITH TIME ZONE;

-- Agregar campos faltantes a personal_entidad para certificados penales (ACTUALIZACIÓN)
ALTER TABLE personal_entidad
ADD COLUMN IF NOT EXISTS certificado_antecedentes BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS fecha_emision_antecedentes DATE,
ADD COLUMN IF NOT EXISTS fecha_vencimiento_antecedentes DATE,
ADD COLUMN IF NOT EXISTS certificado_delitos_sexuales BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS fecha_emision_delitos_sexuales DATE,
ADD COLUMN IF NOT EXISTS fecha_vencimiento_delitos_sexuales DATE;

-- Función para actualizar casos automáticamente
CREATE OR REPLACE FUNCTION actualizar_fecha_caso()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar fecha de modificación en casos
DROP TRIGGER IF EXISTS trigger_actualizar_caso ON casos_lopivi;
CREATE TRIGGER trigger_actualizar_caso
    BEFORE UPDATE ON casos_lopivi
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_caso();

-- Función para actualizar formación automáticamente
CREATE OR REPLACE FUNCTION actualizar_fecha_formacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar fecha de modificación en formación
DROP TRIGGER IF EXISTS trigger_actualizar_formacion ON formacion_personal_lopivi;
CREATE TRIGGER trigger_actualizar_formacion
    BEFORE UPDATE ON formacion_personal_lopivi
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_formacion();

-- Insertar datos de prueba para casos (DESARROLLO)
INSERT INTO casos_lopivi (entidad_id, titulo, descripcion, estado, prioridad, fecha_creacion) VALUES
((SELECT id FROM entidades LIMIT 1), 'Caso de prueba - Suplente', 'Caso asignado para apoyo del delegado suplente', 'activo', 'media', NOW() - INTERVAL '5 days'),
((SELECT id FROM entidades LIMIT 1), 'Revisión protocolo urgente', 'Revisión de protocolos tras incidente menor', 'pendiente', 'alta', NOW() - INTERVAL '2 days'),
((SELECT id FROM entidades LIMIT 1), 'Seguimiento formación personal', 'Seguimiento de personal pendiente de formación', 'activo', 'baja', NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- Insertar datos de prueba para formación personal (DESARROLLO)
INSERT INTO formacion_personal_lopivi (personal_id, entidad_id, fecha_formacion, tipo_formacion, horas_formacion, certificado_emitido, fecha_vencimiento_certificado) VALUES
((SELECT id FROM personal_entidad WHERE nombre_completo ILIKE '%demo%' LIMIT 1), (SELECT id FROM entidades LIMIT 1), CURRENT_DATE - INTERVAL '30 days', 'lopivi_basica', 8, true, CURRENT_DATE + INTERVAL '1 year'),
((SELECT id FROM personal_entidad WHERE email ILIKE '%demo%' LIMIT 1), (SELECT id FROM entidades LIMIT 1), CURRENT_DATE - INTERVAL '15 days', 'lopivi_basica', 8, true, CURRENT_DATE + INTERVAL '1 year')
ON CONFLICT DO NOTHING;

-- Insertar tarjeta demo para pruebas (DESARROLLO)
INSERT INTO tarjetas_delegados (delegado_id, entidad_id, marca_tarjeta, ultimos_4_digitos, mes_vencimiento, año_vencimiento, titular_tarjeta, token_stripe_customer) VALUES
((SELECT id FROM delegados_lopivi WHERE tipo = 'suplente' LIMIT 1), (SELECT id FROM entidades LIMIT 1), 'Visa', '4242', 12, 2026, 'Demo User', 'pm_demo_card_visa')
ON CONFLICT DO NOTHING;

-- Comentarios de documentación
COMMENT ON TABLE casos_lopivi IS 'Gestión de casos de protección infantil LOPIVI';
COMMENT ON TABLE formacion_personal_lopivi IS 'Registro de formación del personal en normativa LOPIVI';
COMMENT ON TABLE stripe_customers IS 'Clientes registrados en Stripe para pagos';
COMMENT ON TABLE tarjetas_delegados IS 'Tarjetas de pago guardadas de los delegados';
COMMENT ON TABLE transacciones_pagos IS 'Registro de todas las transacciones de pago realizadas';
