-- =============================================
-- ESQUEMA DE BASE DE DATOS: MONITOREO BOE
-- Sistema automático de detección de cambios LOPIVI
-- =============================================

-- Tabla principal: Cambios BOE detectados
CREATE TABLE IF NOT EXISTS cambios_boe (
    id VARCHAR(255) PRIMARY KEY,
    fecha_publicacion DATE NOT NULL,
    numero_boe VARCHAR(50) NOT NULL UNIQUE,
    titulo TEXT NOT NULL,
    url_completa TEXT NOT NULL,
    contenido_relevante TEXT,
    impacto_detectado VARCHAR(20) CHECK (impacto_detectado IN ('CRITICO', 'ALTO', 'MEDIO', 'BAJO')) NOT NULL,
    areas_afectadas TEXT[] NOT NULL DEFAULT '{}',
    estado VARCHAR(20) CHECK (estado IN ('DETECTADO', 'ANALIZANDO', 'IMPLEMENTADO', 'COMUNICADO')) DEFAULT 'DETECTADO',
    fecha_deteccion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_implementacion TIMESTAMP WITH TIME ZONE,
    entidades_afectadas INTEGER DEFAULT 0,
    observaciones TEXT,
    analisis_ia JSONB, -- Resultado completo del análisis de IA
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de cambios requeridos por cada cambio BOE
CREATE TABLE IF NOT EXISTS cambios_requeridos (
    id SERIAL PRIMARY KEY,
    cambio_boe_id VARCHAR(255) REFERENCES cambios_boe(id) ON DELETE CASCADE,
    tipo VARCHAR(30) CHECK (tipo IN ('PDF_TEMPLATE', 'EMAIL_TEMPLATE', 'FUNCIONALIDAD', 'DATOS', 'RECORDATORIO')) NOT NULL,
    descripcion TEXT NOT NULL,
    archivos_afectados TEXT[] NOT NULL DEFAULT '{}',
    prioridad VARCHAR(20) CHECK (prioridad IN ('INMEDIATA', 'ALTA', 'MEDIA', 'BAJA')) NOT NULL,
    implementado BOOLEAN DEFAULT FALSE,
    fecha_implementacion TIMESTAMP WITH TIME ZONE,
    notas_implementacion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de logs del sistema de monitoreo
CREATE TABLE IF NOT EXISTS monitoreo_logs (
    id SERIAL PRIMARY KEY,
    tipo_evento VARCHAR(50) NOT NULL, -- 'EJECUCION', 'ERROR', 'DETECCION', 'IMPLEMENTACION'
    descripcion TEXT NOT NULL,
    detalles JSONB,
    nivel VARCHAR(20) CHECK (nivel IN ('INFO', 'WARNING', 'ERROR', 'CRITICAL')) DEFAULT 'INFO',
    cambio_boe_id VARCHAR(255) REFERENCES cambios_boe(id) ON DELETE SET NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de configuración del sistema de monitoreo
CREATE TABLE IF NOT EXISTS monitoreo_config (
    id SERIAL PRIMARY KEY,
    clave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT,
    descripcion TEXT,
    tipo VARCHAR(20) DEFAULT 'STRING', -- 'STRING', 'NUMBER', 'BOOLEAN', 'JSON'
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de notificaciones enviadas
CREATE TABLE IF NOT EXISTS notificaciones_boe (
    id SERIAL PRIMARY KEY,
    cambio_boe_id VARCHAR(255) REFERENCES cambios_boe(id) ON DELETE CASCADE,
    entidad_id UUID REFERENCES entidades(id) ON DELETE CASCADE,
    tipo_notificacion VARCHAR(50) NOT NULL, -- 'EMAIL_URGENTE', 'EMAIL_DETALLADO', 'PUSH'
    destinatario VARCHAR(255) NOT NULL,
    asunto TEXT,
    estado VARCHAR(20) CHECK (estado IN ('ENVIADO', 'FALLIDO', 'PENDIENTE')) DEFAULT 'PENDIENTE',
    fecha_envio TIMESTAMP WITH TIME ZONE,
    error_envio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =============================================

CREATE INDEX IF NOT EXISTS idx_cambios_boe_fecha_deteccion ON cambios_boe(fecha_deteccion DESC);
CREATE INDEX IF NOT EXISTS idx_cambios_boe_estado ON cambios_boe(estado);
CREATE INDEX IF NOT EXISTS idx_cambios_boe_impacto ON cambios_boe(impacto_detectado);
CREATE INDEX IF NOT EXISTS idx_cambios_boe_numero ON cambios_boe(numero_boe);

CREATE INDEX IF NOT EXISTS idx_cambios_requeridos_boe_id ON cambios_requeridos(cambio_boe_id);
CREATE INDEX IF NOT EXISTS idx_cambios_requeridos_tipo ON cambios_requeridos(tipo);
CREATE INDEX IF NOT EXISTS idx_cambios_requeridos_implementado ON cambios_requeridos(implementado);

CREATE INDEX IF NOT EXISTS idx_monitoreo_logs_timestamp ON monitoreo_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_monitoreo_logs_tipo ON monitoreo_logs(tipo_evento);
CREATE INDEX IF NOT EXISTS idx_monitoreo_logs_nivel ON monitoreo_logs(nivel);

CREATE INDEX IF NOT EXISTS idx_notificaciones_entidad ON notificaciones_boe(entidad_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_estado ON notificaciones_boe(estado);

-- =============================================
-- FUNCIONES AUXILIARES
-- =============================================

-- Función para actualizar timestamp automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at en cambios_boe
CREATE TRIGGER update_cambios_boe_updated_at
    BEFORE UPDATE ON cambios_boe
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar updated_at en monitoreo_config
CREATE TRIGGER update_monitoreo_config_updated_at
    BEFORE UPDATE ON monitoreo_config
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- CONFIGURACIÓN INICIAL DEL SISTEMA
-- =============================================

INSERT INTO monitoreo_config (clave, valor, descripcion, tipo) VALUES
('sistema_activo', 'true', 'Sistema de monitoreo BOE activado', 'BOOLEAN'),
('frecuencia_dias', '15', 'Frecuencia de monitoreo en días', 'NUMBER'),
('ultima_ejecucion', '', 'Timestamp de la última ejecución', 'STRING'),
('proxima_ejecucion', '', 'Timestamp de la próxima ejecución programada', 'STRING'),
('keywords_lopivi', '["protección integral infancia","protección menor","lopivi","delegado protección","plan protección","violencia infancia","entidades deportivas","actividades menores","certificación delegado","formación protección","protocolo actuación","entorno seguro"]', 'Keywords para filtrar contenido LOPIVI', 'JSON'),
('notificacion_errores_email', 'admin@custodia360.es', 'Email para notificar errores críticos', 'STRING'),
('openai_model', 'gpt-4', 'Modelo de IA para análisis de contenido', 'STRING'),
('boe_rss_url', 'https://www.boe.es/rss/boe.xml', 'URL del RSS del BOE', 'STRING'),
('entidades_por_lote_notificacion', '50', 'Número de entidades a notificar por lote', 'NUMBER')
ON CONFLICT (clave) DO NOTHING;

-- =============================================
-- VISTAS ÚTILES PARA REPORTES
-- =============================================

-- Vista de resumen de cambios por mes
CREATE OR REPLACE VIEW vista_cambios_por_mes AS
SELECT
    DATE_TRUNC('month', fecha_deteccion) as mes,
    COUNT(*) as total_cambios,
    COUNT(CASE WHEN impacto_detectado = 'CRITICO' THEN 1 END) as criticos,
    COUNT(CASE WHEN impacto_detectado = 'ALTO' THEN 1 END) as altos,
    COUNT(CASE WHEN impacto_detectado = 'MEDIO' THEN 1 END) as medios,
    COUNT(CASE WHEN impacto_detectado = 'BAJO' THEN 1 END) as bajos,
    SUM(entidades_afectadas) as total_entidades_afectadas
FROM cambios_boe
GROUP BY DATE_TRUNC('month', fecha_deteccion)
ORDER BY mes DESC;

-- Vista de cambios pendientes de implementar
CREATE OR REPLACE VIEW vista_cambios_pendientes AS
SELECT
    cb.id,
    cb.titulo,
    cb.impacto_detectado,
    cb.fecha_deteccion,
    COUNT(cr.id) as total_cambios_requeridos,
    COUNT(CASE WHEN cr.implementado = false THEN 1 END) as pendientes_implementar
FROM cambios_boe cb
LEFT JOIN cambios_requeridos cr ON cb.id = cr.cambio_boe_id
WHERE cb.estado != 'COMUNICADO'
GROUP BY cb.id, cb.titulo, cb.impacto_detectado, cb.fecha_deteccion
HAVING COUNT(CASE WHEN cr.implementado = false THEN 1 END) > 0
ORDER BY cb.fecha_deteccion DESC;

-- Vista de estadísticas del sistema
CREATE OR REPLACE VIEW vista_estadisticas_monitoreo AS
SELECT
    (SELECT COUNT(*) FROM cambios_boe WHERE fecha_deteccion >= NOW() - INTERVAL '30 days') as cambios_ultimo_mes,
    (SELECT COUNT(*) FROM cambios_boe WHERE estado = 'COMUNICADO') as cambios_procesados,
    (SELECT COUNT(*) FROM monitoreo_logs WHERE nivel = 'ERROR' AND timestamp >= NOW() - INTERVAL '7 days') as errores_ultima_semana,
    (SELECT valor FROM monitoreo_config WHERE clave = 'ultima_ejecucion') as ultima_ejecucion,
    (SELECT valor FROM monitoreo_config WHERE clave = 'sistema_activo') as sistema_activo;

-- =============================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- =============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE cambios_boe ENABLE ROW LEVEL SECURITY;
ALTER TABLE cambios_requeridos ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoreo_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoreo_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificaciones_boe ENABLE ROW LEVEL SECURITY;

-- Política para administradores (acceso completo)
CREATE POLICY "Admin full access cambios_boe" ON cambios_boe
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access cambios_requeridos" ON cambios_requeridos
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access monitoreo_logs" ON monitoreo_logs
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access monitoreo_config" ON monitoreo_config
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access notificaciones_boe" ON notificaciones_boe
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');

-- Política para lectura pública de cambios comunicados (para mostrar en web)
CREATE POLICY "Public read cambios comunicados" ON cambios_boe
    FOR SELECT
    USING (estado = 'COMUNICADO');

-- =============================================
-- COMENTARIOS PARA DOCUMENTACIÓN
-- =============================================

COMMENT ON TABLE cambios_boe IS 'Registro de todos los cambios BOE detectados relacionados con LOPIVI';
COMMENT ON TABLE cambios_requeridos IS 'Cambios específicos requeridos en el sistema por cada cambio BOE';
COMMENT ON TABLE monitoreo_logs IS 'Logs del sistema de monitoreo para auditoría y debugging';
COMMENT ON TABLE monitoreo_config IS 'Configuración del sistema de monitoreo BOE';
COMMENT ON TABLE notificaciones_boe IS 'Registro de notificaciones enviadas a clientes por cambios BOE';

COMMENT ON COLUMN cambios_boe.analisis_ia IS 'Resultado completo del análisis de IA en formato JSON';
COMMENT ON COLUMN cambios_boe.areas_afectadas IS 'Array de áreas del sistema afectadas por el cambio';
COMMENT ON COLUMN cambios_requeridos.archivos_afectados IS 'Array de archivos que requieren modificación';

-- =============================================
-- DATOS DE EJEMPLO PARA DESARROLLO
-- =============================================

-- Insertar cambio BOE de ejemplo
INSERT INTO cambios_boe (
    id,
    fecha_publicacion,
    numero_boe,
    titulo,
    url_completa,
    contenido_relevante,
    impacto_detectado,
    areas_afectadas,
    estado,
    entidades_afectadas,
    analisis_ia
) VALUES (
    'boe-ejemplo-2025-001',
    '2025-01-25',
    'BOE-A-2025-001234',
    'Orden por la que se modifica el protocolo de actuación en centros deportivos',
    'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-001234',
    'Modificación de los requisitos para delegados de protección en entidades deportivas...',
    'ALTO',
    ARRAY['certificacion_delegados', 'planes_proteccion', 'formacion'],
    'COMUNICADO',
    147,
    '{"es_relevante_lopivi": true, "resumen_cambios": "Nuevos requisitos formativos", "urgencia": "24H"}'::jsonb
) ON CONFLICT (numero_boe) DO NOTHING;

-- Insertar cambios requeridos de ejemplo
INSERT INTO cambios_requeridos (
    cambio_boe_id,
    tipo,
    descripcion,
    archivos_afectados,
    prioridad,
    implementado
) VALUES
(
    'boe-ejemplo-2025-001',
    'PDF_TEMPLATE',
    'Actualizar template certificado delegado principal',
    ARRAY['cert-delegado-principal.tsx', 'cert-delegado-suplente.tsx'],
    'ALTA',
    true
),
(
    'boe-ejemplo-2025-001',
    'EMAIL_TEMPLATE',
    'Actualizar email notificación certificación',
    ARRAY['email-templates.ts'],
    'MEDIA',
    true
) ON CONFLICT DO NOTHING;

-- Log de ejemplo
INSERT INTO monitoreo_logs (
    tipo_evento,
    descripcion,
    detalles,
    nivel,
    cambio_boe_id
) VALUES (
    'DETECCION',
    'Cambio BOE detectado y procesado exitosamente',
    '{"tiempo_procesamiento": "2.3s", "entidades_notificadas": 147}'::jsonb,
    'INFO',
    'boe-ejemplo-2025-001'
);

-- =============================================
-- FUNCIONES PARA ESTADÍSTICAS
-- =============================================

-- Función para obtener resumen ejecutivo
CREATE OR REPLACE FUNCTION get_resumen_monitoreo()
RETURNS JSON AS $$
DECLARE
    resultado JSON;
BEGIN
    SELECT json_build_object(
        'cambios_total', (SELECT COUNT(*) FROM cambios_boe),
        'cambios_ultimo_mes', (SELECT COUNT(*) FROM cambios_boe WHERE fecha_deteccion >= NOW() - INTERVAL '30 days'),
        'criticos_ultimo_mes', (SELECT COUNT(*) FROM cambios_boe WHERE impacto_detectado = 'CRITICO' AND fecha_deteccion >= NOW() - INTERVAL '30 days'),
        'entidades_promedio_afectadas', (SELECT COALESCE(AVG(entidades_afectadas), 0)::INTEGER FROM cambios_boe),
        'tiempo_promedio_implementacion', (
            SELECT COALESCE(
                EXTRACT(HOURS FROM AVG(fecha_implementacion - fecha_deteccion))::INTEGER,
                0
            )
            FROM cambios_boe
            WHERE fecha_implementacion IS NOT NULL
        ),
        'sistema_activo', (SELECT valor::BOOLEAN FROM monitoreo_config WHERE clave = 'sistema_activo')
    ) INTO resultado;

    RETURN resultado;
END;
$$ LANGUAGE plpgsql;
