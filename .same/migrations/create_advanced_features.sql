-- ================================================
-- MIGRACIÓN: FUNCIONALIDADES AVANZADAS CUSTODIA360
-- Versión: 1.0
-- Fecha: 2024
-- ================================================

-- 1. SISTEMA DE ALERTAS Y NOTIFICACIONES
-- ================================================

CREATE TABLE alertas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entidad_id text NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('certificacion', 'formacion', 'caso', 'auditoria', 'general')),
  prioridad text NOT NULL CHECK (prioridad IN ('baja', 'media', 'alta', 'critica')),
  titulo text NOT NULL,
  descripcion text,
  fecha_creacion timestamp with time zone DEFAULT now(),
  fecha_vencimiento timestamp with time zone,
  estado text DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'leida', 'en_proceso', 'resuelta')),
  asignado_a text,
  origen_id text, -- ID del elemento que generó la alerta
  datos_adicionales jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Índices para alertas
CREATE INDEX idx_alertas_entidad_estado ON alertas(entidad_id, estado);
CREATE INDEX idx_alertas_tipo_prioridad ON alertas(tipo, prioridad);
CREATE INDEX idx_alertas_fecha_vencimiento ON alertas(fecha_vencimiento);

-- 4. REGISTRO DE FORMACIONES DEL PERSONAL
-- ================================================

CREATE TABLE formaciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descripcion text,
  duracion_horas integer DEFAULT 0,
  tipo text NOT NULL CHECK (tipo IN ('obligatoria', 'recomendada', 'especializada')),
  categoria text NOT NULL CHECK (categoria IN ('lopivi', 'proteccion', 'procedimientos', 'primeros_auxilios', 'otros')),
  vigencia_meses integer DEFAULT 12,
  contenido_resumen text,
  activa boolean DEFAULT true,
  puntuacion_minima integer DEFAULT 70,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Datos iniciales de formaciones LOPIVI
INSERT INTO formaciones (titulo, descripcion, duracion_horas, tipo, categoria, vigencia_meses) VALUES
('Fundamentos LOPIVI', 'Formación básica sobre la Ley Orgánica de Protección Integral a la Infancia y la Adolescencia', 8, 'obligatoria', 'lopivi', 12),
('Detección de Maltrato Infantil', 'Identificación de señales de violencia hacia menores', 6, 'obligatoria', 'proteccion', 12),
('Protocolos de Actuación', 'Procedimientos específicos ante situaciones de riesgo', 4, 'obligatoria', 'procedimientos', 12),
('Primeros Auxilios Pediátricos', 'Atención médica básica para menores', 16, 'recomendada', 'primeros_auxilios', 24),
('Comunicación con Menores', 'Técnicas de comunicación efectiva y empática', 4, 'recomendada', 'proteccion', 12);

-- 5. BASE DE DATOS DEL PERSONAL CON CERTIFICACIONES
-- ================================================

CREATE TABLE personal (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entidad_id text NOT NULL,
  nombre text NOT NULL,
  apellidos text,
  email text,
  telefono text,
  dni text,
  cargo text,
  departamento text,
  fecha_alta date DEFAULT CURRENT_DATE,
  fecha_baja date,
  estado text DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'suspendido', 'baja')),
  contacto_emergencia_nombre text,
  contacto_emergencia_telefono text,
  observaciones text,
  datos_adicionales jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE certificaciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  persona_id uuid REFERENCES personal(id) ON DELETE CASCADE,
  tipo text NOT NULL CHECK (tipo IN ('certificado_negativo', 'formacion_lopivi', 'primeros_auxilios', 'otros')),
  nombre_certificacion text NOT NULL,
  numero_certificado text,
  fecha_emision date,
  fecha_vencimiento date,
  estado text DEFAULT 'vigente' CHECK (estado IN ('vigente', 'proximo_vencer', 'vencido', 'renovado')),
  archivo_url text,
  entidad_emisora text,
  observaciones text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE personal_formaciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entidad_id text NOT NULL,
  persona_id uuid REFERENCES personal(id) ON DELETE CASCADE,
  formacion_id uuid REFERENCES formaciones(id) ON DELETE CASCADE,
  fecha_inicio date,
  fecha_completada date,
  puntuacion integer,
  estado text DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_curso', 'completada', 'suspendida')),
  certificado_url text,
  instructor text,
  observaciones text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Índices para personal y certificaciones
CREATE INDEX idx_personal_entidad_estado ON personal(entidad_id, estado);
CREATE INDEX idx_certificaciones_persona ON certificaciones(persona_id);
CREATE INDEX idx_certificaciones_estado ON certificaciones(estado);
CREATE INDEX idx_personal_formaciones_entidad ON personal_formaciones(entidad_id);

-- 6. HISTÓRICO DE INCIDENCIAS Y ACCIONES
-- ================================================

CREATE TABLE incidencias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entidad_id text NOT NULL,
  codigo_caso text UNIQUE NOT NULL,
  titulo text NOT NULL,
  descripcion text,
  categoria text NOT NULL CHECK (categoria IN ('maltrato_fisico', 'maltrato_psicologico', 'abuso_sexual', 'negligencia', 'acoso', 'accidente', 'conducta_inapropiada', 'otros')),
  subcategoria text,
  gravedad text NOT NULL CHECK (gravedad IN ('baja', 'media', 'alta', 'critica')),
  estado text DEFAULT 'abierto' CHECK (estado IN ('abierto', 'en_investigacion', 'en_proceso', 'resuelto', 'cerrado', 'archivado')),
  prioridad text DEFAULT 'media' CHECK (prioridad IN ('baja', 'media', 'alta', 'urgente')),
  fecha_incidencia timestamp with time zone,
  fecha_reporte timestamp with time zone DEFAULT now(),
  reportado_por text,
  afectados text[],
  testigos text[],
  ubicacion text,
  delegado_asignado text,
  autoridades_contactadas text[],
  requiere_seguimiento boolean DEFAULT false,
  confidencial boolean DEFAULT false,
  datos_adicionales jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE acciones_tomadas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incidencia_id uuid REFERENCES incidencias(id) ON DELETE CASCADE,
  fecha_accion timestamp with time zone DEFAULT now(),
  tipo_accion text NOT NULL CHECK (tipo_accion IN ('investigacion', 'entrevista', 'medida_cautelar', 'comunicacion_autoridades', 'comunicacion_familias', 'seguimiento', 'documentacion', 'formacion', 'otros')),
  titulo text NOT NULL,
  descripcion text NOT NULL,
  responsable text,
  participantes text[],
  resultado text,
  documentos_adjuntos text[],
  proximos_pasos text,
  fecha_seguimiento date,
  completada boolean DEFAULT false,
  observaciones text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE seguimientos_incidencias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incidencia_id uuid REFERENCES incidencias(id) ON DELETE CASCADE,
  fecha_seguimiento date NOT NULL,
  estado_anterior text,
  estado_nuevo text,
  resumen text,
  acciones_pendientes text,
  responsable text,
  observaciones text,
  created_at timestamp with time zone DEFAULT now()
);

-- Índices para incidencias
CREATE INDEX idx_incidencias_entidad_estado ON incidencias(entidad_id, estado);
CREATE INDEX idx_incidencias_categoria ON incidencias(categoria);
CREATE INDEX idx_incidencias_gravedad ON incidencias(gravedad);
CREATE INDEX idx_incidencias_codigo ON incidencias(codigo_caso);
CREATE INDEX idx_acciones_incidencia ON acciones_tomadas(incidencia_id);
CREATE INDEX idx_seguimientos_incidencia ON seguimientos_incidencias(incidencia_id);

-- ================================================
-- POLÍTICAS DE SEGURIDAD RLS
-- ================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE alertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE formaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_formaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE acciones_tomadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE seguimientos_incidencias ENABLE ROW LEVEL SECURITY;

-- Políticas para alertas
CREATE POLICY "Usuarios autenticados pueden ver alertas de su entidad" ON alertas
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuarios autenticados pueden crear alertas" ON alertas
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuarios autenticados pueden actualizar alertas" ON alertas
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Políticas para formaciones (lectura pública, escritura autenticada)
CREATE POLICY "Todos pueden ver formaciones activas" ON formaciones
    FOR SELECT USING (activa = true);

CREATE POLICY "Usuarios autenticados pueden gestionar formaciones" ON formaciones
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Políticas para personal
CREATE POLICY "Usuarios autenticados pueden ver personal de su entidad" ON personal
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuarios autenticados pueden gestionar personal" ON personal
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Políticas para certificaciones
CREATE POLICY "Usuarios autenticados pueden ver certificaciones" ON certificaciones
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuarios autenticados pueden gestionar certificaciones" ON certificaciones
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Políticas para personal_formaciones
CREATE POLICY "Usuarios autenticados pueden ver formaciones de personal de su entidad" ON personal_formaciones
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuarios autenticados pueden gestionar formaciones de personal" ON personal_formaciones
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Políticas para incidencias
CREATE POLICY "Usuarios autenticados pueden ver incidencias de su entidad" ON incidencias
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuarios autenticados pueden gestionar incidencias" ON incidencias
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Políticas para acciones_tomadas
CREATE POLICY "Usuarios autenticados pueden ver acciones" ON acciones_tomadas
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuarios autenticados pueden gestionar acciones" ON acciones_tomadas
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Políticas para seguimientos_incidencias
CREATE POLICY "Usuarios autenticados pueden ver seguimientos" ON seguimientos_incidencias
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuarios autenticados pueden gestionar seguimientos" ON seguimientos_incidencias
    FOR ALL USING (auth.uid() IS NOT NULL);

-- ================================================
-- FUNCIONES AUXILIARES
-- ================================================

-- Función para generar código de caso único
CREATE OR REPLACE FUNCTION generar_codigo_caso(entidad_id text)
RETURNS text AS $$
DECLARE
    contador integer;
    nuevo_codigo text;
BEGIN
    -- Obtener el próximo número secuencial para la entidad
    SELECT COALESCE(MAX(CAST(SUBSTRING(codigo_caso FROM 'CASO-(\d+)$') AS integer)), 0) + 1
    INTO contador
    FROM incidencias
    WHERE codigo_caso ~ '^CASO-\d+$'
    AND incidencias.entidad_id = generar_codigo_caso.entidad_id;

    -- Formatear con ceros a la izquierda
    nuevo_codigo := 'CASO-' || LPAD(contador::text, 4, '0');

    RETURN nuevo_codigo;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar alertas automáticamente
CREATE OR REPLACE FUNCTION actualizar_alertas_certificaciones()
RETURNS void AS $$
BEGIN
    -- Crear alertas para certificaciones próximas a vencer (30 días)
    INSERT INTO alertas (entidad_id, tipo, prioridad, titulo, descripcion, fecha_vencimiento, origen_id)
    SELECT
        p.entidad_id,
        'certificacion',
        'media',
        'Certificación próxima a vencer: ' || c.nombre_certificacion,
        'La certificación de ' || p.nombre || ' vence el ' || c.fecha_vencimiento::text,
        c.fecha_vencimiento::timestamp,
        c.id::text
    FROM certificaciones c
    JOIN personal p ON c.persona_id = p.id
    WHERE c.fecha_vencimiento <= CURRENT_DATE + INTERVAL '30 days'
    AND c.fecha_vencimiento > CURRENT_DATE
    AND c.estado = 'vigente'
    AND NOT EXISTS (
        SELECT 1 FROM alertas a
        WHERE a.origen_id = c.id::text
        AND a.tipo = 'certificacion'
        AND a.estado != 'resuelta'
    );

    -- Crear alertas para certificaciones vencidas
    INSERT INTO alertas (entidad_id, tipo, prioridad, titulo, descripcion, origen_id)
    SELECT
        p.entidad_id,
        'certificacion',
        'alta',
        'Certificación vencida: ' || c.nombre_certificacion,
        'La certificación de ' || p.nombre || ' venció el ' || c.fecha_vencimiento::text,
        c.id::text
    FROM certificaciones c
    JOIN personal p ON c.persona_id = p.id
    WHERE c.fecha_vencimiento < CURRENT_DATE
    AND c.estado = 'vigente'
    AND NOT EXISTS (
        SELECT 1 FROM alertas a
        WHERE a.origen_id = c.id::text
        AND a.tipo = 'certificacion'
        AND a.estado != 'resuelta'
    );

    -- Actualizar estado de certificaciones vencidas
    UPDATE certificaciones
    SET estado = 'vencido', updated_at = now()
    WHERE fecha_vencimiento < CURRENT_DATE
    AND estado = 'vigente';

    -- Actualizar estado de certificaciones próximas a vencer
    UPDATE certificaciones
    SET estado = 'proximo_vencer', updated_at = now()
    WHERE fecha_vencimiento <= CURRENT_DATE + INTERVAL '30 days'
    AND fecha_vencimiento > CURRENT_DATE
    AND estado = 'vigente';
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- COMENTARIOS DE DOCUMENTACIÓN
-- ================================================

COMMENT ON TABLE alertas IS 'Sistema centralizado de alertas y notificaciones para el cumplimiento LOPIVI';
COMMENT ON TABLE formaciones IS 'Catálogo de formaciones disponibles para el personal';
COMMENT ON TABLE personal IS 'Base de datos del personal de la entidad con información básica';
COMMENT ON TABLE certificaciones IS 'Registro de certificaciones y documentos del personal';
COMMENT ON TABLE personal_formaciones IS 'Seguimiento de formaciones completadas por cada persona';
COMMENT ON TABLE incidencias IS 'Registro histórico de todas las incidencias reportadas';
COMMENT ON TABLE acciones_tomadas IS 'Registro detallado de acciones realizadas para cada incidencia';
COMMENT ON TABLE seguimientos_incidencias IS 'Histórico de seguimientos y cambios de estado de incidencias';

-- ================================================
-- FIN DE MIGRACIÓN
-- ================================================
