-- =====================================================
-- Migración: Logs de Acciones Administrativas + Plantilla Email Kit Comunicación
-- Fecha: 15 Octubre 2025
-- Descripción: Sistema de auditoría para acciones admin del Kit de Comunicación
-- =====================================================

-- Tabla de logs para acciones administrativas
CREATE TABLE IF NOT EXISTS admin_actions_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor TEXT,                                    -- Email/ID del admin que realiza la acción
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  action TEXT NOT NULL,                          -- 'kit_comm_toggle' | 'kit_comm_invite' | etc
  metadata JSONB DEFAULT '{}'::jsonb,            -- Datos adicionales (valor anterior, nuevo, etc)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comentarios descriptivos
COMMENT ON TABLE admin_actions_log IS 'Registro de acciones administrativas para auditoría';
COMMENT ON COLUMN admin_actions_log.actor IS 'Email o ID del administrador que realizó la acción';
COMMENT ON COLUMN admin_actions_log.action IS 'Tipo de acción: kit_comm_toggle, kit_comm_invite, etc';
COMMENT ON COLUMN admin_actions_log.metadata IS 'Información adicional sobre la acción (JSON)';

-- Índices para mejorar consultas
CREATE INDEX IF NOT EXISTS idx_admin_actions_entity ON admin_actions_log(entity_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_created ON admin_actions_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_actions_action ON admin_actions_log(action);

-- RLS (Row Level Security)
ALTER TABLE admin_actions_log ENABLE ROW LEVEL SECURITY;

-- Política: Solo admins pueden leer logs
CREATE POLICY admin_actions_log_read ON admin_actions_log
  FOR SELECT
  USING (true); -- Se controlará desde el backend con Service Role Key

-- Política: Solo admins pueden insertar logs
CREATE POLICY admin_actions_log_insert ON admin_actions_log
  FOR INSERT
  WITH CHECK (true); -- Se controlará desde el backend con Service Role Key

-- =====================================================
-- Plantilla de Email: Invitación Kit de Comunicación LOPIVI
-- =====================================================

INSERT INTO message_templates(scope, nombre, slug, asunto, cuerpo, segmento) VALUES
(
  'email',
  'Invitación Kit Comunicación LOPIVI',
  'kit-comm-invite',
  'Custodia360 | Activa el Kit de Comunicación LOPIVI para tu entidad',
  E'Hola {{responsable}},\n\nDesde Custodia360 te recomendamos activar el Kit de Comunicación LOPIVI para disponer de las plantillas oficiales y canales de comunicación adaptados específicamente a tu entidad.\n\n**¿Qué incluye el Kit de Comunicación LOPIVI?**\n\n• +20 plantillas profesionales adaptadas a tu sector\n• Canal de comunicación integrado (Email/WhatsApp)\n• Plantillas para familias, personal y directivos\n• Documentación legal actualizada automáticamente\n• Soporte especializado incluido\n\n**Actívalo ahora:**\n{{link_contratacion}}\n\nCon el Kit de Comunicación, tu delegado podrá:\n- Enviar comunicados oficiales con un clic\n- Gestionar autorizaciones y recordatorios\n- Mantener informadas a las familias\n- Cumplir con los requisitos LOPIVI de comunicación\n\nSi tienes alguna duda, estamos a tu disposición.\n\nUn saludo,\nEquipo Custodia360\nhttps://www.custodia360.es',
  'todos'
)
ON CONFLICT (slug) DO UPDATE SET
  cuerpo = EXCLUDED.cuerpo,
  asunto = EXCLUDED.asunto,
  nombre = EXCLUDED.nombre;
