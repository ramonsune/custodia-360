-- ============================================================
-- MIGRACIÓN: Sistema de Cambio de Delegado
-- Fecha: 2025-01-18
-- Descripción: Tablas y plantillas para gestionar el cambio de delegados principales
-- ============================================================

-- ============================================================
-- TABLA 1: delegate_change_requests
-- Registra todas las solicitudes de cambio de delegado
-- ============================================================
CREATE TABLE IF NOT EXISTS delegate_change_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE NOT NULL,

  -- Delegado saliente
  outgoing_delegate_id UUID REFERENCES delegados(id),
  outgoing_delegate_name VARCHAR(255),
  outgoing_delegate_email VARCHAR(255),
  reason VARCHAR(100) NOT NULL, -- 'voluntary_resignation', 'dismissal', 'role_change', 'promotion', 'non_compliance', 'other'
  reason_details TEXT,

  -- Nuevo delegado
  incoming_delegate_id UUID REFERENCES delegados(id), -- null hasta que se cree el registro
  incoming_type VARCHAR(50) NOT NULL, -- 'promoted_suplente' o 'new_person'
  incoming_name VARCHAR(255),
  incoming_email VARCHAR(255),
  incoming_phone VARCHAR(50),

  -- Estado del proceso
  status VARCHAR(50) NOT NULL DEFAULT 'pending_selection', -- 'pending_selection', 'pending_onboarding', 'in_transition', 'completed', 'cancelled'
  transition_date TIMESTAMP,

  -- Auditoría
  requested_by UUID REFERENCES auth.users(id), -- admin de entidad que inició el cambio
  requested_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  cancellation_reason TEXT,

  -- Metadata adicional
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_delegate_change_entity ON delegate_change_requests(entity_id);
CREATE INDEX idx_delegate_change_status ON delegate_change_requests(status);
CREATE INDEX idx_delegate_change_outgoing ON delegate_change_requests(outgoing_delegate_id);
CREATE INDEX idx_delegate_change_incoming ON delegate_change_requests(incoming_delegate_id);

-- ============================================================
-- TABLA 2: delegate_transitions_audit
-- Registro inmutable de auditoría de cada transición completada
-- ============================================================
CREATE TABLE IF NOT EXISTS delegate_transitions_audit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE NOT NULL,
  change_request_id UUID REFERENCES delegate_change_requests(id),

  -- Snapshot del delegado saliente
  outgoing_delegate_name VARCHAR(255),
  outgoing_delegate_email VARCHAR(255),
  outgoing_delegate_role VARCHAR(50),
  outgoing_delegate_certified_at TIMESTAMP,

  -- Snapshot del nuevo delegado
  incoming_delegate_name VARCHAR(255),
  incoming_delegate_email VARCHAR(255),
  incoming_delegate_role VARCHAR(50),
  incoming_delegate_certified_at TIMESTAMP,

  -- Detalles de la transición
  reason VARCHAR(100),
  reason_details TEXT,
  transition_completed_at TIMESTAMP NOT NULL,

  -- Snapshot completo del estado (compliance, formaciones, etc.)
  compliance_snapshot JSONB,
  entity_snapshot JSONB,
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_transitions_audit_entity ON delegate_transitions_audit(entity_id);
CREATE INDEX idx_transitions_audit_request ON delegate_transitions_audit(change_request_id);
CREATE INDEX idx_transitions_audit_date ON delegate_transitions_audit(transition_completed_at);

-- ============================================================
-- MODIFICACIÓN TABLA: delegados
-- Añadir campos para histórico de roles
-- ============================================================
ALTER TABLE delegados
ADD COLUMN IF NOT EXISTS previous_role VARCHAR(50),
ADD COLUMN IF NOT EXISTS role_changed_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS role_change_reason TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- ============================================================
-- PLANTILLAS DE EMAIL para el sistema de cambio de delegado
-- ============================================================

-- 1. Notificación de inicio de cambio al delegado actual
INSERT INTO message_templates (slug, name, subject, body_text, body_html, category, active)
VALUES (
  'delegate-change-initiated',
  'Cambio de Delegado - Proceso Iniciado',
  'Proceso de cambio de delegado iniciado en {{entity_name}}',
  'Hola {{delegate_name}},

Se ha iniciado un proceso de cambio de delegado principal en {{entity_name}}.

Motivo: {{reason}}
Nuevo delegado: {{incoming_delegate_name}} ({{incoming_delegate_email}})
Estado actual: {{status}}

Tu acceso al panel de delegado se mantendrá activo hasta que el proceso de transición se complete.

Te mantendremos informado de cada paso del proceso.

Atentamente,
Custodia360',
  '<p>Hola <strong>{{delegate_name}}</strong>,</p>
   <p>Se ha iniciado un proceso de cambio de delegado principal en <strong>{{entity_name}}</strong>.</p>
   <ul>
     <li><strong>Motivo:</strong> {{reason}}</li>
     <li><strong>Nuevo delegado:</strong> {{incoming_delegate_name}} ({{incoming_delegate_email}})</li>
     <li><strong>Estado:</strong> {{status}}</li>
   </ul>
   <p>Tu acceso al panel se mantendrá hasta completar la transición.</p>
   <p>Atentamente,<br>Custodia360</p>',
  'delegate_management',
  true
) ON CONFLICT (slug) DO NOTHING;

-- 2. Invitación al nuevo delegado (persona nueva)
INSERT INTO message_templates (slug, name, subject, body_text, body_html, category, active)
VALUES (
  'delegate-change-invitation',
  'Invitación Nuevo Delegado',
  'Invitación para ser Delegado de Protección - {{entity_name}}',
  'Hola {{delegate_name}},

Has sido designado como nuevo Delegado de Protección Principal de {{entity_name}}.

Para asumir este rol, debes completar:

1. Formación LOPIVI (6 módulos + test) - 5-7 días
2. Certificación de Delegado - Inmediata tras formación
3. Entrega de Certificado de Penales

Accede aquí para comenzar: {{onboarding_url}}

Tienes 30 días para completar el proceso.

Atentamente,
Custodia360',
  '<h2>Invitación para ser Delegado de Protección</h2>
   <p>Hola <strong>{{delegate_name}}</strong>,</p>
   <p>Has sido designado como nuevo <strong>Delegado de Protección Principal</strong> de <strong>{{entity_name}}</strong>.</p>

   <h3>Para asumir este rol, debes completar:</h3>
   <ol>
     <li><strong>Formación LOPIVI</strong> (6 módulos + test) - 5-7 días</li>
     <li><strong>Certificación de Delegado</strong> - Inmediata tras formación</li>
     <li><strong>Entrega de Certificado de Penales</strong></li>
   </ol>

   <p><a href="{{onboarding_url}}" style="background:#2563eb;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;">Comenzar Formación</a></p>

   <p><small>Tienes 30 días para completar el proceso.</small></p>
   <p>Atentamente,<br>Custodia360</p>',
  'delegate_management',
  true
) ON CONFLICT (slug) DO NOTHING;

-- 3. Notificación de cambio completado (a toda la entidad)
INSERT INTO message_templates (slug, name, subject, body_text, body_html, category, active)
VALUES (
  'delegate-change-completed',
  'Cambio de Delegado Completado',
  'Cambio de Delegado de Protección en {{entity_name}}',
  'Estimado miembro de {{entity_name}},

Informamos que a partir de {{transition_date}}, el nuevo Delegado de Protección Principal es:

{{new_delegate_name}}
Email: {{new_delegate_email}}
Teléfono: {{new_delegate_phone}}

El delegado anterior ({{previous_delegate_name}}) ha finalizado su rol.

Cualquier comunicación relacionada con protección infantil debe dirigirse al nuevo delegado.

Atentamente,
Custodia360',
  '<h2>Cambio de Delegado de Protección</h2>
   <p>Estimado miembro de <strong>{{entity_name}}</strong>,</p>

   <p>Informamos que a partir de <strong>{{transition_date}}</strong>, el nuevo <strong>Delegado de Protección Principal</strong> es:</p>

   <div style="background:#f3f4f6;padding:16px;border-radius:8px;margin:16px 0;">
     <p><strong>{{new_delegate_name}}</strong></p>
     <p>Email: <a href="mailto:{{new_delegate_email}}">{{new_delegate_email}}</a></p>
     <p>Teléfono: {{new_delegate_phone}}</p>
   </div>

   <p>El delegado anterior (<strong>{{previous_delegate_name}}</strong>) ha finalizado su rol.</p>

   <p>Cualquier comunicación relacionada con protección infantil debe dirigirse al nuevo delegado.</p>

   <p>Atentamente,<br>Custodia360</p>',
  'delegate_management',
  true
) ON CONFLICT (slug) DO NOTHING;

-- 4. Notificación de rol revocado (delegado saliente)
INSERT INTO message_templates (slug, name, subject, body_text, body_html, category, active)
VALUES (
  'delegate-role-revoked',
  'Rol de Delegado Finalizado',
  'Tu rol como Delegado de Protección ha finalizado',
  'Hola {{delegate_name}},

Tu rol como Delegado de Protección Principal de {{entity_name}} ha finalizado.

Motivo: {{reason}}
Fecha efectiva: {{effective_date}}

Tu acceso al panel de delegado ha sido revocado.

Agradecemos tu dedicación y compromiso con la protección infantil durante tu tiempo como delegado.

Atentamente,
Custodia360',
  '<h2>Finalización de Rol como Delegado</h2>
   <p>Hola <strong>{{delegate_name}}</strong>,</p>

   <p>Tu rol como <strong>Delegado de Protección Principal</strong> de <strong>{{entity_name}}</strong> ha finalizado.</p>

   <ul>
     <li><strong>Motivo:</strong> {{reason}}</li>
     <li><strong>Fecha efectiva:</strong> {{effective_date}}</li>
   </ul>

   <p><strong>Tu acceso al panel de delegado ha sido revocado.</strong></p>

   <p>Agradecemos tu dedicación y compromiso con la protección infantil durante tu tiempo como delegado.</p>

   <p>Atentamente,<br>Custodia360</p>',
  'delegate_management',
  true
) ON CONFLICT (slug) DO NOTHING;

-- 5. Bienvenida al nuevo delegado (tras completar proceso)
INSERT INTO message_templates (slug, name, subject, body_text, body_html, category, active)
VALUES (
  'delegate-promoted-welcome',
  'Bienvenida Nuevo Delegado',
  '¡Bienvenido como Delegado Principal! - {{entity_name}}',
  'Hola {{delegate_name}},

¡Felicitaciones! Ya eres oficialmente Delegado de Protección Principal de {{entity_name}}.

Has completado exitosamente:
✓ Formación LOPIVI
✓ Certificación de Delegado
✓ Entrega de Certificado de Penales

Accede a tu panel de delegado: {{dashboard_url}}

Desde tu panel podrás:
• Gestionar casos y situaciones de riesgo
• Coordinar formaciones del personal
• Administrar el cumplimiento LOPIVI de la entidad
• Comunicarte con menores y familias

Bienvenido al equipo de protección infantil.

Atentamente,
Custodia360',
  '<h2>¡Bienvenido como Delegado Principal!</h2>
   <p>Hola <strong>{{delegate_name}}</strong>,</p>

   <p>¡Felicitaciones! Ya eres oficialmente <strong>Delegado de Protección Principal</strong> de <strong>{{entity_name}}</strong>.</p>

   <h3>Has completado exitosamente:</h3>
   <ul style="list-style:none;padding:0;">
     <li>✓ Formación LOPIVI</li>
     <li>✓ Certificación de Delegado</li>
     <li>✓ Entrega de Certificado de Penales</li>
   </ul>

   <p><a href="{{dashboard_url}}" style="background:#2563eb;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;">Acceder al Panel de Delegado</a></p>

   <h3>Desde tu panel podrás:</h3>
   <ul>
     <li>Gestionar casos y situaciones de riesgo</li>
     <li>Coordinar formaciones del personal</li>
     <li>Administrar el cumplimiento LOPIVI</li>
     <li>Comunicarte con menores y familias</li>
   </ul>

   <p>Bienvenido al equipo de protección infantil.</p>

   <p>Atentamente,<br>Custodia360</p>',
  'delegate_management',
  true
) ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- RLS POLICIES para las nuevas tablas
-- ============================================================

-- Habilitar RLS
ALTER TABLE delegate_change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE delegate_transitions_audit ENABLE ROW LEVEL SECURITY;

-- Policy: Admin de entidad puede ver/crear/modificar sus solicitudes de cambio
CREATE POLICY "Entity admin can manage delegate change requests"
ON delegate_change_requests
FOR ALL
USING (
  entity_id IN (
    SELECT id FROM entities
    WHERE admin_user_id = auth.uid()
  )
);

-- Policy: Delegados pueden ver solicitudes relacionadas con ellos
CREATE POLICY "Delegates can view their change requests"
ON delegate_change_requests
FOR SELECT
USING (
  outgoing_delegate_id IN (
    SELECT id FROM delegados WHERE user_id = auth.uid()
  )
  OR incoming_delegate_id IN (
    SELECT id FROM delegados WHERE user_id = auth.uid()
  )
);

-- Policy: Admin puede ver auditoría de su entidad
CREATE POLICY "Entity admin can view transition audit"
ON delegate_transitions_audit
FOR SELECT
USING (
  entity_id IN (
    SELECT id FROM entities
    WHERE admin_user_id = auth.uid()
  )
);

-- ============================================================
-- FUNCIONES AUXILIARES
-- ============================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_delegate_change_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para delegate_change_requests
CREATE TRIGGER trigger_update_delegate_change_timestamp
BEFORE UPDATE ON delegate_change_requests
FOR EACH ROW
EXECUTE FUNCTION update_delegate_change_updated_at();

-- ============================================================
-- COMENTARIOS PARA DOCUMENTACIÓN
-- ============================================================

COMMENT ON TABLE delegate_change_requests IS 'Registro de solicitudes de cambio de delegado principal';
COMMENT ON TABLE delegate_transitions_audit IS 'Auditoría inmutable de transiciones de delegado completadas';
COMMENT ON COLUMN delegate_change_requests.status IS 'Estados: pending_selection, pending_onboarding, in_transition, completed, cancelled';
COMMENT ON COLUMN delegate_change_requests.reason IS 'Motivos: voluntary_resignation, dismissal, role_change, promotion, non_compliance, other';
COMMENT ON COLUMN delegate_change_requests.incoming_type IS 'Tipo: promoted_suplente o new_person';
