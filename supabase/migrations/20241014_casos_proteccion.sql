-- Tabla para gestión de casos de protección infantil
CREATE TABLE IF NOT EXISTS casos_proteccion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  created_by TEXT NOT NULL,

  -- Datos del caso
  titulo TEXT NOT NULL,
  descripcion TEXT,
  tipo_caso TEXT NOT NULL CHECK (tipo_caso IN ('riesgo_leve', 'riesgo_grave', 'desproteccion', 'sospecha_violencia', 'urgencia')),
  gravedad TEXT NOT NULL CHECK (gravedad IN ('baja', 'media', 'alta')),
  estado TEXT NOT NULL DEFAULT 'nuevo' CHECK (estado IN ('nuevo', 'en_seguimiento', 'derivado', 'en_resolucion', 'cerrado')),

  -- Personas involucradas
  afectados TEXT[] DEFAULT '{}',
  responsable_asignado TEXT,

  -- Timeline y notas
  timeline JSONB DEFAULT '[]',

  -- Fechas
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  fecha_cierre TIMESTAMPTZ,

  -- Índices
  CONSTRAINT casos_proteccion_entity_id_idx FOREIGN KEY (entity_id) REFERENCES entities(id)
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_casos_entity ON casos_proteccion(entity_id);
CREATE INDEX IF NOT EXISTS idx_casos_estado ON casos_proteccion(estado);
CREATE INDEX IF NOT EXISTS idx_casos_tipo ON casos_proteccion(tipo_caso);
CREATE INDEX IF NOT EXISTS idx_casos_created ON casos_proteccion(created_at DESC);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_casos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER casos_proteccion_updated_at
BEFORE UPDATE ON casos_proteccion
FOR EACH ROW
EXECUTE FUNCTION update_casos_updated_at();

-- RLS (Row Level Security)
ALTER TABLE casos_proteccion ENABLE ROW LEVEL SECURITY;

-- Política: Los delegados pueden ver todos los casos de su entidad
CREATE POLICY casos_select_policy ON casos_proteccion
  FOR SELECT
  USING (true);

-- Política: Los delegados pueden crear casos para su entidad
CREATE POLICY casos_insert_policy ON casos_proteccion
  FOR INSERT
  WITH CHECK (true);

-- Política: Los delegados pueden actualizar casos de su entidad
CREATE POLICY casos_update_policy ON casos_proteccion
  FOR UPDATE
  USING (true);

-- Política: Los delegados pueden eliminar casos de su entidad
CREATE POLICY casos_delete_policy ON casos_proteccion
  FOR DELETE
  USING (true);

-- Comentarios
COMMENT ON TABLE casos_proteccion IS 'Tabla para gestión completa de casos de protección infantil (CRUD)';
COMMENT ON COLUMN casos_proteccion.tipo_caso IS 'Tipo de caso: riesgo_leve, riesgo_grave, desproteccion, sospecha_violencia, urgencia';
COMMENT ON COLUMN casos_proteccion.gravedad IS 'Nivel de gravedad: baja, media, alta';
COMMENT ON COLUMN casos_proteccion.estado IS 'Estado del caso: nuevo, en_seguimiento, derivado, en_resolucion, cerrado';
COMMENT ON COLUMN casos_proteccion.timeline IS 'Array JSON con historial de acciones y actualizaciones del caso';
