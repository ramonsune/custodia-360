-- ============================================================
-- MIGRACIÓN: SISTEMA DE FORMACIÓN COMPLETO DELEGADO PRINCIPAL
-- Fecha: 15 Octubre 2025
-- ============================================================

-- 1) Tabla de certificados
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID REFERENCES people(id) ON DELETE SET NULL,
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  cert_code TEXT UNIQUE NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_certificates_person ON certificates(person_id);
CREATE INDEX IF NOT EXISTS idx_certificates_entity ON certificates(entity_id);
CREATE INDEX IF NOT EXISTS idx_certificates_code ON certificates(cert_code);

-- 2) Añadir campos a entities
ALTER TABLE entities ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}'::jsonb;
ALTER TABLE entities ADD COLUMN IF NOT EXISTS delegado_penales_entregado BOOLEAN DEFAULT false;
ALTER TABLE entities ADD COLUMN IF NOT EXISTS delegado_penales_fecha TIMESTAMPTZ;
ALTER TABLE entities ADD COLUMN IF NOT EXISTS sector_code TEXT;

-- 3) Tabla de estado de formación
CREATE TABLE IF NOT EXISTS training_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID REFERENCES people(id) ON DELETE CASCADE,
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  course_code TEXT DEFAULT 'delegado_principal_lopivi',
  modules_completed INT DEFAULT 0,
  modules_data JSONB DEFAULT '[]'::jsonb,
  test_passed BOOLEAN DEFAULT false,
  certified BOOLEAN DEFAULT false,
  config_completed BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(person_id, entity_id, course_code)
);

CREATE INDEX IF NOT EXISTS idx_training_status_person ON training_status(person_id);
CREATE INDEX IF NOT EXISTS idx_training_status_entity ON training_status(entity_id);

-- 4) Tabla de preguntas del quiz
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  is_general BOOLEAN DEFAULT true,
  sector_code TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_questions_general ON quiz_questions(is_general);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_sector ON quiz_questions(sector_code);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_active ON quiz_questions(active);

-- 5) Tabla de respuestas
CREATE TABLE IF NOT EXISTS quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES quiz_questions(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_answers_question ON quiz_answers(question_id);

-- 6) Tabla de intentos de test
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID REFERENCES people(id) ON DELETE SET NULL,
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  seed TEXT NOT NULL,
  score INT DEFAULT 0,
  total_questions INT DEFAULT 20,
  passed BOOLEAN DEFAULT false,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_person ON quiz_attempts(person_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_entity ON quiz_attempts(entity_id);

-- 7) Tabla de respuestas del intento
CREATE TABLE IF NOT EXISTS quiz_attempt_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES quiz_questions(id) ON DELETE CASCADE,
  shuffled_answer_ids JSONB NOT NULL,
  selected_answer_id UUID,
  is_correct BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempt_items_attempt ON quiz_attempt_items(attempt_id);

-- 8) Trigger para actualizar training_status
CREATE OR REPLACE FUNCTION update_training_status_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS training_status_updated_at ON training_status;
CREATE TRIGGER training_status_updated_at
BEFORE UPDATE ON training_status
FOR EACH ROW
EXECUTE FUNCTION update_training_status_timestamp();

-- 9) RLS Policies
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempt_items ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (permitir todo para desarrollo)
DROP POLICY IF EXISTS certificates_all ON certificates;
CREATE POLICY certificates_all ON certificates FOR ALL USING (true);

DROP POLICY IF EXISTS training_status_all ON training_status;
CREATE POLICY training_status_all ON training_status FOR ALL USING (true);

DROP POLICY IF EXISTS quiz_questions_all ON quiz_questions;
CREATE POLICY quiz_questions_all ON quiz_questions FOR ALL USING (true);

DROP POLICY IF EXISTS quiz_answers_all ON quiz_answers;
CREATE POLICY quiz_answers_all ON quiz_answers FOR ALL USING (true);

DROP POLICY IF EXISTS quiz_attempts_all ON quiz_attempts;
CREATE POLICY quiz_attempts_all ON quiz_attempts FOR ALL USING (true);

DROP POLICY IF EXISTS quiz_attempt_items_all ON quiz_attempt_items;
CREATE POLICY quiz_attempt_items_all ON quiz_attempt_items FOR ALL USING (true);

-- ============================================================
-- PLANTILLAS DE EMAIL
-- ============================================================

INSERT INTO message_templates (scope, nombre, slug, asunto, cuerpo, segmento, activo) VALUES
('email', 'Inicio formación', 'training-start', 'Custodia360 | Inicio de formación del Delegado Principal',
'Hola {{nombre}},

Ya puedes acceder a tu formación como Delegado/a de Protección:

{{url}}

Si tienes cualquier duda, contacta con nosotros en info@custodia360.es

Gracias,
Equipo Custodia360', 'todos', true)
ON CONFLICT (slug) DO UPDATE SET
  asunto = EXCLUDED.asunto,
  cuerpo = EXCLUDED.cuerpo;

INSERT INTO message_templates (scope, nombre, slug, asunto, cuerpo, segmento, activo) VALUES
('email', 'Certificado emitido', 'training-certified', 'Custodia360 | Certificado de Formación Emitido',
'Hola {{nombre}},

¡Enhorabuena! Has completado exitosamente la formación como Delegado/a de Protección.

Tu certificado (ID: {{cert_code}}) está disponible aquí:
{{url}}

Ahora puedes acceder a tu panel de gestión completo.

Gracias,
Equipo Custodia360', 'todos', true)
ON CONFLICT (slug) DO UPDATE SET
  asunto = EXCLUDED.asunto,
  cuerpo = EXCLUDED.cuerpo;

-- ============================================================
-- BANCO DE PREGUNTAS INICIAL
-- ============================================================

-- 30 preguntas generales
INSERT INTO quiz_questions (text, is_general, active) VALUES
('¿Qué objetivo principal persigue la LOPIVI?', true, true),
('¿Quién es responsable de garantizar la protección infantil en la entidad?', true, true),
('¿Qué debe hacer un delegado si sospecha de maltrato?', true, true),
('¿Qué significa el principio de interés superior del menor?', true, true),
('¿Cada cuánto debe revisarse el plan de protección?', true, true),
('¿Qué documentos debe conocer todo el personal de contacto?', true, true),
('¿Qué órgano coordina las políticas de protección en España?', true, true),
('¿Cuál es la edad mínima para considerar a una persona menor?', true, true),
('¿Qué es un protocolo de actuación?', true, true),
('¿Qué hacer ante una urgencia grave?', true, true),
('¿Qué papel tienen las familias en la protección?', true, true),
('¿Cuándo debe comunicarse un incidente?', true, true),
('¿Quién designa al delegado de protección?', true, true),
('¿Qué tipo de formación debe recibir el personal?', true, true),
('¿Qué consecuencias legales tiene no cumplir la LOPIVI?', true, true),
('¿Qué importancia tiene la confidencialidad?', true, true),
('¿Qué información debe contener el plan de protección?', true, true),
('¿Qué hacer si un menor revela una situación de abuso?', true, true),
('¿Quién supervisa el cumplimiento del plan?', true, true),
('¿Cuándo debe revisarse el canal de comunicación?', true, true),
('¿Qué se entiende por violencia contra la infancia?', true, true),
('¿Qué hacer si un menor no quiere declarar?', true, true),
('¿Qué rol tiene el delegado en la formación del personal?', true, true),
('¿Qué implica el derecho a ser escuchado?', true, true),
('¿Qué datos personales deben protegerse?', true, true),
('¿Qué hacer si el delegado está ausente?', true, true),
('¿Qué hacer ante una denuncia falsa?', true, true),
('¿Qué medidas se aplican ante reincidencia?', true, true),
('¿Qué documento acredita la formación del delegado?', true, true),
('¿Cuándo debe actualizarse el certificado de penales?', true, true)
ON CONFLICT DO NOTHING;

-- Preguntas por sector: Ludoteca
INSERT INTO quiz_questions (text, is_general, sector_code, active) VALUES
('En una ludoteca, ¿qué medida se toma si un monitor observa maltrato entre niños?', false, 'ludoteca', true),
('¿Qué debe incluir el plan de una ludoteca sobre actividades seguras?', false, 'ludoteca', true),
('¿Quién debe informar a las familias en caso de incidente en una ludoteca?', false, 'ludoteca', true),
('¿Cómo controlar accesos en una ludoteca?', false, 'ludoteca', true),
('¿Qué registro debe mantenerse actualizado en una ludoteca?', false, 'ludoteca', true)
ON CONFLICT DO NOTHING;

-- Preguntas por sector: Club de fútbol
INSERT INTO quiz_questions (text, is_general, sector_code, active) VALUES
('En un club de fútbol, ¿qué hacer si un entrenador detecta acoso?', false, 'club_futbol', true),
('¿Qué normas deben seguir los desplazamientos de menores?', false, 'club_futbol', true),
('¿Quién es responsable durante un viaje deportivo?', false, 'club_futbol', true),
('¿Qué documentación deben tener los monitores deportivos?', false, 'club_futbol', true),
('¿Cómo actuar ante una lesión con posible negligencia?', false, 'club_futbol', true)
ON CONFLICT DO NOTHING;

-- Preguntas por sector: Academia
INSERT INTO quiz_questions (text, is_general, sector_code, active) VALUES
('En una academia, ¿cómo se gestiona un conflicto entre alumno y profesor?', false, 'academia', true),
('¿Qué información debe darse a los padres en una academia?', false, 'academia', true),
('¿Qué control debe haber en salidas escolares?', false, 'academia', true),
('¿Qué formación debe tener el personal docente?', false, 'academia', true),
('¿Cómo registrar comunicaciones con familias?', false, 'academia', true)
ON CONFLICT DO NOTHING;

-- Crear 4 respuestas por cada pregunta (1 correcta + 3 incorrectas)
-- Ejemplo para la primera pregunta
DO $$
DECLARE
  q_id UUID;
BEGIN
  -- Pregunta 1: LOPIVI objetivo
  SELECT id INTO q_id FROM quiz_questions WHERE text = '¿Qué objetivo principal persigue la LOPIVI?' LIMIT 1;
  IF q_id IS NOT NULL THEN
    INSERT INTO quiz_answers (question_id, text, is_correct) VALUES
    (q_id, 'Proteger integralmente a todos los menores frente a cualquier forma de violencia', true),
    (q_id, 'Regular solo el maltrato físico', false),
    (q_id, 'Sancionar a los padres negligentes', false),
    (q_id, 'Controlar las actividades de las entidades', false)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Para el resto de preguntas, crear respuestas genéricas (se personalizarán después)
DO $$
DECLARE
  q_record RECORD;
  answer_count INT;
BEGIN
  FOR q_record IN SELECT id FROM quiz_questions
  LOOP
    -- Verificar si ya tiene respuestas
    SELECT COUNT(*) INTO answer_count FROM quiz_answers WHERE question_id = q_record.id;

    IF answer_count = 0 THEN
      INSERT INTO quiz_answers (question_id, text, is_correct) VALUES
      (q_record.id, 'Respuesta correcta según LOPIVI y normativa vigente', true),
      (q_record.id, 'Opción incorrecta que contradice la normativa', false),
      (q_record.id, 'Opción parcialmente correcta pero incompleta', false),
      (q_record.id, 'Opción que confunde con otros protocolos', false);
    END IF;
  END LOOP;
END $$;

-- Comentarios
COMMENT ON TABLE certificates IS 'Certificados digitales de formación emitidos';
COMMENT ON TABLE training_status IS 'Estado de progreso de formación por persona y entidad';
COMMENT ON TABLE quiz_questions IS 'Banco de preguntas del test de evaluación';
COMMENT ON TABLE quiz_answers IS 'Respuestas posibles para cada pregunta';
COMMENT ON TABLE quiz_attempts IS 'Intentos de test realizados';
COMMENT ON TABLE quiz_attempt_items IS 'Detalle de respuestas de cada intento';
