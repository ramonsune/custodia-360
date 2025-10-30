-- ============================================================
-- MIGRACIÓN BASE: Tablas fundamentales del sistema
-- EJECUTAR ESTO PRIMERO antes de la migración de formación
-- ============================================================

-- 1) Tabla de entidades (organizaciones)
CREATE TABLE IF NOT EXISTS entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  cif TEXT,
  email TEXT,
  telefono TEXT,
  direccion TEXT,
  sector TEXT,
  tipo_entidad TEXT,
  token TEXT UNIQUE,
  stripe_customer_id TEXT,
  plan TEXT DEFAULT 'free',
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_entities_token ON entities(token);
CREATE INDEX IF NOT EXISTS idx_entities_email ON entities(email);

-- 2) Tabla de personas
CREATE TABLE IF NOT EXISTS people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  apellidos TEXT,
  email TEXT UNIQUE,
  telefono TEXT,
  dni TEXT,
  fecha_nacimiento DATE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_people_email ON people(email);
CREATE INDEX IF NOT EXISTS idx_people_user_id ON people(user_id);

-- 3) Tabla de roles de personas en entidades
CREATE TABLE IF NOT EXISTS entity_people_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  person_id UUID REFERENCES people(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(entity_id, person_id, role)
);

CREATE INDEX IF NOT EXISTS idx_entity_people_entity ON entity_people_roles(entity_id);
CREATE INDEX IF NOT EXISTS idx_entity_people_person ON entity_people_roles(person_id);
CREATE INDEX IF NOT EXISTS idx_entity_people_role ON entity_people_roles(role);

-- 4) Tabla de plantillas de mensajes (para emails)
CREATE TABLE IF NOT EXISTS message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scope TEXT DEFAULT 'email',
  nombre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  asunto TEXT,
  cuerpo TEXT NOT NULL,
  segmento TEXT DEFAULT 'todos',
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_message_templates_slug ON message_templates(slug);
CREATE INDEX IF NOT EXISTS idx_message_templates_activo ON message_templates(activo);

-- 5) Habilitar RLS en las tablas
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_people_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;

-- 6) Políticas básicas (permitir todo para desarrollo)
DROP POLICY IF EXISTS entities_all ON entities;
CREATE POLICY entities_all ON entities FOR ALL USING (true);

DROP POLICY IF EXISTS people_all ON people;
CREATE POLICY people_all ON people FOR ALL USING (true);

DROP POLICY IF EXISTS entity_people_roles_all ON entity_people_roles;
CREATE POLICY entity_people_roles_all ON entity_people_roles FOR ALL USING (true);

DROP POLICY IF EXISTS message_templates_all ON message_templates;
CREATE POLICY message_templates_all ON message_templates FOR ALL USING (true);

-- 7) Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8) Triggers para actualizar updated_at
DROP TRIGGER IF EXISTS entities_updated_at ON entities;
CREATE TRIGGER entities_updated_at
BEFORE UPDATE ON entities
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS people_updated_at ON people;
CREATE TRIGGER people_updated_at
BEFORE UPDATE ON people
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS entity_people_roles_updated_at ON entity_people_roles;
CREATE TRIGGER entity_people_roles_updated_at
BEFORE UPDATE ON entity_people_roles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Comentarios
COMMENT ON TABLE entities IS 'Organizaciones/entidades del sistema';
COMMENT ON TABLE people IS 'Personas del sistema';
COMMENT ON TABLE entity_people_roles IS 'Roles de personas en entidades';
COMMENT ON TABLE message_templates IS 'Plantillas de mensajes (emails, SMS, etc.)';
