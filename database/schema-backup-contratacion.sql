-- Tabla para backups de formularios de contratación
CREATE TABLE IF NOT EXISTS backups_contratacion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entidad_id VARCHAR(255) NOT NULL,
    tipo_backup VARCHAR(50) NOT NULL DEFAULT 'manual',
    datos_formulario JSONB NOT NULL,
    fecha_backup TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(50) DEFAULT 'pendiente',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_backups_contratacion_entidad ON backups_contratacion(entidad_id);
CREATE INDEX IF NOT EXISTS idx_backups_contratacion_fecha ON backups_contratacion(fecha_backup);
CREATE INDEX IF NOT EXISTS idx_backups_contratacion_tipo ON backups_contratacion(tipo_backup);
CREATE INDEX IF NOT EXISTS idx_backups_contratacion_estado ON backups_contratacion(estado);

-- Función para actualizar el timestamp
CREATE OR REPLACE FUNCTION update_backups_contratacion_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para auto-actualizar updated_at
CREATE TRIGGER update_backups_contratacion_updated_at
    BEFORE UPDATE ON backups_contratacion
    FOR EACH ROW
    EXECUTE FUNCTION update_backups_contratacion_updated_at();

-- Comentarios de documentación
COMMENT ON TABLE backups_contratacion IS 'Tabla para almacenar backups de formularios de contratación';
COMMENT ON COLUMN backups_contratacion.entidad_id IS 'ID de la entidad que realizó la contratación';
COMMENT ON COLUMN backups_contratacion.tipo_backup IS 'Tipo de backup: manual, automatico, programado';
COMMENT ON COLUMN backups_contratacion.datos_formulario IS 'Datos completos del formulario en formato JSON';
COMMENT ON COLUMN backups_contratacion.fecha_backup IS 'Fecha y hora cuando se realizó el backup';
COMMENT ON COLUMN backups_contratacion.estado IS 'Estado del backup: pendiente, completado, error';
COMMENT ON COLUMN backups_contratacion.metadata IS 'Metadatos adicionales del backup';

-- Política de seguridad (RLS)
ALTER TABLE backups_contratacion ENABLE ROW LEVEL SECURITY;

-- Política para que solo puedan ver sus propios backups
CREATE POLICY "Los usuarios solo pueden ver sus propios backups de contratación"
ON backups_contratacion FOR SELECT
USING (true); -- Ajustar según la lógica de autenticación

-- Política para insertar backups
CREATE POLICY "Permitir insertar backups de contratación"
ON backups_contratacion FOR INSERT
WITH CHECK (true); -- Ajustar según la lógica de autenticación

-- Política para eliminar backups
CREATE POLICY "Permitir eliminar backups de contratación"
ON backups_contratacion FOR DELETE
USING (true); -- Ajustar según la lógica de autenticación

-- Insertar datos de ejemplo para testing
INSERT INTO backups_contratacion (entidad_id, tipo_backup, datos_formulario, estado) VALUES
(
    'test-entidad-001',
    'manual',
    '{
        "entidad": {
            "nombre": "Club Deportivo Test",
            "cif": "B12345678",
            "direccion": "Calle Test 123",
            "telefono": "666123456",
            "email": "test@club.com"
        },
        "delegado_principal": {
            "nombre": "Juan Pérez",
            "dni": "12345678A",
            "email": "juan@club.com",
            "telefono": "666111222"
        },
        "delegado_suplente": {
            "nombre": "María García",
            "dni": "87654321B",
            "email": "maria@club.com",
            "telefono": "666333444"
        },
        "plan_seleccionado": "plan_completo",
        "fecha_contratacion": "2024-09-26"
    }',
    'completado'
),
(
    'test-entidad-002',
    'automatico',
    '{
        "entidad": {
            "nombre": "Asociación Deportiva Test 2",
            "cif": "B87654321",
            "direccion": "Avenida Test 456",
            "telefono": "666987654",
            "email": "test2@asociacion.com"
        },
        "delegado_principal": {
            "nombre": "Carlos López",
            "dni": "11111111C",
            "email": "carlos@asociacion.com",
            "telefono": "666555666"
        },
        "plan_seleccionado": "plan_basico",
        "fecha_contratacion": "2024-09-25"
    }',
    'completado'
);
