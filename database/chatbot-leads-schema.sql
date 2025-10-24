-- ============================================
-- CHATBOT LEADS - Sistema de Captura de Leads
-- ============================================
-- Fecha: 23 Octubre 2025
-- Propósito: Guardar preguntas del chatbot que no tienen respuesta automática

-- Tabla principal: chatbot_leads
CREATE TABLE IF NOT EXISTS chatbot_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Mensaje del usuario
  user_message text NOT NULL,
  language text NOT NULL DEFAULT 'es', -- es, ca, eu, gl

  -- Datos de contacto
  nombre text NOT NULL,
  email text NOT NULL,
  telefono text,
  nombre_entidad text,

  -- Metadatos
  created_at timestamp with time zone DEFAULT now(),
  contacted_at timestamp with time zone,
  resolved_at timestamp with time zone,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'resolved', 'spam')),

  -- Información adicional
  admin_notes text,
  ip_address text,
  user_agent text,

  -- Índices para búsqueda
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_chatbot_leads_created_at ON chatbot_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chatbot_leads_status ON chatbot_leads(status);
CREATE INDEX IF NOT EXISTS idx_chatbot_leads_email ON chatbot_leads(email);

-- RLS: Solo admins pueden ver los leads
ALTER TABLE chatbot_leads ENABLE ROW LEVEL SECURITY;

-- Policy: Solo service role puede leer (APIs)
CREATE POLICY "chatbot_leads_service_role_all"
  ON chatbot_leads
  FOR ALL
  USING (auth.role() = 'service_role');

-- Policy: Inserción pública (desde el chatbot)
CREATE POLICY "chatbot_leads_public_insert"
  ON chatbot_leads
  FOR INSERT
  WITH CHECK (true);

-- Comentarios
COMMENT ON TABLE chatbot_leads IS 'Leads capturados del chatbot cuando no hay respuesta automática';
COMMENT ON COLUMN chatbot_leads.user_message IS 'Pregunta original del usuario';
COMMENT ON COLUMN chatbot_leads.status IS 'pending: sin contactar, contacted: ya contactado, resolved: resuelto, spam: descartado';

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Ver leads pendientes
-- SELECT id, nombre, email, user_message, created_at
-- FROM chatbot_leads
-- WHERE status = 'pending'
-- ORDER BY created_at DESC;

-- Marcar como contactado
-- UPDATE chatbot_leads
-- SET status = 'contacted', contacted_at = now()
-- WHERE id = 'uuid-aqui';

-- ============================================
-- FIN DEL SCHEMA
-- ============================================
