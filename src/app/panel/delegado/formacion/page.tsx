'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface SessionData {
  id: string
  nombre: string
  email: string
  entityId: string
  entidad: string
  user_id: string
  rol?: string
}

const MODULOS_CONTENIDO = [
  {
    id: 1,
    titulo: "Fundamentos de la LOPIVI y Marco Legal",
    descripcion: "Introducción a la Ley Orgánica de Protección Integral a la Infancia y la Adolescencia frente a la Violencia",
    contenido: `
# MÓDULO 1: Fundamentos de la LOPIVI y Marco Legal

## Introducción

La Ley Orgánica 8/2021, de 4 de junio, de protección integral a la infancia y la adolescencia frente a la violencia (LOPIVI) representa un hito fundamental en la protección de los derechos de niños, niñas y adolescentes en España. Esta normativa establece un marco integral de medidas de sensibilización, prevención, detección precoz, protección y reparación de cualquier forma de violencia contra personas menores de edad.

### Contexto histórico

La LOPIVI surge como respuesta a una necesidad urgente identificada tanto a nivel nacional como internacional. Los datos sobre violencia infantil en España revelaban una realidad preocupante que requería una intervención legislativa contundente. Esta ley se enmarca en los compromisos internacionales adquiridos por España, especialmente con la Convención sobre los Derechos del Niño de Naciones Unidas.

## Objetivos principales de la LOPIVI

### 1. Garantía de derechos fundamentales

La ley reconoce y garantiza los derechos fundamentales de niños, niñas y adolescentes a:
- Crecer en un entorno libre de violencia
- Ser escuchados y participar activamente
- Recibir protección integral del Estado
- Acceder a mecanismos de denuncia accesibles
- Obtener reparación y apoyo especializado

### 2. Prevención y sensibilización

Establece la obligación de implementar:
- Programas educativos en todos los niveles
- Campañas de sensibilización social
- Formación especializada para profesionales
- Espacios seguros en todas las actividades con menores
- Protocolos de buen trato

### 3. Detección precoz

La ley promueve sistemas de:
- Identificación temprana de situaciones de riesgo
- Señales de alerta conocidas por todos los profesionales
- Canales de comunicación seguros y confidenciales
- Coordinación entre servicios sociales, sanitarios y educativos

### 4. Intervención y protección

Establece mecanismos de:
- Actuación inmediata ante situaciones de violencia
- Medidas cautelares de protección
- Atención integral a las víctimas
- Seguimiento de casos

### 5. Coordinación institucional

Obliga a la colaboración entre:
- Administraciones públicas de todos los niveles
- Entidades del tercer sector
- Servicios especializados
- Fuerzas y Cuerpos de Seguridad del Estado

## Marco legal español de protección infantil

### Constitución Española (1978)

El Artículo 39 establece:
- Los poderes públicos aseguran la protección integral de los hijos
- Los menores gozarán de la protección prevista en los acuerdos internacionales que velan por sus derechos

### Convención sobre los Derechos del Niño (ONU, 1989)

Ratificada por España en 1990, establece:
- El interés superior del menor como principio rector
- Derecho a la vida, supervivencia y desarrollo
- Derecho a la participación
- Protección contra toda forma de violencia

### Ley Orgánica 1/1996 de Protección Jurídica del Menor

Modificada en 2015, introduce:
- El concepto de interés superior del menor
- Derecho del menor a ser oído
- Medidas de protección del menor
- Responsabilidad parental

### Ley Orgánica 8/2021 (LOPIVI)

La más reciente y específica, que:
- Aborda todas las formas de violencia contra menores
- Crea la figura del Delegado/a de Protección
- Obliga a todos los entornos con menores
- Establece sanciones por incumplimiento

## Principios rectores de la LOPIVI

### Interés superior del menor

Todas las decisiones deben:
- Priorizar el bienestar del menor
- Considerar su desarrollo integral
- Respetar sus derechos fundamentales
- Evaluarse caso por caso

### Prevención

Se debe actuar:
- Antes de que ocurra la violencia
- Creando entornos protectores
- Formando a toda la comunidad
- Eliminando factores de riesgo

### Intervención temprana

Requiere:
- Detección precoz de señales
- Actuación inmediata
- Evitar cronificación de situaciones
- Minimizar daños

### Confidencialidad

Implica:
- Protección de datos del menor
- Información solo a personas autorizadas
- Respeto al derecho a la intimidad
- Seguridad en las comunicaciones

### Coordinación institucional

Exige:
- Trabajo en red entre servicios
- Protocolos compartidos
- Intercambio de información necesaria
- Objetivos comunes de protección

## Ámbito de aplicación

La LOPIVI se aplica obligatoriamente a todas las entidades, públicas o privadas, que desarrollen actividades con personas menores de edad:

### Centros educativos
- Escuelas infantiles
- Colegios de educación primaria
- Institutos de educación secundaria
- Centros de formación profesional
- Universidades (programas con menores)
- Academias y centros de enseñanza no reglada

### Instalaciones deportivas
- Clubes deportivos
- Gimnasios con secciones infantiles
- Escuelas deportivas
- Piscinas
- Instalaciones municipales
- Competiciones deportivas

### Centros de ocio y tiempo libre
- Centros de ocio educativo
- Ludotecas
- Campamentos de verano
- Actividades extraescolares
- Colonias urbanas

### Actividades culturales
- Escuelas de música
- Academias de danza
- Grupos de teatro
- Talleres artísticos
- Bibliotecas con programas infantiles

### Servicios sociales
- Centros de acogida
- Pisos tutelados
- Centros de día
- Servicios de intervención familiar
- Recursos de apoyo psicosocial

### Entidades religiosas
- Actividades pastorales
- Grupos de catequesis
- Campamentos religiosos
- Asociaciones juveniles

## El Delegado/a de Protección

### Definición

Persona responsable designada por la entidad para:
- Coordinar el plan de protección
- Ser el punto de referencia
- Actuar como canal de comunicación
- Velar por el cumplimiento normativo

### Funciones principales

1. **Coordinación**
   - Implementar el plan de protección
   - Supervisar su cumplimiento
   - Coordinar con otros profesionales
   - Mantener actualizado el sistema

2. **Comunicación**
   - Ser el canal con menores y familias
   - Recibir y gestionar consultas
   - Informar sobre protocolos
   - Enlace con autoridades

3. **Formación**
   - Promover la capacitación del personal
   - Diseñar programas formativos
   - Actualizar conocimientos
   - Sensibilizar a la comunidad

4. **Vigilancia**
   - Velar por el cumplimiento de protocolos
   - Detectar situaciones de riesgo
   - Supervisar actividades con menores
   - Revisar instalaciones

5. **Actuación**
   - Activar protocolos cuando sea necesario
   - Documentar incidentes
   - Colaborar en investigaciones
   - Seguimiento de casos

### Requisitos del Delegado/a

- Formación específica en protección infantil
- Certificado negativo de delitos sexuales
- Conocimiento profundo de la LOPIVI
- Capacidad de coordinación
- Habilidades de comunicación
- Disponibilidad para la función

## Obligaciones de las entidades

### 1. Designación del Delegado/a de Protección

- Nombrar una persona específica y cualificada
- Comunicar su identidad a toda la comunidad
- Facilitarle recursos y tiempo
- Respaldar su autoridad

### 2. Elaboración del Plan de Protección

Debe incluir:
- Análisis de riesgos específicos
- Protocolos de prevención
- Procedimientos de actuación
- Canales de comunicación
- Medidas de formación
- Sistema de seguimiento

### 3. Establecimiento de protocolos de actuación

Para:
- Situaciones de sospecha de maltrato
- Acoso entre iguales
- Uso de tecnología
- Actividades fuera del centro
- Comunicación con familias
- Colaboración con autoridades

### 4. Formación del personal

Todo el personal debe recibir formación en:
- Derechos de la infancia
- Detección de señales de alerta
- Protocolos de actuación
- Buen trato
- Uso responsable de tecnología
- Primeros auxilios psicológicos

### 5. Creación de canales de comunicación seguros

Características necesarias:
- Accesibles para menores
- Confidenciales
- Diversos (presencial, telefónico, digital)
- Con respuesta rápida
- Documentados

### 6. Certificado de delitos sexuales del personal

Obligatorio para:
- Todo el personal contratado
- Voluntarios
- Personal en prácticas
- Colaboradores habituales
- Debe renovarse cada 5 años
- Custodia documental segura

### 7. Código de conducta

Debe establecer:
- Normas de comportamiento
- Límites relacionales
- Uso de tecnología
- Gestión de la intimidad
- Sanciones por incumplimiento

### 8. Evaluación y mejora continua

Mediante:
- Revisiones anuales del plan
- Auditorías internas
- Encuestas de satisfacción
- Análisis de incidentes
- Actualización normativa
- Buenas prácticas

## Tipos de violencia contemplados

### Violencia física
Cualquier acto que cause daño físico o riesgo de causarlo

### Violencia psicológica
Conductas que dañen la autoestima o desarrollo emocional

### Violencia sexual
Cualquier acto de naturaleza sexual sin consentimiento

### Negligencia
Desatención de necesidades básicas físicas, emocionales o educativas

### Violencia digital
Acoso, sextorsión, grooming a través de medios digitales

## Conclusión

La LOPIVI supone un cambio de paradigma en la protección de la infancia en España. No se trata solo de una ley más, sino de un compromiso social integral que requiere la implicación de todos: administraciones, entidades, profesionales, familias y la sociedad en general.

El conocimiento profundo de esta ley y su aplicación efectiva es fundamental para ejercer correctamente las funciones de Delegado/a de Protección y garantizar entornos seguros donde todos los niños, niñas y adolescentes puedan desarrollarse plenamente sin violencia.

La responsabilidad es grande, pero el objetivo es superior: proteger a quienes más lo necesitan y construir una sociedad más justa y segura para la infancia.
    `
  },
  {
    id: 2,
    titulo: "Identificación y Prevención de Situaciones de Riesgo",
    descripcion: "Herramientas para detectar señales de alerta y prevenir situaciones de violencia",
    contenido: `
# MÓDULO 2: Identificación y Prevención de Situaciones de Riesgo

## Introducción

La detección precoz y la prevención son los pilares fundamentales de cualquier sistema eficaz de protección infantil. Este módulo te proporcionará las herramientas necesarias para identificar situaciones de riesgo y violencia, así como para implementar medidas preventivas efectivas en tu entidad.

## Tipos de violencia contra la infancia

### 1. Violencia física

**Definición:** Cualquier acción que cause daño físico real o potencial a un menor.

**Manifestaciones:**
- Agresiones corporales (golpes, empujones, zarandeos)
- Castigos físicos desproporcionados
- Privación de necesidades físicas básicas
- Exposición a situaciones peligrosas
- Uso excesivo de fuerza física
- Quemaduras o heridas intencionales
- Envenenamientos o intoxicaciones deliberadas

**Ejemplos en entornos con menores:**
- Profesor que empuja a un alumno
- Entrenador que golpea a un deportista
- Monitor que aplica castigos físicos
- Cuidador que zarandea a un niño pequeño

**Consecuencias:**
- Lesiones físicas inmediatas
- Dolor y sufrimiento
- Miedo y estrés postraumático
- Problemas de desarrollo físico
- Dificultades en relaciones futuras
- Normalización de la violencia

### 2. Violencia psicológica

**Definición:** Conductas que dañen la autoestima, dignidad o desarrollo emocional del menor.

**Manifestaciones:**
- Humillación pública o privada
- Insultos y descalificaciones
- Amenazas y chantajes emocionales
- Rechazo afectivo sistemático
- Exigencias desproporcionadas
- Culpabilización constante
- Aislamiento social
- Comparaciones destructivas
- Críticas continuas
- Manipulación emocional
- Exposición a violencia doméstica

**Ejemplos en entornos con menores:**
- Profesor que ridiculiza a un alumno públicamente
- Entrenador que humilla sistemáticamente
- Monitor que compara negativamente a los niños
- Cuidador que ignora emocionalmente a un menor

**Consecuencias a corto plazo:**
- Baja autoestima
- Ansiedad y depresión
- Problemas de conducta
- Dificultades académicas
- Aislamiento social

**Consecuencias a largo plazo:**
- Trastornos de personalidad
- Problemas de relación
- Depresión crónica
- Conductas autodestructivas
- Dificultad para confiar en otros

### 3. Violencia sexual

**Definición:** Cualquier acto de naturaleza sexual realizado con un menor sin su consentimiento o cuando no puede prestarlo por su edad o desarrollo.

**Formas de violencia sexual:**

**Contacto físico:**
- Tocamientos inapropiados
- Besos de naturaleza sexual
- Penetración de cualquier tipo
- Obligar a tocar al agresor
- Exposición de genitales

**Sin contacto físico:**
- Exposición a material pornográfico
- Obligar a presenciar actos sexuales
- Exhibicionismo
- Voyeurismo
- Comentarios sexuales inapropiados
- Proposiciones sexuales

**A través de tecnología:**
- Grooming online
- Solicitud de imágenes sexuales
- Sextorsión
- Exposición a contenido sexual
- Livestreaming de abusos

**Características específicas:**
- Siempre implica abuso de poder
- El consentimiento de un menor no es válido
- Puede no dejar marcas físicas
- Suele mantenerse en secreto
- Genera sentimientos de culpa en la víctima

**Consecuencias:**
- Trauma psicológico profundo
- Trastorno de estrés postraumático
- Problemas de identidad sexual
- Dificultades en relaciones afectivas
- Conductas sexualizadas inapropiadas
- Trastornos alimentarios
- Autolesiones
- Ideación suicida

### 4. Negligencia

**Definición:** Falta de atención persistente a las necesidades básicas físicas, emocionales, educativas o de supervisión de un menor.

**Tipos de negligencia:**

**Física:**
- Alimentación inadecuada
- Falta de higiene
- Ropa inapropiada
- Vivienda insalubre
- Falta de atención médica
- Exposición a riesgos físicos

**Emocional:**
- Falta de afecto y atención
- Ignorar necesidades emocionales
- No responder al llanto o malestar
- Ausencia de estimulación
- Falta de apoyo emocional

**Educativa:**
- Absentismo escolar permitido
- Falta de apoyo en estudios
- No atender necesidades educativas especiales
- Desinterés por el rendimiento escolar

**Médica:**
- No llevar a revisiones
- No cumplir tratamientos
- Ignorar síntomas de enfermedad
- No vacunar sin justificación

**De supervisión:**
- Dejar solo a menor sin capacidad
- Exposición a situaciones peligrosas
- Falta de control de actividades
- Desconocer dónde está el menor

**Señales de negligencia:**
- Aspecto descuidado persistente
- Hambre frecuente
- Enfermedades no atendidas
- Faltas escolares injustificadas
- Conductas de búsqueda de atención
- Desarrollo físico o emocional retrasado

### 5. Violencia digital

**Definición:** Violencia ejercida a través de medios tecnológicos y digitales.

**Formas:**

**Ciberacoso (Cyberbullying):**
- Mensajes amenazantes o humillantes
- Difusión de rumores online
- Exclusión deliberada de grupos
- Creación de perfiles falsos
- Publicación de información privada
- Manipulación de imágenes

**Grooming:**
- Adulto que contacta con menor
- Genera confianza progresivamente
- Obtiene información personal
- Solicita imágenes íntimas
- Puede llegar al encuentro físico

**Sextorsión:**
- Chantaje con imágenes íntimas
- Amenaza de difusión
- Solicitud de más material
- Petición de dinero o encuentros

**Exposición a contenido inapropiado:**
- Pornografía
- Violencia gráfica
- Contenido que incita al odio
- Mensajes de autodestrucción

**Características de la violencia digital:**
- Permanencia del contenido
- Difusión masiva y rápida
- Anonimato del agresor
- Accesibilidad 24/7
- Dificultad de control parental
- Menos detección por adultos

## Señales de alerta

### Indicadores físicos

**En casos de violencia física:**
- Moratones, quemaduras, fracturas inexplicables
- Lesiones en diferentes fases de curación
- Marcas con formas específicas (cinturón, mano)
- Lesiones en zonas no habituales de accidentes
- Explicaciones inconsistentes sobre lesiones
- Miedo al contacto físico
- Evitación de actividades que expongan el cuerpo
- Vestimenta inapropiada para cubrir lesiones

**En casos de violencia sexual:**
- Dificultad para sentarse o caminar
- Dolor al orinar
- Infecciones urinarias recurrentes
- Enfermedades de transmisión sexual
- Embarazo en adolescentes
- Ropa interior manchada o rota
- Conocimiento sexual inapropiado para la edad

**En casos de negligencia:**
- Ropa sucia, rota o inadecuada al clima
- Higiene personal deficiente persistente
- Hambre constante o desnutrición
- Cansancio extremo
- Necesidades médicas desatendidas
- Retrasos en desarrollo físico

### Indicadores emocionales y psicológicos

**Cambios emocionales bruscos:**
- De extrovertido a retraído
- De alegre a apático
- De confiado a miedoso
- De sociable a aislado

**Manifestaciones de miedo:**
- Miedo excesivo a ciertos adultos
- Sobresalto ante movimientos bruscos
- Pesadillas recurrentes
- Terror a volver a casa
- Ansiedad antes de actividades

**Problemas de autoestima:**
- Autoconcepto muy negativo
- Sentimientos de culpa
- Vergüenza excesiva
- Comentarios autodespectivos
- Sensación de no valer nada

**Alteraciones del estado de ánimo:**
- Tristeza persistente
- Irritabilidad excesiva
- Cambios de humor repentinos
- Apatía y desinterés
- Signos de depresión

**Regresiones:**
- Conductas infantiles (chuparse el dedo, enuresis)
- Pérdida de habilidades adquiridas
- Dependencia excesiva de adultos
- Necesidad constante de contacto

### Indicadores conductuales

**En el ámbito escolar/deportivo:**
- Cambio brusco en rendimiento
- Dificultades de concentración
- Absentismo frecuente
- Llegadas muy tempranas o salidas muy tardías
- Evitación de ir a casa
- Búsqueda constante de atención

**En las relaciones sociales:**
- Aislamiento progresivo
- Dificultad para hacer amigos
- Conductas agresivas hacia otros
- Sumisión extrema
- Desconfianza generalizada

**Conductas sexualizadas (en casos de abuso sexual):**
- Conocimiento sexual inapropiado para edad
- Conductas sexuales explícitas
- Masturbación compulsiva en público
- Intentos de sexualizar relaciones
- Interés excesivo en temas sexuales

**Conductas autodestructivas:**
- Autolesiones (cortes, quemaduras)
- Conductas de riesgo
- Consumo de sustancias
- Trastornos alimentarios
- Ideación o intentos suicidas

**Señales en conducta alimentaria:**
- Ingesta compulsiva
- Rechazo total de alimentos
- Acaparamiento de comida
- Robo de alimentos
- Trastornos evidentes (anorexia, bulimia)

**En el comportamiento general:**
- Hipervigilancia constante
- Mentiras frecuentes
- Robos
- Fugas del hogar
- Conductas violentas
- Crueldad con animales

## Factores de riesgo

### Factores individuales del menor

- Edad temprana (mayor vulnerabilidad)
- Discapacidad física o intelectual
- Problemas de salud mental
- Rasgos de personalidad (timidez extrema, impulsividad)
- Bajo rendimiento académico
- Dificultades de comunicación
- Historia previa de victimización

### Factores familiares

- Violencia doméstica
- Abuso de sustancias en los padres
- Problemas de salud mental parental
- Aislamiento social de la familia
- Estrés económico severo
- Familias monoparentales sin red de apoyo
- Padres muy jóvenes o inmaduros
- Historia de maltrato en los padres
- Prácticas de crianza autoritarias
- Expectativas no realistas sobre el menor

### Factores sociales y comunitarios

- Pobreza y exclusión social
- Falta de servicios sociales accesibles
- Comunidades con alta tolerancia a la violencia
- Aislamiento geográfico
- Desempleo elevado
- Falta de espacios de ocio seguros
- Normalización del castigo físico

### Factores en entornos organizados

- Falta de formación del personal
- Ausencia de protocolos
- Supervisión inadecuada
- Ratio desproporcionado adulto/menor
- Personal sin formación
- Falta de vías de denuncia
- Cultura organizacional que minimiza señales
- Presión por resultados sobre bienestar

## Estrategias de prevención

### 1. Educación y sensibilización

**Para los menores:**
- Educación en derechos de la infancia
- Programas de educación sexual apropiados por edad
- Habilidades de autoprotección
- Reconocimiento de situaciones de riesgo
- Saber decir "no" y pedir ayuda
- Alfabetización digital
- Gestión de emociones
- Habilidades sociales

**Para las familias:**
- Talleres de parentalidad positiva
- Información sobre desarrollo evolutivo
- Señales de alerta de violencia
- Uso seguro de tecnología
- Recursos disponibles de ayuda
- Comunicación efectiva con hijos

**Para el personal:**
- Formación continua en protección infantil
- Actualización normativa
- Casos prácticos y role-playing
- Supervisión profesional
- Autocuidado del equipo

### 2. Supervisión adecuada

**Principios básicos:**
- Nunca un adulto a solas con un menor (regla de visibilidad)
- Supervisión activa, no pasiva
- Presencia en todos los espacios
- Control de accesos
- Registro de entradas y salidas

**En espacios específicos:**

**Vestuarios y baños:**
- Supervisión externa (esperar fuera)
- Nunca entrar a solas
- Puertas con visibilidad
- Tiempos limitados
- Protocolo claro de acompañamiento

**Actividades individualizadas:**
- Siempre en espacios visibles
- Comunicar a familias previamente
- Documentar sesiones
- Puerta abierta o ventana visible

**Transporte:**
- Nunca un menor solo con un adulto
- Asientos asignados
- Registro de pasajeros
- Comunicación a familias

### 3. Creación de ambientes seguros

**Espacios físicos:**
- Diseño que permita visibilidad
- Iluminación adecuada
- Eliminación de zonas ocultas
- Accesos controlados
- Señalización clara
- Espacios adaptados por edades

**Clima emocional:**
- Cultura de respeto y buen trato
- Tolerancia cero a la violencia
- Comunicación abierta
- Participación de los menores
- Reconocimiento del esfuerzo
- Gestión positiva de conflictos

### 4. Canales de comunicación

**Características necesarias:**
- Múltiples vías (presencial, telefónica, online)
- Accesibles para menores
- Confidenciales y seguros
- Con respuesta rápida
- Conocidos por toda la comunidad

**Buzones de sugerencias:**
- Físicos y virtuales
- Anónimos si se desea
- Revisión regular
- Respuesta visible a propuestas

**Tutorías y espacios de escucha:**
- Regularidad establecida
- Ambiente de confianza
- Escucha activa sin juicios
- Seguimiento personalizado

### 5. Protocolos claros

**Protocolo de selección de personal:**
- Verificación de antecedentes
- Certificado de delitos sexuales
- Referencias comprobadas
- Entrevistas específicas
- Periodo de prueba supervisado

**Protocolo de bienvenida:**
- Inducción completa
- Formación en protocolos
- Entrega de código de conducta
- Firma de compromiso
- Acompañamiento inicial

**Protocolo de actividades:**
- Planificación documentada
- Autorización de familias
- Ratio adecuado
- Supervisión múltiple
- Evaluación posterior

**Protocolo uso de tecnología:**
- Normas claras sobre fotos/vídeos
- Consentimiento informado
- Uso de redes sociales
- Comunicaciones con menores
- Protección de datos

### 6. Formación continua

**Contenidos esenciales:**
- Actualización normativa
- Nuevas formas de violencia
- Herramientas de detección
- Protocolos actualizados
- Casos reales y aprendizaje
- Autocuidado profesional

**Metodologías:**
- Talleres prácticos
- Simulacros
- Análisis de casos
- Supervisión entre pares
- Formación online
- Jornadas anuales

### 7. Participación de los menores

**Mecanismos:**
- Asambleas o consejos de menores
- Encuestas de satisfacción
- Grupos focales
- Representantes elegidos
- Buzones de sugerencias

**Beneficios:**
- Empoderamiento
- Detección desde su perspectiva
- Mayor adherencia a normas
- Desarrollo de habilidades
- Clima más positivo

### 8. Coordinación con familias

**Información transparente:**
- Políticas de protección
- Protocolos existentes
- Derechos y deberes
- Vías de comunicación
- Recursos disponibles

**Colaboración activa:**
- Reuniones periódicas
- Participación en actividades
- Feedback bidireccional
- Formación conjunta
- Redes de apoyo mutuo

## Protocolo de observación

### Fase 1: Observación atenta

- Mantener observación sin prejuicios
- No hacer interpretaciones precipitadas
- Documentar hechos objetivos
- Contrastar con otros profesionales
- Evitar comentarios con terceros

### Fase 2: Registro documentado

**Qué registrar:**
- Fecha, hora y lugar
- Descripción objetiva de lo observado
- Palabras textuales del menor (si las hay)
- Contexto de la situación
- Quién más estaba presente
- No incluir interpretaciones personales

**Cómo registrar:**
- Por escrito inmediatamente
- De forma confidencial
- En formato seguro
- Con custodia adecuada
- Disponible para autoridades

### Fase 3: Comunicación al Delegado/a

- Informar lo antes posible
- De forma confidencial
- Con la documentación completa
- Sin alarmar innecesariamente
- Disponibilidad para ampliar información

### Fase 4: NO hacer

- No interrogar al menor
- No confrontar a presuntos agresores
- No prometer guardar secretos
- No investigar por cuenta propia
- No compartir con personas no autorizadas
- No minimizar la situación
- No culpabilizar al menor

## Prevención específica según sector

### Entornos deportivos

**Riesgos específicos:**
- Contacto físico normalizado
- Vestuarios y duchas
- Concentraciones y viajes
- Relación de autoridad intensa
- Presión por resultados
- Entrenamientos individualizados

**Medidas preventivas:**
- Entrenamientos siempre con visibilidad
- Vestuarios con supervisión externa
- Viajes con adultos suficientes
- Prohibición de masajes sin presencia
- Código de conducta específico
- Formación en límites del contacto

### Entornos educativos

**Riesgos específicos:**
- Espacios con poca supervisión (pasillos, baños)
- Tutorías individuales
- Acoso entre iguales
- Uso de tecnología
- Excursiones

**Medidas preventivas:**
- Supervisión activa en recreos
- Tutorías con puerta abierta/cristal
- Programas anti-bullying
- Educación digital
- Protocolos claros para salidas

### Ocio y tiempo libre

**Riesgos específicos:**
- Campamentos y colonias
- Actividades nocturnas
- Menor ratio adulto/menor
- Entorno más informal
- Personal voluntario

**Medidas preventivas:**
- Formación intensiva de monitores
- Supervisión múltiple continua
- Prohibición de dormitorios compartidos adulto-menor
- Actividades grupales supervisadas
- Comunicación frecuente con familias

## Conclusión

La identificación y prevención de situaciones de riesgo no es responsabilidad de una sola persona, sino de toda la comunidad educativa, deportiva o social que rodea al menor. Cada profesional, desde su posición, debe estar capacitado para:

1. Detectar señales de alerta
2. Actuar según protocolo
3. Implementar medidas preventivas
4. Crear un entorno protector
5. Trabajar coordinadamente

La prevención es siempre más eficaz que la intervención tardía. Invertir en crear entornos seguros, formar adecuadamente al personal y establecer protocolos claros es la mejor garantía de protección para todos los menores.

Recuerda: ante la duda, siempre es mejor actuar. La protección de un menor justifica cualquier "falsa alarma". Lo que nunca podremos justificar es no haber actuado cuando teníamos información.
    `
  },
  {
    id: 3,
    titulo: "Protocolos de Actuación y Comunicación",
    descripcion: "Procedimientos claros para gestionar situaciones de riesgo y comunicar adecuadamente",
    contenido: `
# MÓDULO 3: Protocolos de Actuación y Comunicación

## Introducción
Los protocolos de actuación son herramientas fundamentales que permiten una respuesta estructurada, coordinada y eficaz ante situaciones de riesgo o violencia contra menores. Este módulo proporciona las directrices específicas para actuar con seguridad y profesionalismo, garantizando la protección del menor en todo momento.

## Protocolo General de Actuación

### Fase 1: Detección y Observación
**Objetivos:**
- Identificar señales de alerta de forma temprana
- Documentar hechos de manera objetiva
- Mantener la calma y profesionalismo

**Acciones específicas:**
- Observar cambios significativos en el comportamiento del menor
- Registrar fecha, hora, lugar y circunstancias exactas
- Anotar testimonios textuales sin interpretaciones personales
- **NUNCA** confrontar directamente al presunto agresor
- **NUNCA** interrogar al menor de forma invasiva
- Mantener discreción absoluta durante la observación

**Señales de alerta a documentar:**
- Físicas: lesiones inexplicadas, cambios en higiene personal
- Conductuales: retraimiento, agresividad, miedo a ciertas personas o situaciones
- Emocionales: ansiedad, depresión, cambios bruscos de humor
- Sociales: aislamiento, evitación de actividades que antes disfrutaba

### Fase 2: Comunicación Interna Inmediata
**Plazo:** Máximo 24 horas desde la detección

**Acciones obligatorias:**
1. Informar **inmediatamente** al Delegado/a de Protección
2. Si el Delegado/a no está disponible, contactar al Delegado/a Suplente
3. Utilizar medios de comunicación seguros y privados
4. Mantener **confidencialidad absoluta**
5. Documentar la comunicación por escrito

**Documentación requerida:**
- Informe escrito con los hechos observados
- Fecha y hora exactas
- Personas presentes
- Contexto de la situación
- Cualquier declaración del menor (textual)
- Sin incluir opiniones personales ni juicios de valor

**Canal de comunicación:**
- Email cifrado al Delegado/a
- Reunión presencial en lugar privado
- Llamada telefónica seguida de email de confirmación
- **NUNCA** por WhatsApp, redes sociales o medios no seguros

### Fase 3: Evaluación y Análisis del Caso
**Responsable:** Delegado/a de Protección

**Proceso de evaluación:**
1. Revisar toda la documentación recibida
2. Entrevistar a la persona que detectó la situación
3. Consultar antecedentes o situaciones previas
4. Valorar el nivel de riesgo (bajo, medio, alto, inmediato)
5. Decidir si se requiere consulta con profesionales especializados
6. Determinar los siguientes pasos según el nivel de gravedad

**Criterios de valoración del riesgo:**
- **Riesgo Inmediato:** Peligro actual para la integridad del menor → Acción inmediata
- **Riesgo Alto:** Indicios graves de violencia reciente → Intervención en 24-48h
- **Riesgo Medio:** Señales preocupantes que requieren seguimiento → Plan de acción en 1 semana
- **Riesgo Bajo:** Situación a vigilar → Seguimiento periódico

**Consulta con profesionales:**
- Psicólogos especializados en infancia
- Trabajadores sociales
- Servicios de orientación familiar
- Asesoría jurídica (cuando proceda)

### Fase 4: Intervención y Medidas de Protección
**Según el nivel de riesgo:**

**Ante riesgo INMEDIATO:**
1. Separar al menor del presunto agresor
2. Llamar al 112 si hay peligro físico
3. Comunicar de inmediato a Fiscalía de Menores o Policía
4. Informar a la familia (salvo que sean los presuntos agresores)
5. Documentar cada paso dado

**Ante riesgo ALTO:**
1. Implementar medidas de protección inmediatas dentro de la entidad
2. Comunicar a Servicios Sociales en 24 horas
3. Notificar a la familia y solicitar reunión urgente
4. Establecer plan de seguimiento diario
5. Coordinar con profesionales externos

**Ante riesgo MEDIO:**
1. Reforzar supervisión del menor en actividades
2. Hablar con la familia sobre las preocupaciones detectadas
3. Ofrecer recursos de apoyo
4. Establecer seguimiento semanal
5. Reevaluar en 15 días

**Ante riesgo BAJO:**
1. Mantener observación discreta
2. Informar al equipo cercano al menor (con confidencialidad)
3. Seguimiento mensual
4. Documentar evolución

## Canal de Comunicación Seguro para Menores

### Requisitos del canal:
La LOPIVI exige que cada entidad establezca un canal seguro, accesible y confidencial para que menores puedan comunicar situaciones de riesgo.

### Características obligatorias:
1. **Accesibilidad:**
   - Fácil de usar para todas las edades
   - Disponible en horarios amplios
   - Visible en todas las instalaciones
   - Información clara en lenguaje adaptado a menores

2. **Confidencialidad:**
   - Garantía de privacidad
   - No identificación pública del comunicante
   - Acceso restringido a personal autorizado
   - Protección de datos del menor

3. **Respuesta rápida:**
   - Acuse de recibo en menos de 24 horas
   - Respuesta inicial en 48-72 horas
   - Información sobre pasos a seguir
   - Actualización periódica del caso

4. **Formatos del canal:**
   - Email específico del Delegado/a
   - Buzón físico cerrado con llave
   - Formulario online cifrado
   - Teléfono de contacto directo
   - Reunión presencial a solicitud

### Comunicación del canal a menores:
- Carteles en lugares visibles (vestuarios, aulas, salas comunes)
- Explicación al inicio de cada curso/temporada
- Recordatorios periódicos
- Información en documentos que reciben las familias
- Sesiones informativas adaptadas por edades

## Comunicación con Familias

### Principios fundamentales:
1. **Transparencia:** Las familias deben conocer los protocolos desde el inicio
2. **Colaboración:** Involucrar a las familias como aliadas en la protección
3. **Respeto:** Mantener privacidad y confidencialidad
4. **Información oportuna:** Comunicar incidentes relevantes de forma adecuada

### Información inicial a las familias:
**Al inicio de la relación con la entidad, informar sobre:**
- Existencia del Plan de Protección
- Rol del Delegado/a de Protección
- Canal de comunicación disponible
- Protocolos de actuación ante incidentes
- Compromiso de buen trato de la entidad
- Derechos y deberes de las familias

**Formato de información:**
- Reunión informativa al inicio de curso/temporada
- Documento escrito firmado de conocimiento
- Información disponible en web de la entidad
- Recordatorios periódicos

### Notificación de incidentes a familias:

**Cuándo notificar:**
- Cualquier incidente que afecte a su hijo/a
- Medidas de protección implementadas
- Derivaciones a servicios externos
- Cambios en protocolos que les afecten

**Cuándo NO notificar de inmediato:**
- Cuando la familia sea presunta responsable
- Cuando notificar pueda poner en riesgo al menor
- Cuando lo indiquen autoridades (ej: orden judicial)
- **En estos casos:** Consultar con Servicios Sociales o autoridades antes de notificar

**Cómo notificar:**
1. Reunión presencial siempre que sea posible
2. Comunicación clara, respetuosa y empática
3. Explicar hechos sin culpabilizar
4. Informar sobre medidas tomadas
5. Ofrecer recursos de apoyo
6. Acordar seguimiento conjunto
7. Documentar la reunión por escrito

### Gestión de reacciones familiares:

**Ante familias defensivas o negadoras:**
- Mantener la calma y profesionalismo
- Basarse en hechos objetivos documentados
- Evitar confrontación
- Ofrecer tiempo para asimilar la información
- Proponer nueva reunión
- Recordar que la prioridad es el bienestar del menor

**Ante familias colaboradoras:**
- Agradecer su disposición
- Establecer plan conjunto de actuación
- Mantener comunicación fluida
- Involucrar en medidas preventivas
- Reconocer su esfuerzo

## Comunicación con Autoridades

### Marco legal de obligación de comunicar:
La LOPIVI establece la **obligación legal** de comunicar a las autoridades competentes cualquier situación de violencia contra menores.

### Situaciones de comunicación OBLIGATORIA:

**1. Maltrato físico:**
- Lesiones físicas causadas intencionadamente
- Castigos corporales graves
- Negligencia que cause daño físico

**2. Abuso sexual:**
- Cualquier forma de abuso sexual o exhibicionismo
- Contacto sexual inadecuado
- Explotación sexual
- Pornografía infantil

**3. Maltrato psicológico:**
- Humillaciones reiteradas
- Amenazas graves
- Rechazo o abandono emocional severo

**4. Negligencia grave:**
- Desatención de necesidades básicas (alimentación, higiene, salud)
- Falta de supervisión que ponga en riesgo al menor
- No proporcionar educación obligatoria

**5. Violencia entre iguales grave:**
- Acoso escolar o bullying severo
- Ciberacoso que cause daño significativo
- Violencia física entre menores

**6. Otros:**
- Explotación laboral
- Mendicidad forzada
- Exposición a violencia de género en el hogar

### A quién comunicar según la situación:

**Servicios Sociales Municipales:**
- Primera instancia en la mayoría de casos
- Situaciones de riesgo o desprotección
- Necesidad de intervención social
- Seguimiento y apoyo familiar

**Fiscalía de Menores:**
- Casos graves de violencia
- Abuso sexual
- Maltrato severo
- Cuando se requiere intervención judicial

**Policía Nacional / Guardia Civil / Policía Local:**
- Urgencia o peligro inmediato
- Delitos flagrantes
- Necesidad de intervención inmediata
- Casos de violencia en el entorno del menor

**Servicio de Protección de Menores (Autonómico):**
- Situaciones de desamparo
- Necesidad de tutela administrativa
- Casos complejos que requieren valoración especializada

### Procedimiento de comunicación a autoridades:

**1. Preparación:**
- Recopilar toda la documentación disponible
- Hechos cronológicos y objetivos
- Testimonios escritos
- Informes médicos o psicológicos si existen

**2. Comunicación formal:**
- Preferiblemente por escrito (email, registro oficial)
- Incluir datos completos del menor y familia
- Descripción detallada de hechos
- Medidas ya adoptadas por la entidad
- Solicitud de intervención o asesoramiento

**3. Seguimiento:**
- Confirmar recepción de la comunicación
- Mantener contacto con el servicio notificado
- Colaborar en la investigación o intervención
- Documentar todas las interacciones

**4. Coordinación:**
- Participar en reuniones de coordinación si son convocadas
- Aportar información complementaria si se solicita
- Implementar recomendaciones de las autoridades
- Mantener informada a la familia (salvo indicación contraria)

### Plazos de comunicación:
- **Riesgo inmediato:** De inmediato (minutos/horas)
- **Riesgo grave:** En 24 horas
- **Riesgo moderado:** En 48-72 horas
- **Situaciones de seguimiento:** En función de la evolución

## Documentación Obligatoria

### Sistema de registro de la entidad:
Toda entidad debe mantener un **sistema de registro confidencial** donde se documenten:

**1. Registro de Incidentes:**
- Fecha y hora
- Descripción detallada de los hechos
- Personas involucradas (anonimizadas si es necesario)
- Testigos
- Medidas inmediatas adoptadas
- Persona que reporta
- Firma del Delegado/a

**2. Actas de Comunicación:**
- Comunicaciones a familias (fechas, contenido, respuestas)
- Comunicaciones a autoridades (copias de notificaciones)
- Comunicaciones internas al equipo
- Acuerdos alcanzados

**3. Medidas Adoptadas:**
- Medidas de protección implementadas
- Cambios organizativos realizados
- Formaciones impartidas al equipo
- Recursos externos activados
- Evaluación de eficacia de cada medida

**4. Seguimiento y Cierre:**
- Evolución del caso (fechas de seguimiento)
- Observaciones periódicas
- Cambios en la situación del menor
- Resolución del caso
- Fecha y motivo de cierre
- Evaluación final

### Custodia y confidencialidad de la documentación:
- **Acceso:** Solo Delegado/a, Delegado/a Suplente y personal autorizado
- **Formato:** Digital cifrado o papel en armario cerrado con llave
- **Conservación:** Mínimo 10 años (según normativa LOPD)
- **Destrucción:** Protocolos seguros de eliminación tras plazo legal
- **Copias:** Solo cuando sea legalmente requerido (autoridades, juzgados)

## Situaciones de Emergencia

### Definición de emergencia:
Situación en la que existe **peligro inmediato** para la integridad física o psicológica del menor que requiere actuación en minutos u horas.

### Protocolo de actuación inmediata:

**PASO 1: PROTEGER AL MENOR (Minutos 0-5)**
- Separar al menor de la fuente de peligro
- Llevar a un lugar seguro dentro de la entidad
- Acompañar por adulto de confianza
- NO dejar solo al menor
- Evaluar necesidad de atención médica

**PASO 2: LLAMAR 112 SI ES NECESARIO (Minutos 5-10)**
**Llamar cuando:**
- Lesiones físicas visibles
- Estado de shock o crisis emocional grave
- Amenaza de daño inmediato
- Situación de violencia activa
- El menor verbaliza intención de autolesión

**Información a proporcionar al 112:**
- Naturaleza de la emergencia
- Edad del menor
- Estado actual
- Ubicación exacta
- Si hay personas involucradas en riesgo

**PASO 3: NOTIFICAR AL DELEGADO/A (Minutos 10-20)**
- Contactar por teléfono inmediatamente
- Si no responde, llamar al Delegado/a Suplente
- Si ninguno está disponible, contactar dirección de la entidad
- Explicar brevemente la situación
- Solicitar indicaciones

**PASO 4: DOCUMENTAR (Minutos 20-30)**
Mientras se espera ayuda o al Delegado/a:
- Anotar hora exacta de cada acción
- Registrar estado del menor
- Escribir cualquier declaración textual
- Identificar testigos presentes
- Fotografiar lesiones si las hay (solo si es seguro y adecuado)

**PASO 5: COMUNICAR A LA FAMILIA (Variable)**
- Evaluar si es seguro y apropiado
- Si la familia puede ser responsable: NO comunicar aún
- Si la familia NO está implicada: Llamar de inmediato
- Informar de la situación y acciones tomadas
- Indicar dónde está el menor

**PASO 6: COLABORAR CON SERVICIOS EMERGENCIA (Si han acudido)**
- Proporcionar toda la información disponible
- Facilitar acceso al menor
- Acompañar si es necesario
- Solicitar información de contacto para seguimiento

**PASO 7: SEGUIMIENTO POST-EMERGENCIA**
- Reunión del equipo implicado en 24 horas
- Informe completo de lo sucedido
- Evaluación de la respuesta dada
- Identificación de mejoras
- Plan de seguimiento del menor

### Errores a evitar en emergencias:
- ❌ Minimizar la situación ("no es para tanto")
- ❌ Dudar en actuar por miedo a equivocarse
- ❌ Intentar resolver solo sin pedir ayuda
- ❌ Prometer al menor que "no se lo dirás a nadie"
- ❌ Interrogar al menor sobre detalles
- ❌ Confrontar al presunto agresor sin apoyo
- ❌ No documentar lo sucedido

## Confidencialidad y Protección de Datos (RGPD)

### Marco normativo:
- Reglamento General de Protección de Datos (RGPD - UE)
- Ley Orgánica 3/2018 de Protección de Datos
- LOPIVI (especificidades para menores)

### Principios aplicables:

**1. Datos Personales del Menor:**
Son **categoría especial** de datos que requieren máxima protección:
- Nombre, apellidos, DNI
- Dirección, teléfono
- Datos de salud
- Situación familiar
- Información sobre violencia sufrida

**2. Base legal para el tratamiento:**
- Interés superior del menor (LOPIVI)
- Obligación legal de protección
- Interés vital del menor

**3. Principios de tratamiento:**
- **Licitud:** Solo para protección del menor
- **Minimización:** Solo datos estrictamente necesarios
- **Exactitud:** Información precisa y actualizada
- **Limitación de conservación:** Plazos definidos
- **Integridad:** Medidas de seguridad adecuadas
- **Confidencialidad:** Acceso restringido

### Acceso a información sensible:

**Quién puede acceder:**
- Delegado/a de Protección
- Delegado/a Suplente
- Dirección de la entidad (información necesaria)
- Autoridades competentes (por requerimiento legal)
- Profesionales externos contratados (con deber de confidencialidad)

**Quién NO puede acceder:**
- Personal no directamente implicado
- Otros menores
- Familias de otros menores
- Voluntarios sin función específica
- Medios de comunicación

### Comunicación de datos a terceros:

**Permitida cuando:**
- Autoridades competentes lo requieran (Fiscalía, Juez, Servicios Sociales)
- Profesionales especializados que intervienen en el caso
- Traspasos justificados por protección del menor

**Prohibida cuando:**
- No existe base legal
- Mera curiosidad o interés
- Difusión pública
- Redes sociales o medios de comunicación

### Derecho al olvido del menor:
Los menores tienen **derecho reforzado al olvido**:
- A solicitar la eliminación de datos una vez resuelto el caso
- A que no queden rastros públicos de situaciones pasadas
- A que su historial no les persiga en su vida adulta

**Excepciones:**
- Obligación legal de conservación documental
- Procesos judiciales en curso
- Interés público prevalente

### Medidas de seguridad obligatorias:
1. **Documentación en papel:**
   - Archivador cerrado con llave
   - Acceso restringido con registro
   - Sala o despacho con cerradura

2. **Documentación digital:**
   - Archivos cifrados
   - Contraseñas robustas
   - Acceso por usuario y contraseña
   - Copias de seguridad cifradas
   - No enviar por email sin cifrar

3. **Comunicaciones:**
   - Utilizar medios seguros (email cifrado, plataformas seguras)
   - Evitar mencionar nombres completos en comunicaciones no seguras
   - Reuniones en espacios privados
   - Destrucción segura de borradores

### Sanciones por incumplimiento:
El incumplimiento del RGPD en casos de menores puede conllevar:
- Sanciones administrativas graves (hasta 20 millones €)
- Responsabilidad civil por daños y perjuicios
- Responsabilidad penal en casos de revelación de secretos
- Daño reputacional grave para la entidad

## Casos Prácticos de Aplicación

### Caso 1: Detección de posible maltrato físico
**Situación:** Un monitor observa moratones en los brazos de un menor que no parecen compatibles con caídas accidentales.

**Actuación correcta:**
1. Documentar observación de forma objetiva (ubicación, tamaño, color)
2. NO preguntar al menor de forma directa e invasiva
3. Informar al Delegado/a ese mismo día
4. El Delegado/a decide hablar con el menor de forma adecuada
5. Según respuesta, valorar comunicación a Servicios Sociales
6. Seguimiento continuado

**Errores a evitar:**
- Interrogar al menor delante de otros
- Sacar fotos sin autorización
- Comentarlo con otros compañeros sin ser necesario
- No documentar por escrito

### Caso 2: Menor comunica situación de acoso escolar grave
**Situación:** Un menor utiliza el canal de comunicación para informar que sufre acoso en su colegio fuera de la entidad.

**Actuación correcta:**
1. Acuse de recibo inmediato (24h)
2. Reunión privada con el menor para escuchar
3. Informar a la familia de la comunicación recibida
4. Coordinar con el colegio del menor
5. Ofrecer apoyo psicológico si la entidad lo tiene
6. Seguimiento semanal de la evolución

**Reflexión:**
Aunque el acoso no ocurre en la entidad, la LOPIVI exige protección integral del menor, por lo que se debe actuar y coordinar.

### Caso 3: Conflicto entre familias sobre incidente menor
**Situación:** Dos menores se pelean durante una actividad. Una familia exige medidas severas contra el otro menor.

**Actuación correcta:**
1. Separar a los menores y calmarlos
2. Escuchar a ambos de forma individual
3. Documentar el incidente
4. Reunión con ambas familias por separado
5. Explicar medidas educativas adoptadas
6. No ceder a presiones de expulsión sin causa justificada
7. Seguimiento de la relación entre los menores

**Principios:**
- Interés superior de ambos menores
- Proporcionalidad de medidas
- Enfoque educativo, no punitivo
- Mediación cuando sea posible

## Recursos y Teléfonos de Interés

### Emergencias:
- **112** - Emergencias generales
- **091** - Policía Nacional
- **062** - Guardia Civil
- **016** - Atención violencia de género (también afecta a menores)

### Líneas de ayuda especializadas:
- **ANAR (Ayuda a Niños y Adolescentes en Riesgo):** 900 20 20 10
  - Atención 24h, confidencial y gratuita
  - Ayuda a menores, familias y profesionales

- **Fundación ANAR Chat:** [www.anar.org/chat-anar](https://www.anar.org/chat-anar)
  - Chat online para menores

- **Teléfono contra el Acoso Escolar:** 900 018 018

### Servicios institucionales:
- **Fiscalía de Menores:** A través de Fiscalía Provincial correspondiente
- **Servicios Sociales Municipales:** 010 (información municipal)
- **Defensor del Menor:** Varía por Comunidad Autónoma

## Herramientas y Formularios

La plataforma Custodia360 proporciona:
- Plantillas de informe de incidentes
- Checklist de actuación según tipo de caso
- Modelos de actas de comunicación
- Formularios de seguimiento
- Registro automatizado de casos

## Evaluación y Mejora del Protocolo

Revisar anualmente:
- ¿Los protocolos son claros para todo el equipo?
- ¿Se han aplicado correctamente en casos reales?
- ¿Qué dificultades se han encontrado?
- ¿Qué mejoras se pueden introducir?

Actualizar tras:
- Cambios normativos
- Recomendaciones de autoridades
- Incidentes que revelen deficiencias
- Buenas prácticas identificadas en otras entidades

## Conclusión

Los protocolos de actuación y comunicación son la columna vertebral de un sistema de protección eficaz. No son meros documentos burocráticos, sino herramientas vivas que deben:

- Conocerse por todo el equipo
- Practicarse mediante simulacros
- Actualizarse periódicamente
- Aplicarse con rigor y sensibilidad

Recordar siempre: **Ante la duda, consultar. Ante el riesgo, actuar. Ante el menor, proteger.**

Un protocolo bien diseñado y correctamente aplicado puede marcar la diferencia entre detectar a tiempo una situación de violencia o permitir que se prolongue. Proteger es responsabilidad de todos, y los protocolos nos indican el camino a seguir.
    `
  },
  {
    id: 4,
    titulo: "Trabajo con Familias y Participación Comunitaria",
    descripcion: "Estrategias para involucrar a las familias y crear redes de protección",
    contenido: `
# MÓDULO 4: Trabajo con Familias y Participación Comunitaria

## La Familia como Aliada
Las familias son el primer entorno de protección. La colaboración activa es fundamental para:
- Prevenir situaciones de riesgo
- Detectar señales tempranas
- Implementar medidas de protección
- Educar en derechos y autocuidado

## Estrategias de Comunicación con Familias
1. **Transparencia**: Informar sobre protocolos y medidas
2. **Accesibilidad**: Canales abiertos de comunicación
3. **Participación**: Involucrar en actividades preventivas
4. **Formación**: Ofrecer recursos educativos

## Reuniones Informativas
- Al inicio de curso/temporada: Explicar plan de protección
- Periódicas: Recordar canales y protocolos
- Específicas: Ante cambios normativos o incidentes

## Gestión de Conflictos
Ante discrepancias con familias:
1. Escucha activa y empática
2. Explicación basada en evidencias
3. Prioridad: Interés superior del menor
4. Documentación de acuerdos y desacuerdos

## Participación Comunitaria
### Redes de Protección
- Coordinación con otras entidades locales
- Intercambio de buenas prácticas
- Actividades conjuntas de sensibilización

### Recursos Comunitarios
- Servicios sociales municipales
- Centros de salud
- Policía Local/Nacional
- Asociaciones vecinales
- ONGs especializadas

## Sensibilización Social
La entidad puede:
- Organizar jornadas informativas
- Participar en campañas locales
- Difundir materiales educativos
- Colaborar con medios de comunicación

## Casos Prácticos de Colaboración
Ejemplos de coordinación exitosa:
- Detección compartida entre escuela y club deportivo
- Intervención conjunta servicios sociales-entidad
- Campañas de prevención con apoyo municipal

## Límites de la Intervención Familiar
- Respeto a la intimidad
- No sustituir a profesionales especializados
- Derivación cuando sea necesario
- Prioridad: seguridad del menor

## Conclusión
La protección infantil es responsabilidad compartida. La colaboración familia-entidad-comunidad crea entornos más seguros.
    `
  },
  {
    id: 5,
    titulo: "Autocuidado y Bienestar del Personal",
    descripcion: "Cuidado del bienestar emocional del equipo que trabaja en protección infantil",
    contenido: `
# MÓDULO 5: Autocuidado y Bienestar del Personal

## Impacto Emocional del Trabajo en Protección
Trabajar en protección infantil implica:
- Exposición a situaciones difíciles
- Responsabilidad emocional elevada
- Posible desgaste profesional (burnout)
- Estrés por toma de decisiones críticas

## Fatiga por Compasión
Síntomas:
- Agotamiento emocional
- Dificultad para desconectar
- Irritabilidad o apatía
- Problemas de sueño
- Disminución de empatía

## Estrategias de Autocuidado
### A nivel individual:
1. Establecer límites profesionales claros
2. Practicar técnicas de relajación
3. Mantener vida personal satisfactoria
4. Actividad física regular
5. Solicitar apoyo cuando sea necesario

### A nivel organizacional:
1. Supervisión profesional periódica
2. Espacios de desahogo y reflexión
3. Formación en gestión emocional
4. Ratios adecuadas de personal
5. Reconocimiento del trabajo realizado

## Apoyo entre Compañeros
- Reuniones de equipo regulares
- Espacios de expresión emocional
- Apoyo mutuo sin juicio
- Celebración de logros

## Supervisión Profesional
Beneficios:
- Análisis de casos complejos
- Perspectiva externa objetiva
- Validación emocional
- Prevención de burnout

## Señales de Alerta en el Equipo
Detectar cuando un compañero/a necesita apoyo:
- Cambios de humor frecuentes
- Aislamiento del equipo
- Errores o despistes inhabituales
- Comentarios de desesperanza

## Recursos de Apoyo
- Servicios de salud ocupacional
- Programas de asistencia al empleado
- Psicólogos especializados
- Grupos de apoyo entre profesionales

## Cultura Organizacional Saludable
La entidad debe promover:
- Comunicación abierta
- Valoración del personal
- Equilibrio vida-trabajo
- Formación continua
- Espacios de desconexión

## Conclusión
Cuidar de quien cuida es fundamental. Un equipo sano es capaz de ofrecer mejor protección a los menores.
    `
  },
  {
    id: 6,
    titulo: "Evaluación, Seguimiento y Mejora Continua",
    descripcion: "Metodologías para evaluar la eficacia del plan y mejorarlo continuamente",
    contenido: `
# MÓDULO 6: Evaluación, Seguimiento y Mejora Continua

## Importancia de la Evaluación
Un plan de protección eficaz requiere:
- Revisión periódica de medidas
- Adaptación a nuevas realidades
- Aprendizaje de la experiencia
- Rendición de cuentas

## Indicadores de Eficacia
### Cuantitativos:
- Número de formaciones realizadas
- Porcentaje de personal formado
- Incidentes registrados y gestionados
- Tiempo de respuesta ante casos

### Cualitativos:
- Satisfacción del personal
- Percepción de seguridad de menores y familias
- Calidad de protocolos aplicados
- Clima organizacional

## Herramientas de Evaluación
1. **Autoevaluación**: Checklist LOPIVI
2. **Encuestas**: Personal, familias, menores
3. **Auditorías internas**: Revisión documental
4. **Observación**: Cumplimiento en la práctica

## Revisión Anual Obligatoria
Contenido mínimo:
- Actualización de protocolos
- Análisis de casos gestionados
- Evaluación de formaciones
- Identificación de áreas de mejora
- Planificación del año siguiente

## Gestión de Incidentes
Cada incidente es una oportunidad de aprendizaje:
1. Análisis de lo sucedido
2. Identificación de fallos
3. Propuestas de mejora
4. Implementación de cambios
5. Seguimiento de eficacia

## Buenas Prácticas
Recoger y difundir:
- Protocolos exitosos
- Innovaciones organizativas
- Recursos útiles
- Experiencias positivas

## Participación del Equipo
Involucrar al personal en:
- Detección de problemas
- Propuestas de soluciones
- Validación de cambios
- Formación entre iguales

## Inspecciones Externas
Preparación para inspecciones:
- Documentación ordenada y accesible
- Personal informado
- Evidencias de cumplimiento
- Actitud colaborativa

## Plan de Mejora Continua
Metodología:
1. Identificar área de mejora
2. Establecer objetivos SMART
3. Diseñar acciones concretas
4. Asignar responsables y plazos
5. Monitorizar progreso
6. Evaluar resultados

## Informe Anual LOPIVI
Documento que recoge:
- Actividad del año
- Casos gestionados (anonimizados)
- Formaciones realizadas
- Evaluación de resultados
- Propuestas de mejora

## Conclusión
La mejora continua garantiza que el plan de protección se mantenga vivo, eficaz y adaptado a las necesidades reales de la entidad y los menores.

---

## ¡Enhorabuena!
Has completado los 6 módulos de formación. Ya estás preparado/a para realizar el test de evaluación.
    `
  }
]

export default function FormacionPage() {
  const router = useRouter()
  const [session, setSession] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [trainingStatus, setTrainingStatus] = useState<any>(null)
  const [moduloActual, setModuloActual] = useState<number | null>(null)
  const [modulosCompletadosLocal, setModulosCompletadosLocal] = useState<Set<number>>(new Set())

  useEffect(() => {
    console.log('🔍 [FORMACIÓN] Verificando acceso...')

    const sessionData = localStorage.getItem('userSession')

    if (!sessionData) {
      console.error('❌ [FORMACIÓN] No hay sesión en localStorage')
      alert('No se encontró sesión activa. Por favor, inicia sesión nuevamente.')
      router.push('/acceso')
      return
    }

    try {
      const parsed = JSON.parse(sessionData)
      console.log('📋 [FORMACIÓN] Sesión encontrada:', parsed)

      // Verificar que sea delegado principal (más flexible)
      const esDelegadoPrincipal =
        parsed.rol === 'delegado_principal' ||
        parsed.tipo === 'principal' ||
        (parsed.permisos && parsed.permisos.includes('formacion'))

      if (!esDelegadoPrincipal) {
        console.error('❌ [FORMACIÓN] Usuario no autorizado:', parsed.rol, parsed.tipo)
        alert('Solo los delegados principales pueden acceder a la formación.\n\nRol actual: ' + (parsed.rol || parsed.tipo || 'desconocido'))
        router.push('/acceso')
        return
      }

      console.log('✅ [FORMACIÓN] Acceso autorizado para:', parsed.nombre)
      setSession(parsed)

      // Cargar estado de formación
      if (parsed.user_id && parsed.entityId) {
        console.log('📊 [FORMACIÓN] Cargando estado de formación...')
        loadTrainingStatus(parsed.user_id, parsed.entityId)
      } else {
        console.warn('⚠️ [FORMACIÓN] Falta user_id o entityId, continuando sin estado previo')
        // Importante: detener el loading incluso si no hay IDs
        setLoading(false)
      }
    } catch (error) {
      console.error('❌ [FORMACIÓN] Error parseando sesión:', error)
      alert('Error al cargar la sesión. Por favor, inicia sesión nuevamente.')
      router.push('/acceso')
    }
  }, [router])

  const loadTrainingStatus = async (personId: string, entityId: string) => {
    console.log('🔄 [FORMACIÓN] Cargando estado de formación para:', personId, entityId)

    try {
      const res = await fetch(`/api/training/status?personId=${personId}&entityId=${entityId}`)
      const data = await res.json()

      console.log('📦 [FORMACIÓN] Respuesta de API:', data)

      if (data.success) {
        console.log('✅ [FORMACIÓN] Estado de formación cargado')
        setTrainingStatus(data.status)
        // Inicializar módulos completados locales desde la API
        if (data.status?.modules_data) {
          const completados = new Set(data.status.modules_data.map((m: any) => m.id))
          setModulosCompletadosLocal(completados)
          console.log('📋 [FORMACIÓN] Módulos completados inicializados:', Array.from(completados))
        }
      } else {
        console.warn('⚠️ [FORMACIÓN] API no retornó success, usando estado vacío')
      }
    } catch (error) {
      console.error('❌ [FORMACIÓN] Error cargando estado:', error)
      // Continuar sin estado de formación previo
    } finally {
      console.log('🏁 [FORMACIÓN] Finalizando carga, deteniendo loading')
      setLoading(false)
    }
  }

  const marcarModuloCompletado = async (moduloId: number) => {
    console.log('✅ [FORMACIÓN] Marcando módulo como completado:', moduloId)

    // ACTUALIZAR ESTADO LOCAL INMEDIATAMENTE
    setModulosCompletadosLocal(prev => {
      const nuevo = new Set(prev)
      nuevo.add(moduloId)
      console.log('📋 [FORMACIÓN] Módulos completados local actualizados:', Array.from(nuevo))
      return nuevo
    })

    // SIEMPRE avanzar al siguiente módulo, independientemente del estado de la API
    const avanzarModulo = () => {
      if (moduloId < 6) {
        const siguienteModulo = moduloId + 1
        console.log(`➡️ [FORMACIÓN] Avanzando automáticamente al módulo ${siguienteModulo}`)
        setModuloActual(siguienteModulo)
        // Scroll al inicio de la página cuando se cambia de módulo
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        console.log('🎉 [FORMACIÓN] Último módulo completado, volviendo a la lista para mostrar pantalla de completado')
        setModuloActual(null)
        // Scroll al inicio de la página
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    // Intentar guardar en la API si hay sesión completa
    if (session?.user_id && session?.entityId) {
      try {
        const modulosData = trainingStatus?.modules_data || []
        if (!modulosData.find((m: any) => m.id === moduloId)) {
          modulosData.push({ id: moduloId, completed_at: new Date().toISOString() })
        }

        const res = await fetch('/api/training/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            personId: session.user_id,
            entityId: session.entityId,
            updates: {
              modules_completed: modulosData.length,
              modules_data: modulosData
            }
          })
        })

        const data = await res.json()
        if (data.success) {
          console.log('✅ [FORMACIÓN] Módulo guardado en la API correctamente')
          setTrainingStatus(data.status)
        } else {
          console.warn('⚠️ [FORMACIÓN] API no retornó success, pero continuamos')
        }
      } catch (error) {
        console.error('❌ [FORMACIÓN] Error guardando en API, pero continuamos:', error)
      }
    } else {
      console.warn('⚠️ [FORMACIÓN] No hay sesión completa, avanzando sin guardar en API')
    }

    // IMPORTANTE: Avanzar SIEMPRE, incluso si la API falló
    avanzarModulo()
  }

  const descargarTodosModulosPDF = () => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF('p', 'mm', 'a4')
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      let yPosition = 20

      // Función auxiliar para control de página
      const checkPageBreak = (requiredSpace = 30) => {
        if (yPosition > pageHeight - requiredSpace) {
          doc.addPage()
          yPosition = 20
        }
      }

      // Portada
      doc.setFillColor(37, 99, 235) // Azul principal de la web
      doc.rect(0, 0, pageWidth, 80, 'F')

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(32)
      doc.setFont('helvetica', 'bold')
      doc.text('FORMACIÓN LOPIVI', pageWidth / 2, 35, { align: 'center' })

      doc.setFontSize(18)
      doc.text('Delegado/a de Protección', pageWidth / 2, 50, { align: 'center' })

      doc.setFontSize(14)
      doc.setFont('helvetica', 'normal')
      doc.text('Custodia360', pageWidth / 2, 65, { align: 'center' })

      yPosition = 100
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(12)
      doc.text(`Delegado/a: ${session?.nombre || 'Usuario'}`, 20, yPosition)
      yPosition += 7
      doc.text(`Entidad: ${session?.entidad || 'Entidad'}`, 20, yPosition)
      yPosition += 7
      doc.text(`Fecha de descarga: ${new Date().toLocaleDateString('es-ES')}`, 20, yPosition)

      // Procesar cada módulo
      MODULOS_CONTENIDO.forEach((modulo, index) => {
        doc.addPage()
        yPosition = 20

        // Encabezado del módulo
        doc.setFillColor(59, 130, 246) // Azul más claro
        doc.rect(0, yPosition - 10, pageWidth, 25, 'F')

        doc.setTextColor(255, 255, 255)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text(`MÓDULO ${modulo.id} DE 6`, 20, yPosition)

        yPosition += 10
        doc.setFontSize(16)
        const tituloLines = doc.splitTextToSize(modulo.titulo, pageWidth - 40)
        doc.text(tituloLines, 20, yPosition)

        yPosition += 25

        // Descripción
        doc.setTextColor(0, 0, 0)
        doc.setFontSize(11)
        doc.setFont('helvetica', 'italic')
        const descLines = doc.splitTextToSize(modulo.descripcion, pageWidth - 40)
        doc.text(descLines, 20, yPosition)
        yPosition += descLines.length * 5 + 10

        // Línea separadora
        doc.setDrawColor(59, 130, 246)
        doc.setLineWidth(0.5)
        doc.line(20, yPosition, pageWidth - 20, yPosition)
        yPosition += 10

        // Contenido del módulo
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)

        const contenidoLines = modulo.contenido.split('\n')
        contenidoLines.forEach(linea => {
          checkPageBreak()

          if (linea.trim() === '') {
            yPosition += 3
            return
          }

          if (linea.startsWith('#')) {
            doc.setFont('helvetica', 'bold')
            doc.setFontSize(14)
            doc.setTextColor(37, 99, 235)
            const titulo = linea.replace(/^#+\s*/, '')
            const tLines = doc.splitTextToSize(titulo, pageWidth - 40)
            doc.text(tLines, 20, yPosition)
            yPosition += tLines.length * 7 + 3
            doc.setFont('helvetica', 'normal')
            doc.setFontSize(10)
            doc.setTextColor(0, 0, 0)
          } else if (linea.startsWith('•') || linea.match(/^\d+\./)) {
            const splitText = doc.splitTextToSize(linea, pageWidth - 50)
            doc.text(splitText, 25, yPosition)
            yPosition += splitText.length * 5 + 2
          } else {
            const splitText = doc.splitTextToSize(linea, pageWidth - 40)
            doc.text(splitText, 20, yPosition)
            yPosition += splitText.length * 5 + 1
          }
        })
      })

      // Página final
      doc.addPage()
      yPosition = pageHeight / 2 - 40

      doc.setFontSize(24)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(34, 197, 94) // Verde
      doc.text('¡Formación Completada!', pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 20
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0, 0, 0)
      doc.text('Has completado exitosamente los 6 módulos de formación', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 7
      doc.text('como Delegado/a de Protección LOPIVI', pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 20
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text('Próximo paso: Realizar el test de evaluación', pageWidth / 2, yPosition, { align: 'center' })

      // Footer en todas las páginas
      const totalPages = doc.internal.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(150, 150, 150)
        doc.text('Formación LOPIVI - Custodia360', 20, pageHeight - 10)
        doc.text(`Página ${i} de ${totalPages}`, pageWidth - 40, pageHeight - 10)
      }

      doc.save(`Formacion_LOPIVI_Completa_${new Date().toISOString().split('T')[0]}.pdf`)
    }).catch(error => {
      console.error('Error generando PDF:', error)
      alert('Error al generar el PDF. Por favor, intenta nuevamente.')
    })
  }

  const moduloEstaCompletado = (moduloId: number) => {
    // Verificar primero el estado local (más actualizado)
    if (modulosCompletadosLocal.has(moduloId)) return true
    // Fallback al estado de la API
    if (!trainingStatus?.modules_data) return false
    return trainingStatus.modules_data.some((m: any) => m.id === moduloId)
  }

  const puedeAccederModulo = (moduloId: number) => {
    if (moduloId === 1) return true
    return moduloEstaCompletado(moduloId - 1)
  }

  if (loading || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando formación...</p>
        </div>
      </div>
    )
  }

  const moduloSeleccionado = moduloActual ? MODULOS_CONTENIDO.find(m => m.id === moduloActual) : null

  if (moduloSeleccionado) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Módulo {moduloSeleccionado.id} de 6
                </span>
                <Button variant="outline" onClick={() => setModuloActual(null)}>
                  Volver a lista
                </Button>
              </div>
              <CardTitle className="text-2xl">{moduloSeleccionado.titulo}</CardTitle>
              <CardDescription>{moduloSeleccionado.descripcion}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none mb-6">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800">
                  {moduloSeleccionado.contenido}
                </pre>
              </div>

              <div className="flex gap-3 border-t pt-4">
                <Button
                  variant="outline"
                  onClick={() => setModuloActual(null)}
                  className="flex-1"
                >
                  Volver
                </Button>
                <Button
                  onClick={() => marcarModuloCompletado(moduloSeleccionado.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={moduloEstaCompletado(moduloSeleccionado.id)}
                >
                  {moduloEstaCompletado(moduloSeleccionado.id) ? '✓ Completado' : 'Marcar como Completado'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Verificar si todos los módulos están completados usando estado local
  const todosCompletados = modulosCompletadosLocal.size === 6

  console.log('🔍 [DEBUG] Verificando módulos completados:', {
    modulosCompletadosLocal: Array.from(modulosCompletadosLocal),
    size: modulosCompletadosLocal.size,
    todosCompletados,
    moduloActual
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">

        {/* Mensaje de Bienvenida - Solo se muestra cuando no ha empezado */}
        {modulosCompletadosLocal.size === 0 && (
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold mb-4">¡Bienvenido/a a tu Formación C360!</h2>
            <p className="text-lg text-green-100 mb-4">
              {session.nombre} | {session.entidad}
            </p>

            <div className="space-y-4 text-white/90">
              <p className="font-semibold text-lg">Cómo funciona el sistema de módulos:</p>

              <ul className="space-y-2 list-disc list-inside">
                <li>
                  <strong>Lectura secuencial:</strong> Debes leer cada módulo en orden para desbloquear el siguiente
                </li>
                <li>
                  <strong>6 módulos completos:</strong> Formación integral sobre la Ley LOPIVI y protección infantil
                </li>
                <li>
                  <strong>Descarga al finalizar:</strong> Una vez completados todos los módulos, podrás descargar el material completo en PDF para tener en tu PC
                </li>
                <li>
                  <strong>Test de evaluación:</strong> Al terminar los 6 módulos, realizarás un test final para obtener tu certificado
                </li>
              </ul>

              <p className="text-sm bg-white/10 p-3 rounded-lg mt-4">
                <strong>Importante:</strong> No podrás avanzar al siguiente módulo hasta completar el actual.
                Al finalizar todos los módulos, tendrás acceso a descargar todo el contenido para tu consulta permanente.
              </p>
            </div>

            <p className="text-white/90 text-sm mt-6 border-t border-white/20 pt-4">
              ¿Tienes dudas? Contáctanos en: <strong>info@custodia360.com</strong>
            </p>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Formación Delegado/a de Protección
          </h1>
          <p className="text-gray-600">
            Progreso: {modulosCompletadosLocal.size} de 6 módulos completados
          </p>
          <div className="mt-3 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(modulosCompletadosLocal.size / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Pantalla de Módulos Completados */}
        {todosCompletados && moduloActual === null && (
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-500 mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-green-900 mb-2">
                ¡Felicitaciones!
              </CardTitle>
              <CardDescription className="text-lg text-gray-700">
                Has completado todos los módulos de formación C360
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={descargarTodosModulosPDF}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg"
                >
                  Descargar Todos los Módulos (PDF)
                </Button>
                <Button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log('🎯 [FORMACIÓN] Click detectado en botón test')
                    console.log('🎯 [FORMACIÓN] Router disponible:', !!router)
                    try {
                      console.log('🎯 [FORMACIÓN] Navegando al test...')
                      router.push('/panel/delegado/formacion/test')
                    } catch (error) {
                      console.error('❌ [FORMACIÓN] Error con router:', error)
                      // Fallback: navegación directa
                      window.location.href = '/panel/delegado/formacion/test'
                    }
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                >
                  Ir al Test de Evaluación
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {MODULOS_CONTENIDO.map((modulo) => {
            const completado = moduloEstaCompletado(modulo.id)
            const accesible = puedeAccederModulo(modulo.id)

            return (
              <Card key={modulo.id} className={!accesible ? 'opacity-50' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Módulo {modulo.id}
                    </span>
                    {completado && (
                      <span className="text-green-600 font-bold">✓</span>
                    )}
                  </div>
                  <CardTitle className="text-lg">{modulo.titulo}</CardTitle>
                  <CardDescription className="text-sm">{modulo.descripcion}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setModuloActual(modulo.id)}
                    disabled={!accesible}
                    className="w-full"
                    variant={completado ? 'outline' : 'default'}
                  >
                    {completado ? 'Revisar' : accesible ? 'Leer Módulo' : '🔒 Bloqueado'}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
