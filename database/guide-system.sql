-- ============================================================================
-- CUSTODIA360 - SISTEMA DE GUÍA DE USO
-- ============================================================================
-- Descripción: Sistema de ayuda contextual para paneles de Entidad, Delegado y Suplente
-- Fecha: 25 de Octubre 2025
-- Autor: Custodia360 Team
-- ============================================================================

-- Habilitar extensión UUID si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLA: guides
-- ============================================================================
-- Almacena las guías principales por rol
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.guides (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  role text NOT NULL CHECK (role IN ('ENTIDAD', 'DELEGADO', 'SUPLENTE')),
  title text NOT NULL,
  version text NOT NULL DEFAULT 'v1.0',
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(role)
);

-- ============================================================================
-- TABLA: guide_sections
-- ============================================================================
-- Almacena las secciones de contenido de cada guía
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.guide_sections (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  guide_id uuid NOT NULL REFERENCES public.guides(id) ON DELETE CASCADE,
  order_index int NOT NULL,
  section_key text NOT NULL,
  section_title text NOT NULL,
  content_md text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(guide_id, order_index),
  UNIQUE(guide_id, section_key)
);

-- ============================================================================
-- TABLA: guide_anchors
-- ============================================================================
-- Mapea contextos UI a secciones específicas para ayuda contextual
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.guide_anchors (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id uuid NOT NULL REFERENCES public.guide_sections(id) ON DELETE CASCADE,
  ui_context text NOT NULL,
  anchor text NOT NULL,
  UNIQUE(section_id, ui_context)
);

-- ============================================================================
-- ÍNDICES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_guide_sections_guide_id ON public.guide_sections(guide_id);
CREATE INDEX IF NOT EXISTS idx_guide_sections_order ON public.guide_sections(guide_id, order_index);
CREATE INDEX IF NOT EXISTS idx_guide_anchors_section ON public.guide_anchors(section_id);
CREATE INDEX IF NOT EXISTS idx_guide_anchors_context ON public.guide_anchors(ui_context);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_anchors ENABLE ROW LEVEL SECURITY;

-- Políticas: Lectura pública, escritura solo service_role
DROP POLICY IF EXISTS "Lectura pública guides" ON public.guides;
CREATE POLICY "Lectura pública guides" ON public.guides
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Lectura pública guide_sections" ON public.guide_sections;
CREATE POLICY "Lectura pública guide_sections" ON public.guide_sections
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Lectura pública guide_anchors" ON public.guide_anchors;
CREATE POLICY "Lectura pública guide_anchors" ON public.guide_anchors
  FOR SELECT USING (true);

-- ============================================================================
-- SEED DATA - GUÍAS Y SECCIONES
-- ============================================================================

-- Limpiar datos existentes
DELETE FROM public.guide_anchors;
DELETE FROM public.guide_sections;
DELETE FROM public.guides;

-- ============================================================================
-- GUÍA: ENTIDAD
-- ============================================================================

INSERT INTO public.guides (role, title, version) VALUES
('ENTIDAD', 'Guía de uso C360 — Entidad', 'v1.0');

-- Obtener ID de la guía ENTIDAD
DO $$
DECLARE
  v_guide_id_entidad uuid;
  v_section_id uuid;
BEGIN
  SELECT id INTO v_guide_id_entidad FROM public.guides WHERE role = 'ENTIDAD';

  -- Sección 1: Responsabilidades principales
  INSERT INTO public.guide_sections (guide_id, order_index, section_key, section_title, content_md)
  VALUES (v_guide_id_entidad, 1, 'responsabilidades', '1. Tus responsabilidades principales',
  '### Responsabilidades como Representante Legal

- **Garantizar cumplimiento LOPIVI** y designar Delegado de Protección certificado
- **Mantener activo** el canal seguro de comunicación y los registros de protección
- **Asegurar formación anual** del personal (objetivo: ≥ 90% del personal formado)
- **Aprobar y revisar** el Plan de Protección Infantil y protocolos de actuación
- **Supervisar** el estado de cumplimiento y responder a las alertas del sistema
- **Coordinar** con el Delegado de Protección en caso de incidencias graves

**Recuerda:** El incumplimiento de la LOPIVI puede conllevar sanciones de hasta 20.000 € para tu entidad.')
  RETURNING id INTO v_section_id;

  INSERT INTO public.guide_anchors (section_id, ui_context, anchor) VALUES
  (v_section_id, 'dashboard.view', 'responsabilidades');

  -- Sección 2: Cómo usar el panel de Entidad
  INSERT INTO public.guide_sections (guide_id, order_index, section_key, section_title, content_md)
  VALUES (v_guide_id_entidad, 2, 'panel', '2. Cómo usar el panel de Entidad',
  '### Navegación por el Panel

**Dashboard Principal**
- Visión general del estado de cumplimiento LOPIVI
- Alertas críticas y recomendaciones
- Indicadores de certificaciones y formaciones pendientes

**Documentos y Protocolos**
- Descarga de políticas de protección infantil
- Acceso al Plan de Protección aprobado
- Registro de actuaciones y casos (solo lectura)

**Módulos de Contratación**
- Activación de servicios adicionales
- Contratación del Delegado Suplente (módulo opcional +20€)
- Kit de Comunicación LOPIVI (opcional)

**Auditoría y Cumplimiento**
- Informes de cumplimiento normativo
- Planes de mejora recomendados
- Estado de certificaciones del personal

**Configuración**
- Gestión de usuarios y accesos
- Datos de contacto de la entidad
- Preferencias de notificaciones')
  RETURNING id INTO v_section_id;

  INSERT INTO public.guide_anchors (section_id, ui_context, anchor) VALUES
  (v_section_id, 'documentos.view', 'panel');

  -- Sección 3: Cómo actuar ante una sospecha
  INSERT INTO public.guide_sections (guide_id, order_index, section_key, section_title, content_md)
  VALUES (v_guide_id_entidad, 3, 'actuaciones', '3. Cómo actuar ante una sospecha',
  '### Protocolo de Actuación Urgente

Si sospechas de una situación de riesgo para un menor:

**1. NO interrogues al menor**
- Escucha sin presionar
- No hagas preguntas directas sobre el presunto maltrato
- Mantén la calma y transmite seguridad

**2. Registra hechos objetivos**
- Fecha, hora y lugar de la observación
- Descripción objetiva de lo observado (sin interpretaciones)
- Personas involucradas o testigos

**3. Comunica por el canal seguro**
- Utiliza el canal de comunicación oficial de Custodia360
- Notifica al Delegado de Protección inmediatamente
- Mantén la confidencialidad absoluta

**4. Si hay riesgo inmediato**
- Llama al **112** (emergencias)
- Contacta con **091** (Policía Nacional) o **062** (Guardia Civil)
- Notifica posteriormente al Delegado de Protección

**5. Informa al Delegado de Protección**
- Proporciona todos los detalles documentados
- Sigue las indicaciones del Delegado
- Colabora en el seguimiento del caso

**IMPORTANTE:** La confidencialidad es clave. No comentes el caso con personas no autorizadas.')
  RETURNING id INTO v_section_id;

  INSERT INTO public.guide_anchors (section_id, ui_context, anchor) VALUES
  (v_section_id, 'protocolos.view', 'actuaciones');

  -- Sección 4: Teléfonos y contactos de emergencia
  INSERT INTO public.guide_sections (guide_id, order_index, section_key, section_title, content_md)
  VALUES (v_guide_id_entidad, 4, 'emergencias', '4. Teléfonos y contactos de emergencia',
  '### Contactos de Emergencia

**Emergencias Generales**
- **112** - Emergencias (bomberos, ambulancia, policía)
- **091** - Policía Nacional
- **062** - Guardia Civil

**Protección de Menores**
- **900 20 20 10** - Fundación ANAR (Ayuda a Niños y Adolescentes en Riesgo)
- **116 111** - Teléfono Europeo del Niño (atención 24/7)

**Servicios Sociales**
- Contacta con los Servicios Sociales de tu municipio o comunidad autónoma
- Horario de atención generalmente de lunes a viernes, 9:00 - 14:00

**Soporte Custodia360**
- **Email:** soporte@custodia360.es
- **Horario:** Lunes a viernes, 9:00 - 18:00
- **Respuesta:** Dentro de 24 horas laborables

**Recuerda:** En caso de riesgo inmediato para un menor, llama SIEMPRE al 112 primero.')
  RETURNING id INTO v_section_id;

  INSERT INTO public.guide_anchors (section_id, ui_context, anchor) VALUES
  (v_section_id, 'canal_seguro.view', 'emergencias');

  -- Sección 5: Soporte y formación
  INSERT INTO public.guide_sections (guide_id, order_index, section_key, section_title, content_md)
  VALUES (v_guide_id_entidad, 5, 'dudas', '5. Soporte y formación',
  '### Recursos de Apoyo

**Formación LOPIVI**
- Acceso al temario base de protección infantil
- Plan anual de formación obligatoria para el personal
- Certificaciones oficiales al completar formaciones

**Sesión de Onboarding**
- Si es tu primera vez en Custodia360, solicita una sesión de bienvenida
- Nuestro equipo te guiará paso a paso en la configuración inicial
- Duración: 30 minutos aprox.

**Centro de Ayuda**
- Documentación completa disponible en tu panel
- Vídeos tutoriales y guías paso a paso
- FAQs sobre LOPIVI y uso del sistema

**Contacto con Soporte**
- Email: soporte@custodia360.es
- Respuesta en menos de 24 horas laborables
- Consultas técnicas, normativas o de uso del sistema

**Actualizaciones y Mejoras**
- Recibirás notificaciones de nuevas funcionalidades
- Cambios normativos LOPIVI se reflejan automáticamente
- Sin coste adicional por actualizaciones')
  RETURNING id INTO v_section_id;

END $$;

-- ============================================================================
-- GUÍA: DELEGADO
-- ============================================================================

INSERT INTO public.guides (role, title, version) VALUES
('DELEGADO', 'Guía de uso C360 — Delegado principal', 'v1.0');

DO $$
DECLARE
  v_guide_id_delegado uuid;
  v_section_id uuid;
BEGIN
  SELECT id INTO v_guide_id_delegado FROM public.guides WHERE role = 'DELEGADO';

  -- Sección 1: Tus responsabilidades
  INSERT INTO public.guide_sections (guide_id, order_index, section_key, section_title, content_md)
  VALUES (v_guide_id_delegado, 1, 'responsabilidades', '1. Tus responsabilidades',
  '### Responsabilidades como Delegado de Protección

- **Implementar y supervisar** las medidas de protección infantil en la entidad
- **Gestionar el canal seguro** de comunicación y resolver incidencias reportadas
- **Coordinar** con la Dirección y, cuando proceda, con las autoridades competentes
- **Mantener actualizados** los planes, protocolos y registros de protección
- **Formar y sensibilizar** al personal en materia de protección infantil
- **Evaluar riesgos** y proponer medidas correctivas de forma proactiva

**Perfil requerido:**
- Certificación oficial como Delegado de Protección LOPIVI
- Disponibilidad para atender casos urgentes (24/7)
- Confidencialidad y responsabilidad en el manejo de información sensible

**Recuerda:** Tu rol es clave para garantizar la seguridad de todos los menores en tu entidad.')
  RETURNING id INTO v_section_id;

  INSERT INTO public.guide_anchors (section_id, ui_context, anchor) VALUES
  (v_section_id, 'dashboard.view', 'responsabilidades');

  -- Sección 2: Uso del panel del Delegado
  INSERT INTO public.guide_sections (guide_id, order_index, section_key, section_title, content_md)
  VALUES (v_guide_id_delegado, 2, 'panel', '2. Uso del panel del Delegado',
  '### Funcionalidades del Panel

**Canal Seguro de Comunicación**
- Lee, clasifica y responde comunicaciones
- Escala casos urgentes a autoridades
- Mantén la trazabilidad de todas las interacciones

**Gestión de Incidentes**
- Crea, actualiza y cierra registros de incidencias
- Clasifica por nivel de riesgo (bajo/medio/alto)
- Adjunta evidencias y documentación
- Haz seguimiento de casos abiertos

**Protocolos y Documentos**
- Consulta protocolos oficiales de actuación
- Descarga plantillas y formularios
- Accede a la biblioteca LOPIVI completa

**Formación del Personal**
- Revisa el estado de formación de cada miembro
- Marca asistencias a cursos y talleres
- Genera certificados de formación completada

**Mapa de Riesgos**
- Evalúa riesgos específicos de tu entidad
- Identifica áreas de mejora
- Propone medidas preventivas')
  RETURNING id INTO v_section_id;

  INSERT INTO public.guide_anchors (section_id, ui_context, anchor) VALUES
  (v_section_id, 'incidentes.list', 'panel');

  -- Sección 3: Qué hacer ante una incidencia
  INSERT INTO public.guide_sections (guide_id, order_index, section_key, section_title, content_md)
  VALUES (v_guide_id_delegado, 3, 'incidencias', '3. Qué hacer ante una incidencia',
  '### Protocolo de Gestión de Incidencias

**PASO 1: Evaluación del Riesgo**

Clasifica la incidencia según nivel de riesgo:
- **🔴 ALTO / INMINENTE:** Riesgo inmediato para la integridad del menor
- **🟡 MEDIO:** Situación preocupante que requiere seguimiento cercano
- **🟢 BAJO:** Incidencia menor, mejora de protocolos

**PASO 2: Acción Inmediata (si riesgo alto)**

Si hay riesgo inminente:
1. Llama al **112** (emergencias generales)
2. Contacta con **091** (Policía Nacional) o **062** (Guardia Civil)
3. Separa al menor de la situación de riesgo
4. Notifica inmediatamente a la Dirección de la entidad

**PASO 3: Registro en el Sistema**

- Accede a "Gestión de Incidentes" en tu panel
- Crea un nuevo registro con datos objetivos:
  - Fecha, hora y lugar del incidente
  - Personas involucradas
  - Descripción factual (sin juicios de valor)
  - Testigos presentes
- Adjunta evidencias (fotos, documentos, grabaciones)
- Clasifica el nivel de riesgo

**PASO 4: Activación de Protocolos**

- Consulta el protocolo específico aplicable
- Notifica a las partes involucradas (familias, autoridades)
- Coordina con servicios externos si es necesario
- Documenta todas las acciones tomadas

**PASO 5: Seguimiento y Cierre**

- Mantén el caso abierto hasta resolución
- Actualiza el registro con cada actuación
- Cierra el caso cuando se confirme la resolución
- Genera informe final de actuaciones

**IMPORTANTE:** Nunca investigues por tu cuenta. Coordina siempre con autoridades competentes.')
  RETURNING id INTO v_section_id;

  INSERT INTO public.guide_anchors (section_id, ui_context, anchor) VALUES
  (v_section_id, 'incidentes.create', 'incidencias');

  -- Sección 4: Buenas prácticas de registro
  INSERT INTO public.guide_sections (guide_id, order_index, section_key, section_title, content_md)
  VALUES (v_guide_id_delegado, 4, 'datos', '4. Buenas prácticas de registro',
  '### Gestión Responsable de la Información

**Minimización de Datos Personales**
- Registra solo información estrictamente necesaria
- Evita datos sensibles innecesarios (origen étnico, religión, etc.)
- Usa identificadores en lugar de nombres cuando sea posible

**Uso de Canales Oficiales**
- NUNCA uses WhatsApp, email personal o SMS para casos sensibles
- Utiliza exclusivamente el canal seguro de Custodia360
- No compartas información fuera del sistema oficial

**Conservación de Evidencias**
- Guarda todas las evidencias de forma segura
- No borres registros, incluso si el caso se resuelve
- Cumple con los plazos legales de conservación (mínimo 5 años)

**Lenguaje Claro y Objetivo**
- Describe hechos observables, no interpretaciones
- Evita juicios de valor o suposiciones
- Usa un lenguaje profesional y respetuoso
- Diferencia claramente entre hechos probados y sospechas

**Confidencialidad Absoluta**
- Solo personal autorizado debe acceder a los registros
- No comentes casos fuera del ámbito profesional
- Protege la identidad de los menores involucrados
- Cumple con el RGPD en todo momento

**Ejemplos de registro correcto:**
- ✅ "El menor presenta moratón de 3 cm en antebrazo izquierdo. Fecha observada: 20/10/2025."
- ❌ "El menor probablemente fue golpeado por su padre."')
  RETURNING id INTO v_section_id;

  -- Sección 5: Teléfonos de emergencia y referencias
  INSERT INTO public.guide_sections (guide_id, order_index, section_key, section_title, content_md)
  VALUES (v_guide_id_delegado, 5, 'emergencias', '5. Teléfonos de emergencia y referencias',
  '### Contactos de Emergencia

**Emergencias Generales**
- **112** - Emergencias (bomberos, ambulancia, policía)
- **091** - Policía Nacional
- **062** - Guardia Civil

**Protección de Menores**
- **900 20 20 10** - Fundación ANAR (Ayuda a Niños y Adolescentes en Riesgo)
- **116 111** - Teléfono Europeo del Niño (atención 24/7)
- **017** - Teléfono contra el acoso escolar

**Servicios Sociales Autonómicos**
- Localiza el directorio de Servicios Sociales de tu comunidad autónoma
- Contacta con el equipo especializado en protección de menores
- Horario de atención generalmente de lunes a viernes, 9:00 - 14:00

**Fiscalía de Menores**
- Consulta la Fiscalía de Menores de tu provincia
- Para casos que requieran intervención judicial

**Soporte Custodia360**
- **Email:** soporte@custodia360.es
- **Horario:** Lunes a viernes, 9:00 - 18:00
- **Respuesta:** Dentro de 24 horas laborables

**Documentación de Referencia**
- [Ley Orgánica 8/2021 LOPIVI](https://www.boe.es)
- [Protocolo marco de protección](https://www.mscbs.gob.es)
- [Guía de indicadores de maltrato](https://www.mscbs.gob.es)')
  RETURNING id INTO v_section_id;

  INSERT INTO public.guide_anchors (section_id, ui_context, anchor) VALUES
  (v_section_id, 'canal_seguro.view', 'emergencias');

END $$;

-- ============================================================================
-- GUÍA: SUPLENTE
-- ============================================================================

INSERT INTO public.guides (role, title, version) VALUES
('SUPLENTE', 'Guía de uso C360 — Delegado suplente', 'v1.0');

DO $$
DECLARE
  v_guide_id_suplente uuid;
  v_section_id uuid;
BEGIN
  SELECT id INTO v_guide_id_suplente FROM public.guides WHERE role = 'SUPLENTE';

  -- Sección 1: Alcance y activación de la suplencia
  INSERT INTO public.guide_sections (guide_id, order_index, section_key, section_title, content_md)
  VALUES (v_guide_id_suplente, 1, 'alcance', '1. Alcance y activación de la suplencia',
  '### Tu Rol como Delegado Suplente

**¿Cuándo actúas como suplente?**
- Solo cuando el Delegado Principal esté ausente o incapacitado
- Requiere autorización expresa de la Dirección de la entidad
- El pago del módulo de suplencia debe estar confirmado (+20€)

**Permisos del Suplente**
Tu panel tiene las mismas funcionalidades visuales que el Delegado Principal, pero con **permisos limitados** por backend:

✅ **Tienes acceso a:**
- Canal seguro (lectura, clasificación, respuesta, escalado)
- Gestión de incidentes (crear, actualizar, cerrar)
- Protocolos y documentos (lectura + subir versiones de trabajo)
- Formación del personal (lectura + marcar asistencias)

❌ **NO tienes acceso a:**
- Modificar configuración del sistema
- Gestionar usuarios y roles
- Aprobar o eliminar protocolos oficiales
- Auditorías completas (solo lectura)
- Plan de Protección Infantil (solo lectura)

**Trazabilidad**
- Todas tus acciones quedan registradas como *modo suplencia*
- La Dirección y el Delegado Principal pueden auditar tu actividad
- Recibes notificaciones de casos críticos

**IMPORTANTE:** Tu suplencia es temporal y solo válida mientras el Delegado Principal esté ausente.')
  RETURNING id INTO v_section_id;

  INSERT INTO public.guide_anchors (section_id, ui_context, anchor) VALUES
  (v_section_id, 'dashboard.view', 'alcance');

  -- Sección 2: Uso del panel del Suplente
  INSERT INTO public.guide_sections (guide_id, order_index, section_key, section_title, content_md)
  VALUES (v_guide_id_suplente, 2, 'panel', '2. Uso del panel del Suplente',
  '### Funcionalidades del Panel

**Canal Seguro de Comunicación** ✅
- Lee y clasifica comunicaciones entrantes
- Responde a consultas y preocupaciones
- Escala casos urgentes según protocolos
- Mantén la trazabilidad de interacciones

**Gestión de Incidentes** ✅
- Crea nuevos registros de incidencias
- Actualiza casos abiertos con nueva información
- Cierra casos resueltos con informe final
- Adjunta evidencias y documentación

**Protocolos y Documentos** ⚠️ (lectura + versiones de trabajo)
- Consulta protocolos oficiales (solo lectura)
- Descarga plantillas y formularios
- Sube **versiones de trabajo** de protocolos (no sustituyen la oficial)
- Accede a la biblioteca LOPIVI

**Formación del Personal** ⚠️ (lectura + marcar asistencias)
- Revisa el estado de formación de cada miembro
- Marca asistencias a cursos y talleres (con aprobación posterior)
- Consulta certificados de formación

**Auditorías y Plan de Protección** 🔒 (solo lectura)
- Consulta informes de auditoría
- Accede al Plan de Protección (sin editar)

**Configuración del Sistema** 🔒 (bloqueado)
- No puedes modificar usuarios, roles ni configuraciones
- Solo el Delegado Principal y la Dirección tienen acceso

**Leyenda:**
- ✅ Acceso completo
- ⚠️ Acceso limitado
- 🔒 Solo lectura o bloqueado')
  RETURNING id INTO v_section_id;

  INSERT INTO public.guide_anchors (section_id, ui_context, anchor) VALUES
  (v_section_id, 'incidentes.list', 'panel');

  -- Sección 3: Actuación ante casos
  INSERT INTO public.guide_sections (guide_id, order_index, section_key, section_title, content_md)
  VALUES (v_guide_id_suplente, 3, 'casos', '3. Actuación ante casos',
  '### Protocolo de Gestión como Suplente

**PASO 1: Seguir Protocolos Oficiales**
- Consulta siempre el protocolo oficial de la entidad
- No improvises actuaciones por tu cuenta
- En caso de duda, consulta con la Dirección

**PASO 2: Clasificación del Riesgo**
- **🔴 ALTO:** Riesgo inminente → Llamar al 112 inmediatamente
- **🟡 MEDIO:** Situación preocupante → Registrar y notificar a Dirección
- **🟢 BAJO:** Incidencia menor → Registrar y hacer seguimiento

**PASO 3: Actuación en Emergencias**
Si hay riesgo inmediato:
1. Llama al **112** (emergencias)
2. Contacta con **091** (Policía Nacional) o **062** (Guardia Civil)
3. Separa al menor de la situación de riesgo
4. Notifica inmediatamente a la Dirección

**PASO 4: Registro en Incidentes**
- Accede a "Gestión de Incidentes"
- Crea un nuevo registro con datos objetivos:
  - Fecha, hora y lugar
  - Personas involucradas
  - Descripción factual
  - Testigos
- Adjunta evidencias disponibles
- Clasifica el nivel de riesgo

**PASO 5: Comunicación con Dirección**
- Informa a la Dirección de todos los casos abiertos
- Proporciona actualizaciones periódicas
- Solicita apoyo si es necesario

**PASO 6: Documentación y Trazabilidad**
- Registra todas las acciones tomadas
- Mantén actualizados los casos abiertos
- Genera informes de seguimiento

**IMPORTANTE:** Como suplente, tu prioridad es garantizar la protección inmediata del menor y notificar a las instancias correspondientes. No investigues por tu cuenta.')
  RETURNING id INTO v_section_id;

  INSERT INTO public.guide_anchors (section_id, ui_context, anchor) VALUES
  (v_section_id, 'incidentes.create', 'casos');

  -- Sección 4: Cierre de suplencia
  INSERT INTO public.guide_sections (guide_id, order_index, section_key, section_title, content_md)
  VALUES (v_guide_id_suplente, 4, 'cierre', '4. Cierre de suplencia',
  '### Proceso de Finalización de la Suplencia

**Cuando el Delegado Principal retorna:**

**PASO 1: Informe de Suplencia**
El sistema genera automáticamente un **Informe de Suplencia** que incluye:
- Período de suplencia (fecha inicio - fecha fin)
- Total de incidencias gestionadas
- Actuaciones realizadas
- Casos abiertos pendientes de seguimiento
- Comunicaciones realizadas

**PASO 2: Notificaciones Automáticas**
- La Dirección recibe el informe completo
- El Delegado Principal es notificado de su retorno
- Se desactiva tu acceso de suplente automáticamente

**PASO 3: Transición de Casos**
- Los casos abiertos durante tu suplencia pasan al Delegado Principal
- Proporciona un resumen verbal/escrito de casos críticos
- Asegúrate de que no quedan acciones pendientes sin documentar

**PASO 4: Cierre de Sesión**
- Tu acceso al panel se convierte en "solo lectura" histórico
- Puedes consultar tus actuaciones pasadas
- No puedes realizar nuevas acciones hasta próxima suplencia

**Reactivación de Suplencia**
- Si en el futuro el Delegado Principal vuelve a estar ausente
- La Dirección puede reactivar tu acceso de suplente
- El proceso de autorización es el mismo

**IMPORTANTE:** Toda la documentación y trazabilidad de tu suplencia queda permanentemente archivada para auditorías futuras.')
  RETURNING id INTO v_section_id;

  -- Sección 5: Teléfonos y contactos
  INSERT INTO public.guide_sections (guide_id, order_index, section_key, section_title, content_md)
  VALUES (v_guide_id_suplente, 5, 'emergencias', '5. Teléfonos y contactos',
  '### Contactos de Emergencia

**Emergencias Generales**
- **112** - Emergencias (bomberos, ambulancia, policía)
- **091** - Policía Nacional
- **062** - Guardia Civil

**Protección de Menores**
- **900 20 20 10** - Fundación ANAR (Ayuda a Niños y Adolescentes en Riesgo)
- **116 111** - Teléfono Europeo del Niño (atención 24/7)
- **017** - Teléfono contra el acoso escolar

**Servicios Sociales**
- Contacta con los Servicios Sociales de tu municipio o comunidad autónoma
- Horario de atención generalmente de lunes a viernes, 9:00 - 14:00

**Soporte Custodia360**
- **Email:** soporte@custodia360.es
- **Horario:** Lunes a viernes, 9:00 - 18:00
- **Respuesta:** Dentro de 24 horas laborables

**Contacto con la Dirección de tu Entidad**
- Mantén comunicación constante durante tu suplencia
- Notifica cualquier caso crítico de inmediato
- Solicita apoyo si lo necesitas

**RECUERDA:** En caso de riesgo inmediato para un menor, llama SIEMPRE al 112 primero y luego notifica a tu Dirección.')
  RETURNING id INTO v_section_id;

  INSERT INTO public.guide_anchors (section_id, ui_context, anchor) VALUES
  (v_section_id, 'canal_seguro.view', 'emergencias');

END $$;

-- ============================================================================
-- VERIFICACIÓN FINAL
-- ============================================================================

-- Verificar que se crearon las 3 guías
SELECT role, title, version FROM public.guides ORDER BY role;

-- Verificar que cada guía tiene 5 secciones
SELECT g.role, COUNT(gs.id) as num_secciones
FROM public.guides g
LEFT JOIN public.guide_sections gs ON g.id = gs.guide_id
GROUP BY g.role
ORDER BY g.role;

-- Verificar anchors creados
SELECT COUNT(*) as total_anchors FROM public.guide_anchors;

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================
