-- Tabla para almacenar registros de miembros de entidades
-- Creada para el proceso de onboarding LOPIVI

CREATE TABLE IF NOT EXISTS entity_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id TEXT NOT NULL REFERENCES entities(id) ON DELETE CASCADE,

  -- Datos personales
  nombre TEXT NOT NULL,
  dni TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,

  -- Rol y cargo
  rol TEXT NOT NULL CHECK (rol IN ('personal-con-contacto', 'personal-sin-contacto', 'familia', 'directiva')),
  cargo TEXT,

  -- Familias
  nombres_menores TEXT,

  -- Aceptaciones y compromisos
  acepta_codigo_conducta BOOLEAN DEFAULT false,
  acepta_formacion_lopivi BOOLEAN DEFAULT false,
  autorizacion_imagen BOOLEAN DEFAULT false,
  consentimiento_canal BOOLEAN DEFAULT false,
  ha_entregado_certificado BOOLEAN DEFAULT false,

  -- Directiva
  tiene_contacto_ocasional BOOLEAN,

  -- Certificado de penales
  certificado_penales_url TEXT,
  certificado_validado BOOLEAN DEFAULT false,
  certificado_validado_at TIMESTAMPTZ,
  certificado_validado_por UUID,

  -- Token de onboarding usado
  onboarding_token TEXT,

  -- Estado del registro
  estado TEXT DEFAULT 'pendiente_validacion' CHECK (estado IN ('pendiente_validacion', 'validado', 'rechazado', 'activo', 'inactivo')),
  estado_notas TEXT,

  -- Formación LOPIVI
  formacion_completada BOOLEAN DEFAULT false,
  formacion_completada_at TIMESTAMPTZ,

  -- Usuario creado en el sistema
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Auditoría
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  validado_at TIMESTAMPTZ,
  validado_por UUID
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_entity_members_entity_id ON entity_members(entity_id);
CREATE INDEX IF NOT EXISTS idx_entity_members_email ON entity_members(email);
CREATE INDEX IF NOT EXISTS idx_entity_members_dni ON entity_members(dni);
CREATE INDEX IF NOT EXISTS idx_entity_members_rol ON entity_members(rol);
CREATE INDEX IF NOT EXISTS idx_entity_members_estado ON entity_members(estado);
CREATE INDEX IF NOT EXISTS idx_entity_members_token ON entity_members(onboarding_token);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_entity_members_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER entity_members_updated_at
  BEFORE UPDATE ON entity_members
  FOR EACH ROW
  EXECUTE FUNCTION update_entity_members_updated_at();

-- RLS (Row Level Security) - Los delegados solo ven miembros de su entidad
ALTER TABLE entity_members ENABLE ROW LEVEL SECURITY;

-- Policy para lectura: solo miembros de la misma entidad
CREATE POLICY entity_members_read_policy ON entity_members
  FOR SELECT
  USING (
    entity_id IN (
      SELECT entity_id FROM delegados WHERE user_id = auth.uid()
    )
  );

-- Policy para inserción: servicio puede insertar durante onboarding
CREATE POLICY entity_members_insert_policy ON entity_members
  FOR INSERT
  WITH CHECK (true); -- Controlado por service_role en la API

-- Policy para actualización: solo delegados de la entidad
CREATE POLICY entity_members_update_policy ON entity_members
  FOR UPDATE
  USING (
    entity_id IN (
      SELECT entity_id FROM delegados WHERE user_id = auth.uid()
    )
  );

-- Comentarios para documentación
COMMENT ON TABLE entity_members IS 'Miembros registrados de entidades a través del proceso de onboarding LOPIVI';
COMMENT ON COLUMN entity_members.rol IS 'Tipo de rol: personal-con-contacto, personal-sin-contacto, familia, directiva';
COMMENT ON COLUMN entity_members.estado IS 'Estado del registro: pendiente_validacion, validado, rechazado, activo, inactivo';
COMMENT ON COLUMN entity_members.certificado_penales_url IS 'URL del certificado de penales subido (almacenado en Supabase Storage)';
