-- ================================
-- TABLA DE CONFIGURACIÓN DEL SISTEMA
-- ================================

-- Tabla para almacenar configuración del sistema
CREATE TABLE IF NOT EXISTS configuracion_sistema (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clave TEXT UNIQUE NOT NULL, -- Identificador único de la configuración
  valor JSONB NOT NULL, -- Valor de la configuración en formato JSON
  descripcion TEXT, -- Descripción de qué configura este elemento
  categoria TEXT DEFAULT 'general', -- Categoría: 'reportes', 'notificaciones', 'general', etc.
  activo BOOLEAN DEFAULT TRUE,

  -- Metadatos de auditoría
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT DEFAULT 'sistema',
  updated_by TEXT
);

-- ================================
-- ÍNDICES
-- ================================

CREATE INDEX IF NOT EXISTS idx_configuracion_clave ON configuracion_sistema(clave);
CREATE INDEX IF NOT EXISTS idx_configuracion_categoria ON configuracion_sistema(categoria);
CREATE INDEX IF NOT EXISTS idx_configuracion_activo ON configuracion_sistema(activo);

-- ================================
-- TRIGGER PARA UPDATED_AT
-- ================================

CREATE OR REPLACE FUNCTION update_configuracion_sistema_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_configuracion_sistema_updated_at ON configuracion_sistema;
CREATE TRIGGER update_configuracion_sistema_updated_at
    BEFORE UPDATE ON configuracion_sistema
    FOR EACH ROW EXECUTE FUNCTION update_configuracion_sistema_updated_at();

-- ================================
-- CONFIGURACIONES POR DEFECTO
-- ================================

-- Configuración de reportes automáticos
INSERT INTO configuracion_sistema (clave, valor, descripcion, categoria) VALUES
(
  'reportes_automaticos',
  '{
    "activo": true,
    "frecuencia": "semanal",
    "hora_envio": "08:00",
    "email_destino": "admin@custodia360.es",
    "incluir_resueltos": false,
    "entidades_incluidas": ["*"],
    "formato_preferido": "pdf"
  }',
  'Configuración para la generación automática de reportes LOPIVI',
  'reportes'
),
(
  'notificaciones_email',
  '{
    "activo": true,
    "remitente": "noreply@custodia360.es",
    "plantilla_casos_urgentes": true,
    "plantilla_reportes": true,
    "reintento_fallidos": 3
  }',
  'Configuración del sistema de notificaciones por email',
  'notificaciones'
),
(
  'auditoria_lopivi',
  '{
    "activo": true,
    "hash_algoritmo": "sha256",
    "retencion_dias": 1825,
    "backup_automatico": true,
    "verificacion_integridad": true
  }',
  'Configuración del sistema de auditoría LOPIVI',
  'auditoria'
),
(
  'sesiones_usuario',
  '{
    "timeout_minutos": 480,
    "renovacion_automatica": true,
    "max_sesiones_concurrentes": 3,
    "logging_actividad": true
  }',
  'Configuración de sesiones de usuario y seguridad',
  'seguridad'
),
(
  'dashboard_configuracion',
  '{
    "mostrar_casos_demo": false,
    "refresh_automatico_segundos": 300,
    "notificaciones_push": true,
    "tema_predeterminado": "claro"
  }',
  'Configuración de la interfaz del dashboard',
  'dashboard'
)
ON CONFLICT (clave) DO NOTHING;

-- ================================
-- POLÍTICAS DE SEGURIDAD
-- ================================

-- Desactivar RLS para permitir acceso del sistema
ALTER TABLE configuracion_sistema DISABLE ROW LEVEL SECURITY;

-- ================================
-- COMENTARIOS
-- ================================

COMMENT ON TABLE configuracion_sistema IS 'Almacena configuración del sistema Custodia360';
COMMENT ON COLUMN configuracion_sistema.clave IS 'Identificador único de la configuración';
COMMENT ON COLUMN configuracion_sistema.valor IS 'Valor en formato JSON con la configuración';
COMMENT ON COLUMN configuracion_sistema.categoria IS 'Categoría para agrupar configuraciones';

-- ================================
-- FUNCIONES AUXILIARES
-- ================================

-- Función para obtener configuración por clave
CREATE OR REPLACE FUNCTION obtener_configuracion(config_key TEXT)
RETURNS JSONB AS $$
DECLARE
    config_value JSONB;
BEGIN
    SELECT valor INTO config_value
    FROM configuracion_sistema
    WHERE clave = config_key AND activo = TRUE;

    RETURN COALESCE(config_value, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar configuración
CREATE OR REPLACE FUNCTION actualizar_configuracion(
    config_key TEXT,
    config_value JSONB,
    updated_by_user TEXT DEFAULT 'sistema'
)
RETURNS BOOLEAN AS $$
BEGIN
    INSERT INTO configuracion_sistema (clave, valor, updated_by)
    VALUES (config_key, config_value, updated_by_user)
    ON CONFLICT (clave)
    DO UPDATE SET
        valor = EXCLUDED.valor,
        updated_by = EXCLUDED.updated_by,
        updated_at = NOW();

    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- ================================
-- EJEMPLOS DE USO
-- ================================

/*
-- Obtener configuración de reportes automáticos:
SELECT obtener_configuracion('reportes_automaticos');

-- Actualizar configuración:
SELECT actualizar_configuracion(
    'reportes_automaticos',
    '{"activo": true, "frecuencia": "diario", "hora_envio": "09:00"}'::jsonb,
    'admin_user'
);

-- Ver todas las configuraciones activas:
SELECT clave, valor, categoria, updated_at
FROM configuracion_sistema
WHERE activo = TRUE
ORDER BY categoria, clave;
*/
