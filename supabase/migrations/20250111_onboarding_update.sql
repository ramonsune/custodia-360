-- Actualización del sistema de onboarding (mantener estructura existente)
-- NO borrar datos existentes

-- Agregar campo es_universal a quiz_questions si no existe
ALTER TABLE quiz_questions 
ADD COLUMN IF NOT EXISTS es_universal boolean DEFAULT false;

-- Limpiar preguntas antiguas (solo si quieres resetear)
-- TRUNCATE quiz_questions CASCADE;

-- Insertar sectores (si no existen)
INSERT INTO sectors (id, nombre) VALUES
('ludoteca','Ludoteca'),
('club_futbol','Club de Fútbol'),
('centro_educativo','Centro Educativo'),
('ong','ONG')
ON CONFLICT (id) DO NOTHING;

-- PREGUNTAS UNIVERSALES (sector_id = NULL, es_universal = true)
INSERT INTO quiz_questions (sector_id, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, correcta, es_universal) VALUES
(NULL,'¿Qué persigue la LOPIVI de forma general?','Proteger a la infancia y prevenir la violencia','Regular los contratos del personal','Gestionar subvenciones deportivas','Sustituir las leyes educativas','A', true),
(NULL,'¿Qué debe hacer cualquier adulto ante una sospecha razonable de riesgo para un menor?','Comunicarlo por los canales establecidos cuanto antes','Esperar confirmación del director','Preguntar al menor públicamente','Ignorarlo para no alarmar','A', true),
(NULL,'¿Qué es un indicador de riesgo?','Señal que apunta a posible situación de violencia o desprotección','Documento firmado por las familias','Un curso voluntario','Un parte médico siempre','A', true),
(NULL,'El principio de "interés superior del menor" implica…','Priorizar decisiones que protejan y beneficien al menor','Anteponer intereses del centro','Cumplir objetivos deportivos','Evitar todo cambio de rutina','A', true),
(NULL,'¿Qué es el plan de protección infantil?','Conjunto de medidas y protocolos para prevenir, detectar y actuar','Un folleto publicitario','Un reglamento deportivo','Solo una formación anual','A', true),
(NULL,'Ante una revelación directa del menor…','Escuchar sin juzgar, anotar, y activar el protocolo','Prometer secreto absoluto y no actuar','Interrogar con detalle','Contarlo al grupo para contrastar','A', true),
(NULL,'¿Quién debe cumplir el código de conducta?','Todo el personal y personas colaboradoras','Solo el delegado','Solo cargos directivos','Solo voluntariado','A', true),
(NULL,'¿Qué dato es mínimo y necesario?','El estrictamente imprescindible para la finalidad','Todos los que pidan las familias','Ninguno, por privacidad','Copias de DNI de todos','A', true),
(NULL,'¿Qué vías son adecuadas para comunicar incidencias?','Las previstas en el canal interno del plan','Redes sociales','WhatsApp a cualquier trabajador','Comentarios en público','A', true),
(NULL,'¿Qué debe evitarse en el trato con menores?','Conductas ambiguas o que generen riesgo','Comunicación clara','Respeto a la intimidad','Supervisión adecuada','A', true);

-- PREGUNTAS SECTORIALES - LUDOTECA
INSERT INTO quiz_questions (sector_id, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, correcta, es_universal) VALUES
('ludoteca','¿Cómo debe organizarse la supervisión en salas de juego?','Con ratios y visión constante de las zonas','Solo cámara en recepción','Dejar a los mayores solos','Con visitas esporádicas','A', false),
('ludoteca','Norma clave en baños/vestuarios en ludoteca:','Nunca permanecer a solas con un menor','Pedirles que se apuren','Cerrar la puerta con llave','Quitar decoración','A', false),
('ludoteca','Recogida de menores:','Entregar solo a personas autorizadas','A cualquier adulto','Al hermano mayor siempre','A quien diga ser familiar','A', false),
('ludoteca','Contenido fotográfico:','Requiere autorización previa y control de uso','Libre en eventos','Depende del número de niños','No aplica','A', false),
('ludoteca','Juego físico y contacto:','Se ajusta a pautas del plan y al consentimiento','Al criterio de quien esté','Depende del clima','Nunca permitido','A', false),
('ludoteca','Incidencia leve (golpe, llanto):','Registrar y comunicar por canal interno','Ignorar si pasa','Publicarlo en RRSS','Pedir versión al resto de niños','A', false);

-- PREGUNTAS SECTORIALES - CLUB DE FÚTBOL
INSERT INTO quiz_questions (sector_id, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, correcta, es_universal) VALUES
('club_futbol','Traslado a partidos/entrenos:','Seguir protocolo de transporte y autorizaciones','Cada familia como quiera','El entrenador decide','No se documenta','A', false),
('club_futbol','Vestuario/duchas:','Espacios separados y supervisión adecuada','Entrenador a solas con menores','Puertas siempre cerradas con llave','Mezclar categorías','A', false),
('club_futbol','Tratamiento de lesiones leves:','Primeros auxilios y registro de incidencia','Ignorar si sigue jugando','Publicar parte médico','Llamar siempre a prensa','A', false),
('club_futbol','Redes y fotos de equipo:','Con consentimiento y canales oficiales','Cualquiera publica','Solo si hay victoria','Nunca se piden permisos','A', false),
('club_futbol','Viajes y pernocta:','Asignar responsables y cumplir ratios y habitaciones por edad/sexo','Dormir todos juntos en sala','Sin responsables designados','Pernocta libre','A', false),
('club_futbol','Límites en feedback:','Respetuoso, sin humillar ni ridiculizar','Motivar gritando siempre','Comparar con otros para presión','Castigo físico','A', false);

-- PREGUNTAS SECTORIALES - CENTRO EDUCATIVO
INSERT INTO quiz_questions (sector_id, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, correcta, es_universal) VALUES
('centro_educativo','Entrada/salida del centro:','Control de acceso y entregas autorizadas','Puertas abiertas siempre','Entrega a cualquiera','Sin registro de tardanzas','A', false),
('centro_educativo','Uso de dispositivos en aula:','Según norma, proteger imagen y datos','Libre grabación','Docente decide siempre','Alumnado decide','A', false),
('centro_educativo','Atención individual:','Puertas entornadas y espacios visibles','Aulas cerradas sin visión','Patios sin vigilancia','En almacén','A', false),
('centro_educativo','Detectar absentismo o cambios bruscos:','Comunicar por protocolo y coordinación','Esperar a la tutoría final','Tratar en grupo clase','Publicarlo en tablón','A', false),
('centro_educativo','Excursiones:','Autorizaciones y ratios; plan de riesgos','Salir sin avisar','Lista oral basta','Un solo adulto con grupo grande','A', false),
('centro_educativo','Datos de salud y alergias:','Acceso mínimo y uso solo para cuidado','Compartir por WhatsApp','Publicar lista en aula','Preguntar al grupo','A', false);

-- PREGUNTAS SECTORIALES - ONG
INSERT INTO quiz_questions (sector_id, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, correcta, es_universal) VALUES
('ong','Voluntariado con menores:','Mismas exigencias que personal de contacto','Exento de penales','Sin formación','Sin identificación','A', false),
('ong','Actividades en calle:','Itinerario, responsables y contacto claro','Improvisar','Sin contar participantes','Sin evaluar riesgos','A', false),
('ong','Atención psicosocial:','Derivar y registrar por protocolo','Prometer secreto y no actuar','Publicar casos','Debatir en redes','A', false),
('ong','Recogida de imágenes:','Consentimiento expreso y finalidades claras','Siempre permitidas','Con autorización verbal basta','Nunca necesarias','A', false),
('ong','Espacios seguros:','Revisión de espacios y control de accesos','Puertas abiertas siempre','Sin control de llaves','Sin zonas diferenciadas','A', false),
('ong','Gestión de donaciones vinculadas a menores:','Separar y blindar datos personales','Publicar listados','Compartir con patrocinadores','Guardar sin medidas','A', false);
