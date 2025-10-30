-- =====================================================
-- MIGRACIÓN COMPLETA: SISTEMA DE TEST LOPIVI
-- Fecha: 15 Octubre 2025
-- Descripción: Tablas + 20 preguntas reales del test
-- =====================================================

-- 1. TABLA: quiz_questions
-- Preguntas del test LOPIVI
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  is_general BOOLEAN DEFAULT true,
  sector_code TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABLA: quiz_answers
-- Respuestas para cada pregunta (4 opciones por pregunta)
CREATE TABLE IF NOT EXISTS quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES quiz_questions(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLA: quiz_attempts
-- Intentos de test de cada usuario
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  seed TEXT NOT NULL,
  total_questions INTEGER DEFAULT 20,
  score INTEGER,
  passed BOOLEAN,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLA: quiz_attempt_items
-- Respuestas individuales de cada intento
CREATE TABLE IF NOT EXISTS quiz_attempt_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES quiz_questions(id),
  shuffled_answer_ids UUID[] NOT NULL,
  selected_answer_id UUID,
  is_correct BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLA: training_status
-- Estado de formación del delegado
CREATE TABLE IF NOT EXISTS training_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  course_code TEXT DEFAULT 'delegado_principal_lopivi',
  modules_completed INTEGER DEFAULT 0,
  modules_data JSONB DEFAULT '[]'::jsonb,
  test_passed BOOLEAN DEFAULT false,
  certified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(person_id, entity_id, course_code)
);

-- 6. TABLA: certificates
-- Certificados digitales emitidos
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  cert_code TEXT UNIQUE NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(person_id, entity_id)
);

-- Índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_quiz_questions_general ON quiz_questions(is_general, active);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_sector ON quiz_questions(sector_code, active);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_person ON quiz_attempts(person_id, entity_id);
CREATE INDEX IF NOT EXISTS idx_training_status_person ON training_status(person_id, entity_id, course_code);
CREATE INDEX IF NOT EXISTS idx_certificates_person ON certificates(person_id, entity_id);
CREATE INDEX IF NOT EXISTS idx_certificates_code ON certificates(cert_code);

-- =====================================================
-- INSERCIÓN DE PREGUNTAS GENERALES (15 preguntas)
-- =====================================================

-- PREGUNTA 1
INSERT INTO quiz_questions (text, is_general, sector_code, active) VALUES
('¿Cuál es el objetivo principal de la LOPIVI?', true, NULL, true);

INSERT INTO quiz_answers (question_id, text, is_correct) VALUES
((SELECT id FROM quiz_questions WHERE text = '¿Cuál es el objetivo principal de la LOPIVI?' LIMIT 1),
'Garantizar la protección integral de niños, niñas y adolescentes frente a la violencia', true),
((SELECT id FROM quiz_questions WHERE text = '¿Cuál es el objetivo principal de la LOPIVI?' LIMIT 1),
'Regular exclusivamente la violencia en centros educativos', false),
((SELECT id FROM quiz_questions WHERE text = '¿Cuál es el objetivo principal de la LOPIVI?' LIMIT 1),
'Establecer sanciones económicas a las entidades', false),
((SELECT id FROM quiz_questions WHERE text = '¿Cuál es el objetivo principal de la LOPIVI?' LIMIT 1),
'Crear un registro de menores en situación de riesgo', false);

-- PREGUNTA 2
INSERT INTO quiz_questions (text, is_general, sector_code, active) VALUES
('¿Qué es el Delegado/a de Protección según la LOPIVI?', true, NULL, true);

INSERT INTO quiz_answers (question_id, text, is_correct) VALUES
((SELECT id FROM quiz_questions WHERE text = '¿Qué es el Delegado/a de Protección según la LOPIVI?' LIMIT 1),
'Figura clave que coordina las medidas de protección en la entidad', true),
((SELECT id FROM quiz_questions WHERE text = '¿Qué es el Delegado/a de Protección según la LOPIVI?' LIMIT 1),
'Un puesto voluntario sin responsabilidades legales', false),
((SELECT id FROM quiz_questions WHERE text = '¿Qué es el Delegado/a de Protección según la LOPIVI?' LIMIT 1),
'Solo necesario en centros educativos públicos', false),
((SELECT id FROM quiz_questions WHERE text = '¿Qué es el Delegado/a de Protección según la LOPIVI?' LIMIT 1),
'Un cargo rotativo entre todo el personal', false);

-- PREGUNTA 3
INSERT INTO quiz_questions (text, is_general, sector_code, active) VALUES
('¿Cada cuánto tiempo caduca el certificado de penales según LOPIVI?', true, NULL, true);

INSERT INTO quiz_answers (question_id, text, is_correct) VALUES
((SELECT id FROM quiz_questions WHERE text = '¿Cada cuánto tiempo caduca el certificado de penales según LOPIVI?' LIMIT 1),
'Cada 3 meses', true),
((SELECT id FROM quiz_questions WHERE text = '¿Cada cuánto tiempo caduca el certificado de penales según LOPIVI?' LIMIT 1),
'Cada 6 meses', false),
((SELECT id FROM quiz_questions WHERE text = '¿Cada cuánto tiempo caduca el certificado de penales según LOPIVI?' LIMIT 1),
'Cada año', false),
((SELECT id FROM quiz_questions WHERE text = '¿Cada cuánto tiempo caduca el certificado de penales según LOPIVI?' LIMIT 1),
'No caduca nunca', false);

-- PREGUNTA 4
INSERT INTO quiz_questions (text, is_general, sector_code, active) VALUES
('¿Cuál de estos NO es un tipo de violencia contemplado en la LOPIVI?', true, NULL, true);

INSERT INTO quiz_answers (question_id, text, is_correct) VALUES
((SELECT id FROM quiz_questions WHERE text = '¿Cuál de estos NO es un tipo de violencia contemplado en la LOPIVI?' LIMIT 1),
'Violencia económica entre adultos', true),
((SELECT id FROM quiz_questions WHERE text = '¿Cuál de estos NO es un tipo de violencia contemplado en la LOPIVI?' LIMIT 1),
'Violencia física', false),
((SELECT id FROM quiz_questions WHERE text = '¿Cuál de estos NO es un tipo de violencia contemplado en la LOPIVI?' LIMIT 1),
'Violencia psicológica', false),
((SELECT id FROM quiz_questions WHERE text = '¿Cuál de estos NO es un tipo de violencia contemplado en la LOPIVI?' LIMIT 1),
'Violencia sexual', false);

-- PREGUNTA 5
INSERT INTO quiz_questions (text, is_general, sector_code, active) VALUES
('Ante una sospecha fundada de maltrato, ¿qué debe hacer el personal de contacto?', true, NULL, true);

INSERT INTO quiz_answers (question_id, text, is_correct) VALUES
((SELECT id FROM quiz_questions WHERE text = 'Ante una sospecha fundada de maltrato, ¿qué debe hacer el personal de contacto?' LIMIT 1),
'Informar inmediatamente al Delegado/a de Protección', true),
((SELECT id FROM quiz_questions WHERE text = 'Ante una sospecha fundada de maltrato, ¿qué debe hacer el personal de contacto?' LIMIT 1),
'Interrogar directamente al menor', false),
((SELECT id FROM quiz_questions WHERE text = 'Ante una sospecha fundada de maltrato, ¿qué debe hacer el personal de contacto?' LIMIT 1),
'Llamar a la familia y preguntarles', false),
((SELECT id FROM quiz_questions WHERE text = 'Ante una sospecha fundada de maltrato, ¿qué debe hacer el personal de contacto?' LIMIT 1),
'Ignorarlo si no está seguro', false);

-- PREGUNTA 6
INSERT INTO quiz_questions (text, is_general, sector_code, active) VALUES
('¿Cuál es el porcentaje mínimo de aciertos para aprobar el test LOPIVI?', true, NULL, true);

INSERT INTO quiz_answers (question_id, text, is_correct) VALUES
((SELECT id FROM quiz_questions WHERE text = '¿Cuál es el porcentaje mínimo de aciertos para aprobar el test LOPIVI?' LIMIT 1),
'75%', true),
((SELECT id FROM quiz_questions WHERE text = '¿Cuál es el porcentaje mínimo de aciertos para aprobar el test LOPIVI?' LIMIT 1),
'50%', false),
((SELECT id FROM quiz_questions WHERE text = '¿Cuál es el porcentaje mínimo de aciertos para aprobar el test LOPIVI?' LIMIT 1),
'60%', false),
((SELECT id FROM quiz_questions WHERE text = '¿Cuál es el porcentaje mínimo de aciertos para aprobar el test LOPIVI?' LIMIT 1),
'90%', false);

-- PREGUNTA 7
INSERT INTO quiz_questions (text, is_general, sector_code, active) VALUES
('¿Qué debe incluir obligatoriamente el Plan de Protección?', true, NULL, true);

INSERT INTO quiz_answers (question_id, text, is_correct) VALUES
((SELECT id FROM quiz_questions WHERE text = '¿Qué debe incluir obligatoriamente el Plan de Protección?' LIMIT 1),
'Protocolos de actuación ante situaciones de riesgo', true),
((SELECT id FROM quiz_questions WHERE text = '¿Qué debe incluir obligatoriamente el Plan de Protección?' LIMIT 1),
'Listado de menores matriculados', false),
((SELECT id FROM quiz_questions WHERE text = '¿Qué debe incluir obligatoriamente el Plan de Protección?' LIMIT 1),
'Presupuesto anual de la entidad', false),
((SELECT id FROM quiz_questions WHERE text = '¿Qué debe incluir obligatoriamente el Plan de Protección?' LIMIT 1),
'Horarios de actividades', false);

-- PREGUNTA 8
INSERT INTO quiz_questions (text, is_general, sector_code, active) VALUES
('¿A quién se debe comunicar una situación de peligro inmediato para un menor?', true, NULL, true);

INSERT INTO quiz_answers (question_id, text, is_correct) VALUES
((SELECT id FROM quiz_questions WHERE text = '¿A quién se debe comunicar una situación de peligro inmediato para un menor?' LIMIT 1),
'Servicios de emergencia (112) y Delegado/a de Protección', true),
((SELECT id FROM quiz_questions WHERE text = '¿A quién se debe comunicar una situación de peligro inmediato para un menor?' LIMIT 1),
'Solo a los padres', false),
((SELECT id FROM quiz_questions WHERE text = '¿A quién se debe comunicar una situación de peligro inmediato para un menor?' LIMIT 1),
'Esperar a la siguiente reunión de equipo', false),
((SELECT id FROM quiz_questions WHERE text = '¿A quién se debe comunicar una situación de peligro inmediato para un menor?' LIMIT 1),
'Directamente al director de la entidad', false);

-- PREGUNTA 9
INSERT INTO quiz_questions (text, is_general, sector_code, active) VALUES
('¿Cuál es un indicador emocional de posible maltrato?', true, NULL, true);

INSERT INTO quiz_answers (question_id, text, is_correct) VALUES
((SELECT id FROM quiz_questions WHERE text = '¿Cuál es un indicador emocional de posible maltrato?' LIMIT 1),
'Miedo extremo o ansiedad persistente', true),
((SELECT id FROM quiz_questions WHERE text = '¿Cuál es un indicador emocional de posible maltrato?' LIMIT 1),
'Alegría al llegar a la actividad', false),
((SELECT id FROM quiz_questions WHERE text = '¿Cuál es un indicador emocional de posible maltrato?' LIMIT 1),
'Participación activa en grupo', false),
((SELECT id FROM quiz_questions WHERE text = '¿Cuál es un indicador emocional de posible maltrato?' LIMIT 1),
'Buena relación con sus compañeros', false);

-- PREGUNTA 10
INSERT INTO quiz_questions (text, is_general, sector_code, active) VALUES
('¿Qué debe hacer el Delegado/a si sospecha de abuso sexual?', true, NULL, true);

INSERT INTO quiz_answers (question_id, text, is_correct) VALUES
((SELECT id FROM quiz_questions WHERE text = '¿Qué debe hacer el Delegado/a si sospecha de abuso sexual?' LIMIT 1),
'Comunicarlo inmediatamente a Fiscalía de Menores o Fuerzas de Seguridad', true),
((SELECT id FROM quiz_questions WHERE text = '¿Qué debe hacer el Delegado/a si sospecha de abuso sexual?' LIMIT 1),
'Investigar por su cuenta antes de denunciar', false),
((SELECT id FROM quiz_questions WHERE text = '¿Qué debe hacer el Delegado/a si sospecha de abuso sexual?' LIMIT 1),
'Esperar a tener pruebas concluyentes', false),
((SELECT id FROM quiz_questions WHERE text = '¿Qué debe hacer el Delegado/a si sospecha de abuso sexual?' LIMIT 1),
'Solo informar a la familia', false);

-- PREGUNTA 11
INSERT INTO quiz_questions (text, is_general, sector_code, active) VALUES
('¿Cada cuánto tiempo debe revisarse el Plan de Protección?', true, NULL, true);

INSERT INTO quiz_answers (question_id, text, is_correct) VALUES
((SELECT id FROM quiz_questions WHERE text = '¿Cada cuánto tiempo debe revisarse el Plan de Protección?' LIMIT 1),
'Al menos una vez al año', true),
((SELECT id FROM quiz_questions WHERE text = '¿Cada cuánto tiempo debe revisarse el Plan de Protección?' LIMIT 1),
'Cada 5 años', false),
((SELECT id FROM quiz_questions WHERE text = '¿Cada cuánto tiempo debe revisarse el Plan de Protección?' LIMIT 1),
'Solo cuando hay cambios legislativos', false),
((SELECT id FROM quiz_questions WHERE text = '¿Cada cuánto tiempo debe revisarse el Plan de Protección?' LIMIT 1),
'No es necesario revisarlo', false);

-- PREGUNTA 12
INSERT INTO quiz_questions (text, is_general, sector_code, active) VALUES
('¿Qué es el interés superior del menor?', true, NULL, true);

INSERT INTO quiz_answers (question_id, text, is_correct) VALUES
((SELECT id FROM quiz_questions WHERE text = '¿Qué es el interés superior del menor?' LIMIT 1),
'Principio que prioriza el bienestar del menor sobre cualquier otro interés', true),
((SELECT id FROM quiz_questions WHERE text = '¿Qué es el interés superior del menor?' LIMIT 1),
'El deseo expresado por los padres', false),
((SELECT id FROM quiz_questions WHERE text = '¿Qué es el interés superior del menor?' LIMIT 1),
'Lo que decida el director de la entidad', false),
((SELECT id FROM quiz_questions WHERE text = '¿Qué es el interés superior del menor?' LIMIT 1),
'Los intereses económicos de la familia', false);

-- PREGUNTA 13
INSERT INTO quiz_questions (text, is_general, sector_code, active) VALUES
('¿Qué debe garantizar el canal de comunicación para menores?', true, NULL, true);

INSERT INTO quiz_answers (question_id, text, is_correct) VALUES
((SELECT id FROM quiz_questions WHERE text = '¿Qué debe garantizar el canal de comunicación para menores?' LIMIT 1),
'Confidencialidad, accesibilidad y respuesta rápida', true),
((SELECT id FROM quiz_questions WHERE text = '¿Qué debe garantizar el canal de comunicación para menores?' LIMIT 1),
'Que solo funcione en horario de oficina', false),
((SELECT id FROM quiz_questions WHERE text = '¿Qué debe garantizar el canal de comunicación para menores?' LIMIT 1),
'Que requiera identificación completa del menor', false),
((SELECT id FROM quiz_questions WHERE text = '¿Qué debe garantizar el canal de comunicación para menores?' LIMIT 1),
'Que los padres sean informados automáticamente', false);

-- PREGUNTA 14
INSERT INTO quiz_questions (text, is_general, sector_code, active) VALUES
('¿Cuál es una medida preventiva obligatoria en espacios físicos?', true, NULL, true);

INSERT INTO quiz_answers (question_id, text, is_correct) VALUES
((SELECT id FROM quiz_questions WHERE text = '¿Cuál es una medida preventiva obligatoria en espacios físicos?' LIMIT 1),
'Evitar zonas aisladas o sin supervisión', true),
((SELECT id FROM quiz_questions WHERE text = '¿Cuál es una medida preventiva obligatoria en espacios físicos?' LIMIT 1),
'Permitir que los menores usen cualquier espacio libremente', false),
((SELECT id FROM quiz_questions WHERE text = '¿Cuál es una medida preventiva obligatoria en espacios físicos?' LIMIT 1),
'Cerrar las instalaciones con llave durante las actividades', false),
((SELECT id FROM quiz_questions WHERE text = '¿Cuál es una medida preventiva obligatoria en espacios físicos?' LIMIT 1),
'No supervisar los vestuarios', false);

-- PREGUNTA 15
INSERT INTO quiz_questions (text, is_general, sector_code, active) VALUES
('¿Qué es la violencia digital según la LOPIVI?', true, NULL, true);

INSERT INTO quiz_answers (question_id, text, is_correct) VALUES
((SELECT id FROM quiz_questions WHERE text = '¿Qué es la violencia digital según la LOPIVI?' LIMIT 1),
'Acoso, sextorsión, grooming y otras formas de violencia a través de medios digitales', true),
((SELECT id FROM quiz_questions WHERE text = '¿Qué es la violencia digital según la LOPIVI?' LIMIT 1),
'Solo el uso excesivo de pantallas', false),
((SELECT id FROM quiz_questions WHERE text = '¿Qué es la violencia digital según la LOPIVI?' LIMIT 1),
'El acceso a contenidos inadecuados', false),
((SELECT id FROM quiz_questions WHERE text = '¿Qué es la violencia digital según la LOPIVI?' LIMIT 1),
'Los videojuegos violentos', false);

-- =====================================================
-- PREGUNTAS ESPECÍFICAS POR SECTOR (5 por sector)
-- =====================================================

-- SECTOR: Ludoteca
INSERT INTO quiz_questions (text, is_general, sector_code, active) VALUES
('En una ludoteca, ¿cómo debe gestionarse la recogida de menores?', false, 'ludoteca', true);

INSERT INTO quiz_answers (question_id, text, is_correct) VALUES
((SELECT id FROM quiz_questions WHERE text = 'En una ludoteca, ¿cómo debe gestionarse la recogida de menores?' LIMIT 1),
'Solo entregarlos a personas autorizadas previamente por escrito', true),
((SELECT id FROM quiz_questions WHERE text = 'En una ludoteca, ¿cómo debe gestionarse la recogida de menores?' LIMIT 1),
'Permitir que cualquier adulto conocido los recoja', false),
((SELECT id FROM quiz_questions WHERE text = 'En una ludoteca, ¿cómo debe gestionarse la recogida de menores?' LIMIT 1),
'Dejar que los niños salgan solos si lo piden', false),
((SELECT id FROM quiz_questions WHERE text = 'En una ludoteca, ¿cómo debe gestionarse la recogida de menores?' LIMIT 1),
'No es necesario un protocolo específico', false);

INSERT INTO quiz_questions (text, is_general, sector_code, active) VALUES
('¿Cuál es la ratio mínima recomendada de adultos por menor en ludoteca?', false, 'ludoteca', true);

INSERT INTO quiz_answers (question_id, text, is_correct) VALUES
((SELECT id FROM quiz_questions WHERE text = '¿Cuál es la ratio mínima recomendada de adultos por menor en ludoteca?' LIMIT 1),
'1 adulto por cada 8-10 menores', true),
((SELECT id FROM quiz_questions WHERE text = '¿Cuál es la ratio mínima recomendada de adultos por menor en ludoteca?' LIMIT 1),
'1 adulto por cada 20 menores', false),
((SELECT id FROM quiz_questions WHERE text = '¿Cuál es la ratio mínima recomendada de adultos por menor en ludoteca?' LIMIT 1),
'1 adulto por cada 30 menores', false),
((SELECT id FROM quiz_questions WHERE text = '¿Cuál es la ratio mínima recomendada de adultos por menor en ludoteca?' LIMIT 1),
'No hay ratio específica', false);

INSERT INTO quiz_questions (text, is_general, sector_code, active) VALUES
('¿Qué debe hacerse si un menor presenta lesiones al llegar a la ludoteca?', false, 'ludoteca', true);

INSERT INTO quiz_answers (question_id, text, is_correct) VALUES
((SELECT id FROM quiz_questions WHERE text = '¿Qué debe hacerse si un menor presenta lesiones al llegar a la ludoteca?' LIMIT 1),
'Documentar las lesiones, preguntar de forma no invasiva y comunicar al Delegado/a', true),
((SELECT id FROM quiz_questions WHERE text = '¿Qué debe hacerse si un menor presenta lesiones al llegar a la ludoteca?' LIMIT 1),
'Ignorarlo si el menor dice que no duele', false),
((SELECT id FROM quiz_questions WHERE text = '¿Qué debe hacerse si un menor presenta lesiones al llegar a la ludoteca?' LIMIT 1),
'Llamar a la policía inmediatamente', false),
((SELECT id FROM quiz_questions WHERE text = '¿Qué debe hacerse si un menor presenta lesiones al llegar a la ludoteca?' LIMIT 1),
'Preguntarle solo a la familia', false);

INSERT INTO quiz_questions (text, is_general, sector_code, active) VALUES
('En ludotecas, ¿cómo deben supervisarse los baños?', false, 'ludoteca', true);

INSERT INTO quiz_answers (question_id, text, is_correct) VALUES
((SELECT id FROM quiz_questions WHERE text = 'En ludotecas, ¿cómo deben supervisarse los baños?' LIMIT 1),
'Supervisión externa sin vulnerar la intimidad, con puertas que no se cierren con llave', true),
((SELECT id FROM quiz_questions WHERE text = 'En ludotecas, ¿cómo deben supervisarse los baños?' LIMIT 1),
'No hace falta supervisarlos', false),
((SELECT id FROM quiz_questions WHERE text = 'En ludotecas, ¿cómo deben supervisarse los baños?' LIMIT 1),
'Acompañar siempre dentro del baño', false),
((SELECT id FROM quiz_questions WHERE text = 'En ludotecas, ¿cómo deben supervisarse los baños?' LIMIT 1),
'Permitir que varios menores entren sin control', false);

INSERT INTO quiz_questions (text, is_general, sector_code, active) VALUES
('¿Qué información debe recabarse de cada menor inscrito en la ludoteca?', false, 'ludoteca', true);

INSERT INTO quiz_answers (question_id, text, is_correct) VALUES
((SELECT id FROM quiz_questions WHERE text = '¿Qué información debe recabarse de cada menor inscrito en la ludoteca?' LIMIT 1),
'Datos de contacto, personas autorizadas, alergias y condiciones médicas', true),
((SELECT id FROM quiz_questions WHERE text = '¿Qué información debe recabarse de cada menor inscrito en la ludoteca?' LIMIT 1),
'Solo nombre y edad', false),
((SELECT id FROM quiz_questions WHERE text = '¿Qué información debe recabarse de cada menor inscrito en la ludoteca?' LIMIT 1),
'No es necesario recoger información', false),
((SELECT id FROM quiz_questions WHERE text = '¿Qué información debe recabarse de cada menor inscrito en la ludoteca?' LIMIT 1),
'Solo los datos de facturación', false);

-- SECTOR: Club de Fútbol (y deportivos en general)
INSERT INTO quiz_questions (text, is_general, sector_code, active) VALUES
('En entrenamientos deportivos, ¿cómo deben gestionarse los vestuarios?', false, 'club_futbol', true);

INSERT INTO quiz_answers (question_id, text, is_correct) VALUES
((SELECT id FROM quiz_questions WHERE text = 'En entrenamientos deportivos, ¿cómo deben gestionarse los vestuarios?' LIMIT 1),
'Supervisión externa, nunca entrenadores a solas con menores dentro', true),
((SELECT id FROM quiz_questions WHERE text = 'En entrenamientos deportivos, ¿cómo deben gestionarse los vestuarios?' LIMIT 1),
'El entrenador puede entrar libremente', false),
((SELECT id FROM quiz_questions WHERE text = 'En entrenamientos deportivos, ¿cómo deben gestionarse los vestuarios?' LIMIT 1),
'No hace falta supervisión', false),
((SELECT id FROM quiz_questions WHERE text = 'En entrenamientos deportivos, ¿cómo deben gestionarse los vestuarios?' LIMIT 1),
'Cerrar con llave durante el entrenamiento', false);

INSERT INTO quiz_questions (text, is_general, sector_code, active) VALUES
('¿Qué debe evitarse en desplazamientos deportivos con menores?', false, 'club_futbol', true);

INSERT INTO quiz_answers (question_id, text, is_correct) VALUES
((SELECT id FROM quiz_questions WHERE text = '¿Qué debe evitarse en desplazamientos deportivos con menores?' LIMIT 1),
'Que un adulto viaje solo con un menor sin autorización y supervisión', true),
((SELECT id FROM quiz_questions WHERE text = '¿Qué debe evitarse en desplazamientos deportivos con menores?' LIMIT 1),
'Viajar en autobús', false),
((SELECT id FROM quiz_questions WHERE text = '¿Qué debe evitarse en desplazamientos deportivos con menores?' LIMIT 1),
'Hacer paradas durante el viaje', false),
((SELECT id FROM quiz_questions WHERE text = '¿Qué debe evitarse en desplazamientos deportivos con menores?' LIMIT 1),
'Llevar agua y comida', false);

INSERT INTO quiz_questions (text, is_general, sector_code, active) VALUES
('¿Cómo debe actuar un entrenador ante una lesión de un menor?', false, 'club_futbol', true);

INSERT INTO quiz_answers (question_id, text, is_correct) VALUES
((SELECT id FROM quiz_questions WHERE text = '¿Cómo debe actuar un entrenador ante una lesión de un menor?' LIMIT 1),
'Valorar la lesión, aplicar primeros auxilios si procede, avisar a familia y documentar', true),
((SELECT id FROM quiz_questions WHERE text = '¿Cómo debe actuar un entrenador ante una lesión de un menor?' LIMIT 1),
'Ignorarlo si el menor dice que puede continuar', false),
((SELECT id FROM quiz_questions WHERE text = '¿Cómo debe actuar un entrenador ante una lesión de un menor?' LIMIT 1),
'Obligar al menor a continuar entrenando', false),
((SELECT id FROM quiz_questions WHERE text = '¿Cómo debe actuar un entrenador ante una lesión de un menor?' LIMIT 1),
'Solo avisar a la familia al final de la sesión', false);

INSERT INTO quiz_questions (text, is_general, sector_code, active) VALUES
('¿Qué tipo de comunicación debe evitarse entre entrenador y menor fuera del club?', false, 'club_futbol', true);

INSERT INTO quiz_answers (question_id, text, is_correct) VALUES
((SELECT id FROM quiz_questions WHERE text = '¿Qué tipo de comunicación debe evitarse entre entrenador y menor fuera del club?' LIMIT 1),
'Comunicación privada individual fuera de canales oficiales', true),
((SELECT id FROM quiz_questions WHERE text = '¿Qué tipo de comunicación debe evitarse entre entrenador y menor fuera del club?' LIMIT 1),
'Comunicación grupal sobre entrenamientos', false),
((SELECT id FROM quiz_questions WHERE text = '¿Qué tipo de comunicación debe evitarse entre entrenador y menor fuera del club?' LIMIT 1),
'Avisos sobre cambios de horario', false),
((SELECT id FROM quiz_questions WHERE text = '¿Qué tipo de comunicación debe evitarse entre entrenador y menor fuera del club?' LIMIT 1),
'Felicitaciones por el rendimiento deportivo', false);

INSERT INTO quiz_questions (text, is_general, sector_code, active) VALUES
('¿Qué debe hacer un club deportivo si detecta acoso entre menores del equipo?', false, 'club_futbol', true);

INSERT INTO quiz_answers (question_id, text, is_correct) VALUES
((SELECT id FROM quiz_questions WHERE text = '¿Qué debe hacer un club deportivo si detecta acoso entre menores del equipo?' LIMIT 1),
'Activar protocolo antibullying, proteger a la víctima, comunicar a Delegado/a y familias', true),
((SELECT id FROM quiz_questions WHERE text = '¿Qué debe hacer un club deportivo si detecta acoso entre menores del equipo?' LIMIT 1),
'Esperar a ver si se resuelve solo', false),
((SELECT id FROM quiz_questions WHERE text = '¿Qué debe hacer un club deportivo si detecta acoso entre menores del equipo?' LIMIT 1),
'Castigar solo al acosador sin más acciones', false),
((SELECT id FROM quiz_questions WHERE text = '¿Qué debe hacer un club deportivo si detecta acoso entre menores del equipo?' LIMIT 1),
'No intervenir si ocurre fuera del club', false);

-- SECTOR: Academia / Clases Particulares
INSERT INTO quiz_questions (text, is_general, sector_code, active) VALUES
('En clases particulares, ¿qué medida de protección es obligatoria?', false, 'academia', true);

INSERT INTO quiz_answers (question_id, text, is_correct) VALUES
((SELECT id FROM quiz_questions WHERE text = 'En clases particulares, ¿qué medida de protección es obligatoria?' LIMIT 1),
'No estar a solas con un menor en espacios cerrados sin visibilidad', true),
((SELECT id FROM quiz_questions WHERE text = 'En clases particulares, ¿qué medida de protección es obligatoria?' LIMIT 1),
'Cerrar la puerta con llave durante la clase', false),
((SELECT id FROM quiz_questions WHERE text = 'En clases particulares, ¿qué medida de protección es obligatoria?' LIMIT 1),
'No es necesaria ninguna medida especial', false),
((SELECT id FROM quiz_questions WHERE text = 'En clases particulares, ¿qué medida de protección es obligatoria?' LIMIT 1),
'Grabar todas las clases en vídeo', false);

INSERT INTO quiz_questions (text, is_general, sector_code, active) VALUES
('¿Cómo debe gestionarse el contacto físico en clases de instrumento musical?', false, 'academia', true);

INSERT INTO quiz_answers (question_id, text, is_correct) VALUES
((SELECT id FROM quiz_questions WHERE text = '¿Cómo debe gestionarse el contacto físico en clases de instrumento musical?' LIMIT 1),
'Solo el mínimo necesario, explicado previamente al menor y con puertas abiertas', true),
((SELECT id FROM quiz_questions WHERE text = '¿Cómo debe gestionarse el contacto físico en clases de instrumento musical?' LIMIT 1),
'Está prohibido cualquier contacto', false),
((SELECT id FROM quiz_questions WHERE text = '¿Cómo debe gestionarse el contacto físico en clases de instrumento musical?' LIMIT 1),
'El profesor puede decidir libremente', false),
((SELECT id FROM quiz_questions WHERE text = '¿Cómo debe gestionarse el contacto físico en clases de instrumento musical?' LIMIT 1),
'Solo con autorización escrita semanal de los padres', false);

INSERT INTO quiz_questions (text, is_general, sector_code, active) VALUES
('¿Qué información debe compartirse con las familias en academias?', false, 'academia', true);

INSERT INTO quiz_answers (question_id, text, is_correct) VALUES
((SELECT id FROM quiz_questions WHERE text = '¿Qué información debe compartirse con las familias en academias?' LIMIT 1),
'Plan de protección, protocolos y canal de comunicación de incidencias', true),
((SELECT id FROM quiz_questions WHERE text = '¿Qué información debe compartirse con las familias en academias?' LIMIT 1),
'Solo los horarios de clases', false),
((SELECT id FROM quiz_questions WHERE text = '¿Qué información debe compartirse con las familias en academias?' LIMIT 1),
'No es necesario compartir información de protección', false),
((SELECT id FROM quiz_questions WHERE text = '¿Qué información debe compartirse con las familias en academias?' LIMIT 1),
'Únicamente los precios y métodos de pago', false);

INSERT INTO quiz_questions (text, is_general, sector_code, active) VALUES
('¿Cómo debe documentarse el progreso del menor en academias?', false, 'academia', true);

INSERT INTO quiz_answers (question_id, text, is_correct) VALUES
((SELECT id FROM quiz_questions WHERE text = '¿Cómo debe documentarse el progreso del menor en academias?' LIMIT 1),
'Con informes periódicos compartidos con la familia respetando la privacidad del menor', true),
((SELECT id FROM quiz_questions WHERE text = '¿Cómo debe documentarse el progreso del menor en academias?' LIMIT 1),
'No es necesario documentar nada', false),
((SELECT id FROM quiz_questions WHERE text = '¿Cómo debe documentarse el progreso del menor en academias?' LIMIT 1),
'Solo comentarios verbales ocasionales', false),
((SELECT id FROM quiz_questions WHERE text = '¿Cómo debe documentarse el progreso del menor en academias?' LIMIT 1),
'Publicando los resultados en redes sociales', false);

INSERT INTO quiz_questions (text, is_general, sector_code, active) VALUES
('¿Qué debe hacer un profesor si un menor le cuenta un problema personal grave?', false, 'academia', true);

INSERT INTO quiz_answers (question_id, text, is_correct) VALUES
((SELECT id FROM quiz_questions WHERE text = '¿Qué debe hacer un profesor si un menor le cuenta un problema personal grave?' LIMIT 1),
'Escuchar sin juzgar, documentar y comunicar inmediatamente al Delegado/a de Protección', true),
((SELECT id FROM quiz_questions WHERE text = '¿Qué debe hacer un profesor si un menor le cuenta un problema personal grave?' LIMIT 1),
'Prometerle que no lo contará a nadie', false),
((SELECT id FROM quiz_questions WHERE text = '¿Qué debe hacer un profesor si un menor le cuenta un problema personal grave?' LIMIT 1),
'Intentar resolver el problema por su cuenta', false),
((SELECT id FROM quiz_questions WHERE text = '¿Qué debe hacer un profesor si un menor le cuenta un problema personal grave?' LIMIT 1),
'Ignorarlo si no afecta a las clases', false);

-- =====================================================
-- NOTA: Añadir más preguntas sectoriales según se necesite
-- (campamento, club_baloncesto, club_natacion, escuela_musica, centro_ocio, otro)
-- Para lanzar al mercado, con estas 15 generales + 5 de cada sector es suficiente
-- =====================================================

-- Políticas RLS (Row Level Security) - Acceso público de lectura
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempt_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Permitir lectura pública (las políticas de escritura se manejan en el backend)
CREATE POLICY "Allow read quiz_questions" ON quiz_questions FOR SELECT USING (true);
CREATE POLICY "Allow read quiz_answers" ON quiz_answers FOR SELECT USING (true);
CREATE POLICY "Allow insert quiz_attempts" ON quiz_attempts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read own quiz_attempts" ON quiz_attempts FOR SELECT USING (true);
CREATE POLICY "Allow update own quiz_attempts" ON quiz_attempts FOR UPDATE USING (true);
CREATE POLICY "Allow insert quiz_attempt_items" ON quiz_attempt_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read own quiz_attempt_items" ON quiz_attempt_items FOR SELECT USING (true);
CREATE POLICY "Allow update own quiz_attempt_items" ON quiz_attempt_items FOR UPDATE USING (true);
CREATE POLICY "Allow all on training_status" ON training_status FOR ALL USING (true);
CREATE POLICY "Allow all on certificates" ON certificates FOR ALL USING (true);

-- =====================================================
-- FIN DE MIGRACIÓN
-- =====================================================
