-- Migration: Sistema de Onboarding de Delegados
-- Fecha: 2025-01-11

-- ============================================================
-- 1. SECTORES Y BANCO DE PREGUNTAS PARA TEST SECTORIZADO
-- ============================================================

create table if not exists sectors (
  id text primary key,
  nombre text not null,
  created_at timestamptz default now()
);

create table if not exists quiz_questions (
  id bigint generated always as identity primary key,
  sector_id text references sectors(id) on delete set null, -- null = pregunta universal
  pregunta text not null,
  opcion_a text not null,
  opcion_b text not null,
  opcion_c text,
  opcion_d text,
  correcta text not null check (correcta in ('A','B','C','D')),
  es_universal boolean default false, -- true si es pregunta universal
  created_at timestamptz default now()
);

create index if not exists idx_quiz_sector on quiz_questions(sector_id);
create index if not exists idx_quiz_universal on quiz_questions(es_universal);

-- Índice único para evitar duplicados de preguntas por sector
create unique index if not exists ux_quiz_unique on quiz_questions (sector_id, pregunta);

-- ============================================================
-- 2. ENLACES/TOKENS DE ONBOARDING
-- ============================================================

create table if not exists onboarding_links (
  id uuid default gen_random_uuid() primary key,
  entity_id uuid references entities(id) on delete cascade,
  token text unique not null,
  enabled boolean default true,
  deadline_at date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_onboarding_links_entity on onboarding_links(entity_id);
create index if not exists idx_onboarding_links_token on onboarding_links(token);

-- ============================================================
-- 3. RESPUESTAS DE ONBOARDING
-- ============================================================

create table if not exists onboarding_responses (
  id uuid default gen_random_uuid() primary key,
  entity_id uuid references entities(id) on delete cascade,
  perfil text not null check (perfil in ('personal_contacto', 'personal_sin_contacto', 'familia')),

  -- Datos básicos
  nombre text not null,
  email text,
  telefono text,

  -- Familias: soporte multi-hijo
  hijos jsonb, -- [{nombre, fecha_nacimiento, menor16:boolean}]

  -- Personal contacto: flags
  penales_entregado boolean default false,
  penales_fecha date,
  test_score int,
  test_total int default 10,
  test_passed boolean,
  test_answers jsonb, -- [{question_id, selected, correct}]
  sector_id text references sectors(id),

  -- Confirmaciones de documentación
  docs_checklist jsonb, -- ['codigo_conducta','protocolo_actuacion',...]
  lectura_confirmada boolean default false,

  -- Control de plazo
  deadline_at date,
  completed_at timestamptz,
  status text default 'pendiente' check (status in ('pendiente', 'ok', 'vencido')),

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_onboard_entity on onboarding_responses(entity_id);
create index if not exists idx_onboard_status on onboarding_responses(status);
create index if not exists idx_onboard_perfil on onboarding_responses(perfil);

-- ============================================================
-- 4. TABLAS BASE (solo si no existen)
-- ============================================================

create table if not exists entities (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  sector text,
  tamano text,
  fecha_contratacion date,
  responsable text,
  email_contacto text,
  logo_url text,
  created_at timestamptz default now()
);

create table if not exists people (
  id uuid default gen_random_uuid() primary key,
  entity_id uuid references entities(id) on delete cascade,
  nombre text not null,
  email text,
  telefono text,
  rol text not null,
  es_contacto boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- 5. FORMACIÓN (sin archivos)
-- ============================================================

create table if not exists trainings (
  id bigint generated always as identity primary key,
  person_id uuid references people(id) on delete cascade,
  curso text not null default 'LOPIVI Básico',
  estado text not null check (estado in ('pendiente','completado','en_progreso','caducado')),
  fecha_asignacion date,
  fecha_completado date,
  created_at timestamptz default now()
);

create index if not exists idx_trainings_person on trainings(person_id);

-- ============================================================
-- 6. CERTIFICADOS PENALES (SOLO ESTADO, SIN ARCHIVOS)
-- ============================================================

create table if not exists background_checks (
  id bigint generated always as identity primary key,
  person_id uuid references people(id) on delete cascade,
  tipo text not null default 'penales',
  entregado boolean default false,
  fecha_entrega date,
  verificado_por_delegado boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_background_person on background_checks(person_id);

-- ============================================================
-- 7. SEED DE SECTORES Y PREGUNTAS
-- ============================================================

-- Sectores
insert into sectors (id, nombre) values
  ('ludoteca', 'Ludoteca'),
  ('club_futbol', 'Club de Fútbol'),
  ('academia', 'Academia / Extraescolares'),
  ('colegio', 'Centro Educativo'),
  ('ong', 'ONG/Asociación'),
  ('campamento', 'Campamentos / Colonias')
on conflict (id) do nothing;

-- Preguntas para Ludoteca
insert into quiz_questions (sector_id, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, correcta) values
  ('ludoteca', '¿Qué debe hacer si observa un comportamiento inadecuado entre un monitor y un menor?', 'Ignorarlo si no es grave', 'Informar inmediatamente al delegado de protección', 'Hablar directamente con el monitor', 'Esperar a ver si se repite', 'B'),
  ('ludoteca', '¿Cuál es el objetivo principal de la LOPIVI?', 'Proteger a los trabajadores', 'Proteger integralmente a los menores frente a cualquier forma de violencia', 'Regular el horario de las actividades', 'Contratar más personal', 'B'),
  ('ludoteca', '¿Qué indica que un menor puede estar sufriendo maltrato?', 'Viene siempre con ropa limpia', 'Muestra cambios bruscos de comportamiento, miedo o aislamiento', 'Participa activamente en las actividades', 'Tiene muchos amigos', 'B'),
  ('ludoteca', '¿Está permitido tomar fotografías de menores sin consentimiento?', 'Sí, si es para uso interno', 'No, nunca sin consentimiento de los tutores legales', 'Sí, si no se publican', 'Depende de la edad del menor', 'B'),
  ('ludoteca', '¿Qué es el principio del interés superior del menor?', 'Que el menor obedezca siempre', 'Que las decisiones prioricen el bienestar del menor', 'Que el menor elija todo', 'Que los padres decidan todo', 'B'),
  ('ludoteca', '¿Cuándo debe activarse el protocolo de actuación?', 'Solo si hay pruebas físicas', 'Ante cualquier sospecha o indicio de violencia', 'Solo si el menor lo pide', 'Solo si hay testigos', 'B'),
  ('ludoteca', '¿Qué debe incluir un código de conducta?', 'Solo normas para los menores', 'Normas de comportamiento para todo el personal y voluntarios', 'Horarios de trabajo', 'Precios de las actividades', 'B'),
  ('ludoteca', '¿Quién es responsable de garantizar la protección de los menores en la entidad?', 'Solo el delegado de protección', 'Toda la entidad, dirección, personal y voluntarios', 'Solo los monitores', 'Solo los padres', 'B'),
  ('ludoteca', '¿Qué hacer si un menor revela que está sufriendo abuso?', 'Pedirle que lo demuestre', 'Escucharlo con calma, creerle y notificar inmediatamente al delegado', 'Llamar directamente a los padres', 'Investigar por cuenta propia', 'B'),
  ('ludoteca', '¿Es obligatorio el certificado de delitos sexuales para trabajar con menores?', 'No, es opcional', 'Sí, es obligatorio para cualquier persona que trabaje con menores', 'Solo para directores', 'Solo si hay antecedentes', 'B'),
  ('ludoteca', '¿Qué tipo de contacto físico es apropiado con un menor?', 'Abrazos y besos constantes', 'Solo el necesario para la actividad, con respeto y en público', 'Ninguno nunca', 'El que el menor pida', 'B'),
  ('ludoteca', '¿Puede un menor ser sancionado físicamente?', 'Sí, si se porta mal', 'No, nunca está permitido el castigo físico', 'Sí, con autorización de los padres', 'Depende de la edad', 'B');

-- Preguntas para Club de Fútbol
insert into quiz_questions (sector_id, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, correcta) values
  ('club_futbol', '¿Qué debe hacer un entrenador si detecta señales de maltrato en un jugador?', 'Hablar con los padres directamente', 'Informar inmediatamente al delegado de protección', 'Ignorarlo si no está seguro', 'Esperar a tener más pruebas', 'B'),
  ('club_futbol', '¿Está permitido gritar o humillar a un menor durante un entrenamiento?', 'Sí, si es para motivarlo', 'No, nunca está permitido el maltrato psicológico', 'Sí, si todos lo hacen', 'Depende del nivel de competición', 'B'),
  ('club_futbol', '¿Qué es la LOPIVI?', 'Ley de protección de instalaciones deportivas', 'Ley Orgánica de Protección Integral a la Infancia frente a la Violencia', 'Ley de organización de partidos', 'Ley de prevención de lesiones', 'B'),
  ('club_futbol', '¿Puede un entrenador estar a solas con un menor en vestuarios cerrados?', 'Sí, si es necesario', 'No, debe evitarse estar a solas en espacios cerrados', 'Sí, si hay confianza', 'Depende del menor', 'B'),
  ('club_futbol', '¿Qué hacer si un padre se comporta de forma agresiva con su hijo en el campo?', 'Ignorarlo', 'Intervenir de forma calmada y si persiste, activar el protocolo', 'Llamar a la policía inmediatamente', 'Expulsar al padre del club', 'B'),
  ('club_futbol', '¿Es obligatorio tener un protocolo de actuación ante situaciones de violencia?', 'No, es opcional', 'Sí, todas las entidades deben tenerlo', 'Solo clubes profesionales', 'Solo si hay casos previos', 'B'),
  ('club_futbol', '¿Qué información debe tener el delegado de protección?', 'Solo su nombre', 'Nombre, función, contacto y cómo comunicarse con él', 'Solo su foto', 'No hace falta información', 'B'),
  ('club_futbol', '¿Puede un menor negarse a participar en una actividad?', 'No, debe obedecer siempre', 'Sí, tiene derecho a negarse si se siente incómodo', 'Solo si hay lesión', 'Solo con permiso del entrenador', 'B'),
  ('club_futbol', '¿Qué es un indicador de abuso sexual en menores?', 'Que juegue bien', 'Cambios de comportamiento, miedo, conductas sexualizadas inadecuadas', 'Que tenga muchos amigos', 'Que sea tímido', 'B'),
  ('club_futbol', '¿Quién puede denunciar una situación de riesgo para un menor?', 'Solo los padres', 'Cualquier persona que tenga conocimiento de la situación', 'Solo el delegado', 'Solo la dirección', 'B');

-- Preguntas para Academia
insert into quiz_questions (sector_id, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, correcta) values
  ('academia', '¿Qué debe hacer si sospecha que un alumno sufre negligencia en casa?', 'Llamar a los padres', 'Informar al delegado de protección de inmediato', 'Esperar a estar seguro', 'Darle comida al menor', 'B'),
  ('academia', '¿Es apropiado enviar mensajes privados a un menor fuera del horario de clase?', 'Sí, si es educativo', 'No, debe usarse siempre comunicación oficial y visible', 'Sí, si los padres lo saben', 'Depende de la edad', 'B'),
  ('academia', '¿Qué es el grooming?', 'Técnica de enseñanza', 'Acoso sexual a menores a través de medios digitales', 'Método de evaluación', 'Actividad deportiva', 'B'),
  ('academia', '¿Puede un profesor tocar a un menor para corregir su postura (instrumento, danza)?', 'Sí, sin restricciones', 'Solo si es necesario, con consentimiento, de forma respetuosa y en público', 'No, nunca', 'Solo en clases individuales', 'B'),
  ('academia', '¿Qué hacer si un menor revela que otro alumno lo acosa?', 'Decirle que lo ignore', 'Tomar en serio la denuncia y activar el protocolo', 'Hablar solo con el acosador', 'Esperar a ver si mejora', 'B'),
  ('academia', '¿Está permitido grabar videos o fotos de menores sin consentimiento?', 'Sí, con fines educativos', 'No, se requiere consentimiento expreso de los tutores', 'Sí, si no se publican', 'Depende de la actividad', 'B'),
  ('academia', '¿Qué debe incluir el código de conducta de la academia?', 'Solo normas para alumnos', 'Normas claras para profesores, personal y alumnos', 'Tarifas', 'Horarios', 'B'),
  ('academia', '¿Es obligatorio informar si se detecta una situación de riesgo?', 'No, si no estoy seguro', 'Sí, es obligatorio informar cualquier sospecha', 'Solo si hay pruebas', 'Solo si el menor lo pide', 'B'),
  ('academia', '¿Qué es el principio de escucha activa del menor?', 'Que el menor siempre obedezca', 'Que el menor sea escuchado y su opinión tomada en cuenta', 'Que el profesor decida todo', 'Que el menor elija todo', 'B'),
  ('academia', '¿Puede un menor quedarse solo con un profesor en la academia fuera de horario?', 'Sí, si hay confianza', 'No, debe evitarse estar a solas en situaciones no transparentes', 'Sí, si los padres lo autorizan', 'Depende del menor', 'B');

-- ============================================================
-- PREGUNTAS UNIVERSALES ADICIONALES (mayor rotación)
-- ============================================================
insert into quiz_questions (sector_id, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, correcta, es_universal) values
  (NULL,'¿Qué significa "tolerancia cero" frente a la violencia contra la infancia?','No permitir conductas de riesgo ni minimizarlas','Esperar a tener pruebas absolutas','Delegar en familias siempre','Resolverlo con el menor en privado','A', true),
  (NULL,'¿Cuál es la actitud adecuada ante una sospecha?','Registrar hechos, comunicar por canal y no investigar por tu cuenta','Pedir versiones a todos en público','Publicarlo para concienciar','Ignorarlo si no estás seguro','A', true),
  (NULL,'¿Qué debe priorizarse en cualquier decisión?','El interés superior del menor','La imagen de la entidad','La comodidad del equipo','La rapidez del trámite','A', true),
  (NULL,'¿Cuándo es apropiado compartir datos de un menor?','Solo si es necesario y por canales seguros previstos','Siempre con el grupo','Por mensajería sin cifrar','En redes privadas del staff','A', true),
  (NULL,'¿Qué es una conducta de riesgo?','Acción u omisión que puede derivar en daño o vulneración de derechos','Cualquier sanción disciplinaria','Todo contacto físico','Una broma entre iguales','A', true),
  (NULL,'¿Qué debe incluir un Plan de Protección Infantil?','Prevención, detección, actuación y canal interno','Solo formación anual','Un listado de teléfonos','Normas de vestuario','A', true),
  (NULL,'¿Qué se recomienda al recoger testimonios del menor?','Escucha activa, sin juicios ni preguntas sugerentes','Entrevista en grupo','Cuestionario cerrado obligatorio','Grabación sin permisos','A', true),
  (NULL,'Sobre imágenes de menores, lo correcto es…','Contar con consentimiento y limitar usos y acceso','Publicarlas si están pixeladas','Difundir en chats internos libremente','Permitir que cualquiera grabe','A', true),
  (NULL,'¿Qué corresponde al personal ante una revelación de daño?','Proteger, registrar y activar protocolo','Prometer secreto','Derivar al grupo de WhatsApp','Avisar al público','A', true),
  (NULL,'¿Qué debe evitarse siempre?','Relación asimétrica y humillante','Comunicación clara','Espacios visibles','Supervisión suficiente','A', true),
  (NULL,'¿Qué rol tiene el delegado de protección?','Coordinar el plan y velar por su cumplimiento y mejora','Sustituir a dirección','Formar a todo el personal personalmente','Resolver toda incidencia sin protocolo','A', true),
  (NULL,'¿Qué principio aplica al mínimo dato personal?','Necesidad, finalidad y proporcionalidad','Recoger todo por si acaso','Guardar copias en dispositivos privados','Compartir con proveedores sin contrato','A', true),
  (NULL,'¿Qué hacer ante ciberacoso detectado?','Seguir el protocolo específico y preservar evidencias','Avisar al agresor por redes','Pedir al menor que lo solucione','Ignorarlo si es fuera del centro','A', true),
  (NULL,'¿Qué comunicación con familias es adecuada?','Transparente, respetuosa y ajustada al plan','Usar chats masivos sin control','Enviar datos sensibles por difusión','Publicar resoluciones','A', true);

-- ============================================================
-- PREGUNTAS ADICIONALES PARA ACADEMIA / EXTRAESCOLARES
-- ============================================================
insert into quiz_questions (sector_id, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, correcta) values
  ('academia','Entrega y recogida del alumnado en actividades extraescolares:','Listados, autorizaciones y verificación de identidad','Entrega a quien primero llegue','Autorización verbal basta','Se delega en cualquier monitor','A'),
  ('academia','Uso de mensajería con alumnado:','Restringido y por canales aprobados','Libre con cada alumno/a','Grupos sin control son válidos','Se permite fuera de horario sin límites','A'),
  ('academia','Espacios individuales de refuerzo:','Puertas entornadas y visibilidad; nunca a solas sin supervisión','Aulas cerradas sin visión','Despacho privado con llave','En cafetería sin control','A'),
  ('academia','Material audiovisual en clase:','Con consentimiento y finalidad educativa definida','Libre difusión en redes','Grabación libre para portfolio','Sin restricciones','A'),
  ('academia','Gestión de ausencias o cambios de conducta:','Registro y comunicación por protocolo','Tratarlo en público','Ignorarlo si rinde','Aviso por chat masivo','A'),
  ('academia','Salidas puntuales (concursos, actos):','Autorizaciones y ratios de acompañantes','Sin permiso si es cerca','Solo aviso por cartel','Se decide sobre la marcha','A'),
  ('academia','Personas voluntarias en talleres:','Mismas obligaciones que personal de contacto','No requieren controles','Solo formación voluntaria','Acceso libre a datos','A'),
  ('academia','Ajustes razonables:','Medidas para inclusión y protección de cada menor','Trato idéntico sin matices','Excluir por dificultad','Decisión unilateral sin registro','A');

-- ============================================================
-- PREGUNTAS PARA CAMPAMENTOS / COLONIAS
-- ============================================================
insert into quiz_questions (sector_id, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, correcta) values
  ('campamento','Alojamiento por la noche:','Habitaciones separadas por edad/sexo y monitores designados','Dormir todos juntos en sala','Monitores a solas con menores','Sin control de accesos','A'),
  ('campamento','Salidas a naturaleza:','Evaluación de riesgos, ratios y responsables','Ir en grupos libres','Sin hoja de ruta','Sin botiquín ni permisos','A'),
  ('campamento','Higiene y vestuarios:','Zonas separadas y supervisión no invasiva','Monitores dentro siempre','Puertas cerradas con llave','Zonas comunes sin control','A'),
  ('campamento','Uso de móviles y fotos:','Normas claras, consentimiento y control de publicación','Fotos libres para RRSS','Grabar en tiendas sin límites','Solo prohibirlo y ya está','A'),
  ('campamento','Medicaciones y alergias:','Registro, custodia y administración conforme a protocolo','Que lo gestione cualquier menor','Sin registro','Guardar en mochilas','A'),
  ('campamento','Pernocta y emergencias:','Plan de guardias, teléfonos y simulacros','Improvisar si surge','Solo un monitor por turno','Sin comunicación con familias','A'),
  ('campamento','Bañistas y actividades acuáticas:','Monitores titulados, ratios y evaluación previa','Libre baño sin control','Solo si el grupo lo pide','Decisión de cada niño/a','A'),
  ('campamento','Visitas de terceros:','Control de identidad y accesos, registro de entradas','Puertas abiertas','Acceso libre a proveedores','Visitas sin supervisión','A');

-- Función para actualizar updated_at automáticamente
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers para updated_at
create trigger update_onboarding_links_updated_at before update on onboarding_links
  for each row execute function update_updated_at_column();

create trigger update_onboarding_responses_updated_at before update on onboarding_responses
  for each row execute function update_updated_at_column();

create trigger update_background_checks_updated_at before update on background_checks
  for each row execute function update_updated_at_column();
