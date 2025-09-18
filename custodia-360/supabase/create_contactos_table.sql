-- Crear tabla de contactos
CREATE TABLE IF NOT EXISTS contactos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefono VARCHAR(50),
  empresa VARCHAR(255),
  mensaje TEXT NOT NULL,
  estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'respondido', 'archivado')),
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_respuesta TIMESTAMP WITH TIME ZONE,
  notas_internas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para búsquedas rápidas
CREATE INDEX idx_contactos_email ON contactos(email);
CREATE INDEX idx_contactos_estado ON contactos(estado);
CREATE INDEX idx_contactos_fecha ON contactos(fecha_creacion DESC);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at
CREATE TRIGGER update_contactos_updated_at BEFORE UPDATE
  ON contactos FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE contactos ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserción pública (desde el formulario)
CREATE POLICY "Permitir inserción pública de contactos" ON contactos
  FOR INSERT TO anon
  WITH CHECK (true);

-- Política para que solo usuarios autenticados puedan ver y modificar
CREATE POLICY "Solo usuarios autenticados pueden ver contactos" ON contactos
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Solo usuarios autenticados pueden actualizar contactos" ON contactos
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- Comentarios para documentación
COMMENT ON TABLE contactos IS 'Tabla para almacenar todos los mensajes de contacto del formulario web';
COMMENT ON COLUMN contactos.estado IS 'Estado del contacto: pendiente, respondido o archivado';
COMMENT ON COLUMN contactos.notas_internas IS 'Notas internas del equipo sobre el contacto';
