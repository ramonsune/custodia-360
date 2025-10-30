'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getSession, isExpired } from '@/lib/auth/session'

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

## Protocolos Específicos por Sector

### SECTOR EDUCATIVO (Escuelas, Colegios, Centros Educativos)

**Situaciones específicas del sector:**

**1. Acoso escolar (Bullying)**
- **Detección:** Cambios en rendimiento académico, aislamiento en recreos, rechazo a ir al centro
- **Protocolo:**
  1. Entrevista confidencial con la víctima
  2. Entrevista con el presunto acosador (sin confrontación)
  3. Entrevista con testigos
  4. Comunicación a familias de ambas partes
  5. Medidas de protección inmediatas (cambio de clase, supervisión)
  6. Plan de intervención educativa
  7. Seguimiento semanal durante 3 meses

**2. Ciberacoso entre alumnos**
- **Detección:** Capturas de pantalla, testimonios, cambios emocionales
- **Protocolo:**
  1. Recopilación de evidencias digitales (capturas, URLs)
  2. Preservación de pruebas
  3. Comunicación inmediata a familias
  4. Denuncia a Policía si contenido es delictivo (pornografía, amenazas graves)
  5. Medidas educativas sobre uso responsable de tecnología
  6. Apoyo psicológico a la víctima

**3. Relación inapropiada profesor-alumno**
- **Detección:** Favoritismos excesivos, contacto fuera de horario, regalos
- **Protocolo:**
  1. Separación inmediata del profesor y el alumno
  2. Comunicación urgente a dirección del centro
  3. Notificación a Inspección Educativa
  4. Denuncia a Fiscalía de Menores
  5. Medidas cautelares laborales (suspensión temporal)
  6. Apoyo psicológico al menor

**Ejemplo práctico - Centro de Educación Primaria:**
> Un profesor detecta que una alumna de 9 años llega habitualmente sin desayunar, con ropa sucia y muestra cansancio extremo. Al hablar con ella, menciona que cuida de sus hermanos pequeños por las noches porque su madre "no puede".
>
> **Actuación:** Comunicación inmediata al orientador escolar y Delegado/a de Protección → Informe a Servicios Sociales por posible negligencia → Coordinación con trabajador social del municipio → Plan de apoyo familiar (ayudas alimentación, conciliación) → Seguimiento trimestral.

### SECTOR DEPORTIVO (Clubes, Escuelas Deportivas, Gimnasios)

**Situaciones específicas del sector:**

**1. Sobreentrenamiento y presión psicológica**
- **Detección:** Lesiones frecuentes, agotamiento, ansiedad ante competiciones, comentarios sobre presión
- **Protocolo:**
  1. Entrevista con el menor y los padres por separado
  2. Revisión de cargas de entrenamiento con médico deportivo
  3. Reunión con el entrenador (sin carácter punitivo inicial)
  4. Ajuste del plan de entrenamiento
  5. Formación al entrenador sobre desarrollo infantil
  6. Seguimiento médico mensual

**2. Abuso verbal por parte de entrenadores**
- **Detección:** Gritos, humillaciones, insultos durante entrenamientos
- **Protocolo:**
  1. Recogida de testimonios de menores y testigos
  2. Grabación de entrenamientos (si es posible y legal)
  3. Reunión con el entrenador
  4. Formación obligatoria en metodologías positivas
  5. Supervisión directa de entrenamientos
  6. Medidas disciplinarias si persiste

**3. Lesiones sospechosas no reportadas**
- **Detección:** Lesiones que el menor oculta o minimiza
- **Protocolo:**
  1. Valoración médica inmediata
  2. Documentación fotográfica (con consentimiento)
  3. Entrevista privada con el menor
  4. Comunicación a la familia
  5. Si hay sospecha de maltrato en casa: notificación a Servicios Sociales
  6. Si es por prácticas deportivas peligrosas: revisión de protocolos de seguridad

**4. Situaciones en vestuarios y duchas**
- **Protocolo preventivo:**
  1. Supervisión externa sin invasión de intimidad
  2. Prohibición de móviles/cámaras en vestuarios
  3. Presencia de al menos dos adultos en horarios de uso
  4. Vestuarios separados por edades si es posible
  5. Normas claras sobre comportamiento
  6. Formación sobre respeto e intimidad

**Ejemplo práctico - Club de Fútbol Infantil:**
> Durante un torneo, un padre observa que el entrenador grita repetidamente a su hijo de 11 años: "Eres un inútil", "Nunca serás futbolista", delante de todos. El menor llora y se niega a volver a entrenar.
>
> **Actuación:** Padre comunica al Delegado/a de Protección → Reunión urgente con el entrenador → Advertencia formal documentada → Formación obligatoria en coaching deportivo infantil → Seguimiento de entrenamientos por parte de la dirección técnica durante 3 meses → Si persiste: separación del cargo.

### SECTOR OCIO Y TIEMPO LIBRE (Centros juveniles, Campamentos, Ludotecas)

**Situaciones específicas del sector:**

**1. Actividades de riesgo sin supervisión adecuada**
- **Detección:** Actividades acuáticas, altura, bosque sin ratios adecuadas
- **Protocolo preventivo:**
  1. Planificación de actividades con análisis de riesgos
  2. Ratios de monitores/menores según actividad (mínimo 1:10 en actividades normales, 1:5 en riesgo)
  3. Formación de monitores en primeros auxilios
  4. Comunicación a familias de actividades de riesgo
  5. Autorización expresa firmada
  6. Seguro de responsabilidad civil

**2. Excursiones y pernoctaciones**
- **Protocolo específico:**
  1. Autorización paterna con teléfonos de emergencia
  2. Ficha médica actualizada de cada menor
  3. Botiquín completo y monitor formado en primeros auxilios
  4. Supervisión nocturna (rondas cada 2 horas)
  5. Normas claras sobre no separarse del grupo
  6. Protocolo de localización si un menor se pierde
  7. Comunicación diaria con familias (fotos, mensajes)

**3. Relaciones entre menores de edades diferentes**
- **Detección:** Menores mayores con autoridad sobre pequeños
- **Protocolo:**
  1. Separación de actividades por franjas de edad siempre que sea posible
  2. Formación a menores mayores sobre buen trato
  3. Supervisión estrecha de interacciones
  4. Prohibición de que menores mayores impongan castigos
  5. Espacios diferenciados (baños, dormitorios)

**Ejemplo práctico - Campamento de Verano:**
> Durante un campamento, una niña de 8 años comunica a una monitora que un niño de 12 años le ha tocado de forma inapropiada mientras jugaban en la piscina. La niña está asustada y pide que no se lo digan a nadie.
>
> **Actuación:** Monitora informa INMEDIATAMENTE a la Coordinadora del campamento (Delegada de Protección) → Separación inmediata de los menores (diferentes grupos de actividades) → Entrevista confidencial con la niña por profesional formado → Entrevista con el niño (podría ser también víctima o no comprender límites) → Comunicación a ambas familias → Reunión presencial con familias → Coordinación con Servicios Sociales → Valoración psicológica de ambos menores → Seguimiento post-campamento.

### SECTOR CULTURAL (Escuelas de música, danza, teatro, artes)

**Situaciones específicas del sector:**

**1. Contacto físico en clases (danza, teatro)**
- **Protocolo preventivo:**
  1. Comunicar a familias desde el inicio que habrá contacto físico necesario
  2. Explicar a menores los límites del contacto (correcciones posturales)
  3. Pedir permiso verbal antes de tocar ("¿Puedo corregir tu postura?")
  4. Contacto siempre visible, nunca en zonas íntimas
  5. Preferir explicaciones verbales o demostración visual
  6. Clases con puertas/cristales transparentes
  7. Presencia de otro adulto en clases individuales cuando sea posible

**2. Exposición pública (conciertos, representaciones)**
- **Protocolo:**
  1. Autorización expresa de imagen de los padres
  2. Prohibición de fotografías del público durante actuaciones
  3. Control de acceso a camerinos
  4. Supervisión de cambios de vestuario
  5. Gestión de nervios y presión psicológica pre-actuación
  6. Feedback constructivo post-actuación (no humillaciones)

**3. Clases individuales (instrumento musical, canto)**
- **Protocolo específico:**
  1. Sala con ventana o puerta con cristal
  2. Familias en sala de espera visible
  3. Prohibición de clases a puerta cerrada sin visibilidad
  4. Límites claros sobre contacto físico
  5. Grabaciones de clases con consentimiento (protección profesor y alumno)

**Ejemplo práctico - Escuela de Danza:**
> Varias familias comentan que el profesor de ballet clásico hace comentarios sobre el peso de las niñas ("Estás gorda", "Así no podrás bailar") generando ansiedad y trastornos alimentarios en niñas de 10-12 años.
>
> **Actuación:** Delegada de Protección recopila testimonios → Reunión con el profesor para concienciar sobre impacto psicológico → Formación obligatoria en comunicación positiva y desarrollo infantil → Cambio de metodología hacia comentarios constructivos → Charla a familias sobre detección de trastornos alimentarios → Seguimiento trimestral → Si no cambia: separación del cargo.

### SECTOR SOCIOSANITARIO (Centros de menores, pisos tutelados, centros de día)

**Situaciones específicas del sector:**

**1. Contención física de menores con conductas disruptivas**
- **Protocolo estricto:**
  1. Solo personal formado específicamente
  2. Solo cuando existe riesgo inmediato para el menor u otros
  3. Mínima fuerza imprescindible
  4. Duración mínima posible
  5. Registro inmediato en libro de incidencias
  6. Comunicación a familia y supervisor
  7. Revisión del caso en reunión de equipo

**2. Medicación de menores**
- **Protocolo:**
  1. Solo con prescripción médica escrita
  2. Registro de administración (hora, dosis, persona responsable)
  3. Custodia segura de medicamentos
  4. Comunicación a familia de cualquier cambio
  5. Control de posibles efectos adversos
  6. Prohibición absoluta de automedicación

**3. Sospecha de maltrato previo a ingreso en el centro**
- **Protocolo:**
  1. Valoración inicial completa (física, psicológica, social)
  2. Documentación de lesiones o señales previas
  3. Historia de vida del menor
  4. Coordinación con Servicios Sociales
  5. Plan individualizado de atención
  6. Derivación a profesionales especializados (psicólogo trauma)

**Ejemplo práctico - Centro de Acogida de Menores:**
> Un menor de 14 años recién ingresado en centro de acogida muestra conductas sexualizadas inapropiadas con otros menores (tocamientos, propuestas explícitas). El equipo sospecha que puede haber sido víctima de abuso sexual.
>
> **Actuación:** Reunión urgente del equipo educativo → Separación temporal de actividades grupales → Valoración por psicólogo especializado en trauma → Posible derivación a unidad especializada de abuso sexual → Plan de intervención terapéutica → Supervisión estrecha pero no estigmatizante → Formación al resto de equipo sobre manejo de estas conductas → Información y apoyo al resto de menores afectados → Coordinación con tutor legal y Servicios Sociales.

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

## Diversidad Familiar y Enfoques Inclusivos

### Tipologías familiares actuales:

**1. Familias tradicionales (biparentales)**
- Padre y madre conviviendo con hijos/as
- Necesidades: Coordinación entre ambos progenitores, comunicación equilibrada

**2. Familias monoparentales**
- Un solo progenitor al cargo (generalmente la madre)
- Necesidades específicas:
  - Horarios flexibles de comunicación (conciliación)
  - Apoyo en gestiones administrativas
  - Red de apoyo comunitaria
  - Atención especial a sobrecarga del progenitor

**3. Familias reconstituidas**
- Nuevas parejas con hijos de relaciones anteriores
- Necesidades específicas:
  - Claridad sobre quién tiene autorización para recoger al menor
  - Comunicación con todos los adultos de referencia
  - Gestión de conflictos entre hogares
  - Respeto a todos los vínculos del menor

**4. Familias homoparentales**
- Dos madres o dos padres
- Necesidades específicas:
  - Lenguaje inclusivo en documentación ("progenitor 1/2", no "padre/madre")
  - Evitar prejuicios o suposiciones
  - Protección ante posible discriminación de otros menores/familias
  - Normalización en materiales educativos

**5. Familias adoptivas o acogedoras**
- Menores sin vínculo biológico con los adultos
- Necesidades específicas:
  - Sensibilidad ante posible trauma previo del menor
  - Coordinación con Servicios Sociales o entidad de adopción
  - Privacidad sobre origen del menor
  - Apoyo especializado si hay dificultades de vinculación

**6. Familias multiculturales o migrantes**
- Diferentes orígenes culturales o lingüísticos
- Necesidades específicas:
  - Traducción de documentos importantes
  - Respeto a diversidad cultural (religión, alimentación, vestimenta)
  - Mediación intercultural si es necesario
  - Ayuda en comprensión del sistema educativo/social español
  - Atención a posible aislamiento social

**7. Familias en situación de vulnerabilidad**
- Económica, social, sanitaria
- Necesidades específicas:
  - Información sobre ayudas y recursos
  - Flexibilidad en pagos de cuotas/actividades
  - Conexión con servicios sociales
  - Actividades gratuitas o bonificadas
  - No estigmatización del menor

### Enfoque inclusivo en la comunicación:

**Documentación y formularios:**
- Utilizar lenguaje neutro e inclusivo
- Opciones amplias en "relación con el menor" (padre, madre, tutor legal, abuelo/a, hermano/a mayor...)
- No asumir configuraciones familiares tradicionales
- Pedir SIEMPRE datos de contacto de emergencia de varias personas

**Reuniones y entrevistas:**
- Preguntar "¿Con quién vive?" en lugar de asumir
- Invitar a todos los adultos relevantes (con custodia compartida, ambos progenitores)
- Adaptar horarios a diferentes realidades laborales
- Ofrecer reuniones presenciales, telefónicas u online según necesidad

## Estrategias de Comunicación Efectiva con Familias

### Tipos de comunicación:

**1. Informativa (unidireccional)**
- Circulares, emails, carteles
- Información sobre actividades, horarios, protocolos
- Debe ser:
  - Clara y concisa
  - En lenguaje accesible (evitar tecnicismos)
  - Visual cuando sea posible (infografías)
  - Multicanal (papel, email, app, redes sociales)

**2. Consultiva (bidireccional)**
- Encuestas, buzones de sugerencias, reuniones abiertas
- Recoger opiniones de las familias sobre mejoras
- Debe ser:
  - Anónima si se desea opinión sincera
  - Con feedback sobre lo recogido
  - Con acción posterior (implementar sugerencias viables)

**3. Colaborativa (participación activa)**
- Comisiones de familias, voluntariado, coorganización de actividades
- Debe ser:
  - Inclusiva (todas las familias pueden participar)
  - Con roles claros
  - Valorando las aportaciones
  - Con límites claros (qué pueden/no pueden decidir)

### Comunicación de situaciones difíciles a familias:

**Técnica del "Sandwich de Feedback":**
1. **Inicio positivo:** Algo bueno sobre el menor
2. **Núcleo (información difícil):** Describir la situación objetivamente
3. **Cierre constructivo:** Propuesta de solución conjunta

**Ejemplo:**
> "Marta es una niña muy participativa en las actividades y siempre ayuda a sus compañeros [POSITIVO]. Hemos observado que en las últimas dos semanas ha tenido tres episodios de agresividad con otros niños, algo que no es habitual en ella [INFORMACIÓN]. Nos gustaría reunirnos con ustedes para entender si hay algún cambio en casa o si podemos colaborar en ayudarla a gestionar sus emociones [CONSTRUCTIVO]."

### Gestión de familias con diferentes niveles de implicación:

**Familias hiperexigentes:**
- Establecer límites profesionales claros
- Basarse en evidencias objetivas (registros, documentos)
- No ceder a presiones irracionales
- Ofrecer reuniones periódicas pautadas
- Documentar todos los acuerdos

**Familias ausentes o poco colaboradoras:**
- Buscar causas (horarios, idioma, desconfianza, problemas propios)
- Diversificar canales de contacto (si no leen emails, llamar)
- Valorar situaciones de vulnerabilidad
- Implicar servicios sociales si hay negligencia
- No culpabilizar, ofrecer apoyo

**Familias negadoras (ante problemas de su hijo/a):**
- Empatía y no confrontación
- Aportar evidencias concretas (no juicios)
- Dar tiempo para asimilar información
- Ofrecer recursos de evaluación externa (orientadores, psicólogos)
- Seguimiento periódico
- Priorizar siempre interés del menor sobre comodidad familiar

### Reuniones familiares estructuradas:

**Preparación:**
1. Convocar con antelación (mínimo 48h, ideal 1 semana)
2. Indicar motivo, duración estimada y participantes
3. Reservar espacio privado y cómodo
4. Preparar documentación si es necesaria
5. Tener claros los objetivos de la reunión

**Durante la reunión:**
1. Bienvenida y agradecimiento por asistir
2. Explicar motivo y objetivos
3. Exponer hechos objetivos (con ejemplos concretos)
4. Escuchar activamente versión de la familia
5. Explorar causas y contexto
6. Proponer soluciones de forma colaborativa
7. Acordar plan de acción con responsabilidades claras
8. Fijar próximo seguimiento

**Cierre:**
1. Resumen de acuerdos alcanzados
2. Acta breve por escrito firmada por ambas partes
3. Agradecimiento y despedida cordial
4. Seguimiento posterior por email/teléfono

## Programas de Formación para Familias

### Talleres y charlas temáticas:

**1. Prevención de violencia y buen trato**
- Cómo hablar de prevención con hijos/as según edad
- Educación afectivo-sexual adaptada
- Detección de señales de alerta en menores
- Crear un entorno de confianza en casa

**2. Uso seguro de tecnología**
- Control parental sin invasión de privacidad
- Educar en huella digital
- Prevención de ciberacoso, grooming, sexting
- Tiempo de pantallas saludable

**3. Gestión emocional y resolución de conflictos**
- Entender el desarrollo emocional por edades
- Cómo ayudar a hijos/as a gestionar frustración
- Límites con afecto
- Mediación en conflictos entre hermanos

**4. Conciliación y autocuidado familiar**
- Recursos comunitarios de apoyo
- Gestión del estrés parental
- Tiempo de calidad con hijos/as
- Pedir ayuda sin culpa

### Escuela de familias (programa continuado):

**Formato:**
- 6-8 sesiones a lo largo del curso
- Grupos reducidos (máximo 20 familias)
- Metodología participativa (no conferencias magistrales)
- Profesionales especializados (psicólogos, educadores, trabajadores sociales)

**Beneficios:**
- Creación de red de apoyo entre familias
- Espacio de expresión de dudas
- Formación continua
- Prevención de problemas
- Fortalecimiento de vínculo familia-entidad

## Participación Comunitaria y Redes de Protección

### Coordinación interinstitucional local:

**Servicios Sociales Municipales:**
- Reuniones trimestrales de coordinación
- Derivación de casos de familias en riesgo
- Participación en planes locales de infancia
- Colaboración en campañas de sensibilización

**Centros Educativos (Colegios e Institutos):**
- Intercambio de información (con consentimiento familiar)
- Detección compartida de situaciones de riesgo
- Coordinación de intervenciones
- Actividades conjuntas de prevención
- Formación compartida de profesionales

**Centros de Salud y Hospitales:**
- Coordinación en casos de sospecha de maltrato
- Detección de negligencia sanitaria
- Seguimiento de menores con enfermedades crónicas
- Formación en primeros auxilios

**Policía Local / Nacional / Guardia Civil:**
- Charlas de prevención (acoso, drogas, seguridad vial)
- Coordinación en casos graves
- Participación en protocolos de actuación
- Patrullas de proximidad en eventos de la entidad

**Asociaciones y ONGs especializadas:**
- Fundación ANAR (maltrato infantil)
- Save the Children (derechos de infancia)
- UNICEF España (sensibilización)
- Asociaciones contra el acoso escolar
- Entidades de atención a víctimas

### Red local de entidades con menores:

**Creación de una red:**
1. Identificar todas las entidades que trabajan con menores en el municipio
2. Convocar reunión inicial de presentación
3. Establecer objetivos comunes
4. Crear calendario de reuniones periódicas (trimestrales)
5. Compartir protocolos y buenas prácticas
6. Actividades conjuntas de sensibilización

**Beneficios de la red:**
- Información compartida sobre recursos
- Apoyo mutuo entre delegados/as de protección
- Economía de escala en formaciones
- Mayor impacto en campañas
- Voz común ante administraciones
- Detección cruzada de casos (un menor puede estar en varias entidades)

## Casos Prácticos de Colaboración Familia-Entidad-Comunidad

### Caso 1: Familia con dificultades económicas - Sector Deportivo

**Situación:** Una niña de 10 años federada en un club de baloncesto no puede continuar por dificultades económicas familiares tras despido del padre. La familia está avergonzada y no comunica la situación.

**Detección:** El entrenador nota que la niña falta a entrenamientos y pregunta. La niña llora y explica que no pueden pagar.

**Intervención coordinada:**
1. **Entidad:** Delegado/a contacta con la familia con discreción y empatía
2. **Entidad:** Ofrece beca deportiva temporal (50-100% de cuota) sin estigmatización
3. **Servicios Sociales:** Derivación para valoración de ayudas (beca comedor, libros, ayuda económica)
4. **Comunidad:** Banco de equipamiento deportivo de segunda mano
5. **Familias:** Red de apoyo (otras familias ofrecen compartir transporte)

**Resultado:** La niña continúa su actividad deportiva, la familia recibe apoyo integral y se vincula con recursos comunitarios. Se crea protocolo de ayudas discretas para futuros casos.

### Caso 2: Menor víctima de acoso escolar - Sector Educativo + Ocio

**Situación:** Un niño de 12 años sufre acoso en su instituto. Los acosadores también asisten al mismo centro juvenil municipal por las tardes. El menor se aísla y muestra síntomas depresivos.

**Detección:** La madre comunica la situación al orientador del instituto y al Delegado del centro juvenil.

**Intervención coordinada:**
1. **Instituto:** Activa protocolo de acoso (entrevistas, medidas de protección, seguimiento)
2. **Centro Juvenil:** Separación de grupos de actividades, supervisión estrecha
3. **Ambas entidades:** Reunión de coordinación conjunta
4. **Servicios Sociales:** Asignación de educador de referencia
5. **Centro de Salud Mental Infantil:** Apoyo psicológico a la víctima
6. **Familia:** Reuniones semanales de seguimiento, implicación en plan de intervención
7. **Policía Local:** Charlas de prevención en ambos centros

**Resultado:** El acoso cesa en 6 semanas con seguimiento de 6 meses. El menor recupera autoestima. Los acosadores reciben intervención educativa. Se implementa programa de convivencia en ambos centros.

### Caso 3: Menor con síntomas de maltrato en el hogar - Sector Cultural

**Situación:** En una escuela de música, una profesora de piano detecta que un alumno de 9 años presenta moratones frecuentes, se sobresalta con ruidos, y hace comentarios sobre "castigos" en casa.

**Detección:** La profesora documenta observaciones durante 2 semanas y comunica al Delegado/a de la escuela.

**Intervención coordinada:**
1. **Escuela de Música:** Delegado/a realiza entrevista cuidadosa con el menor (no invasiva)
2. **Colegio del menor:** Coordinación para contrastar información
3. **Servicios Sociales:** Notificación inmediata (obligación legal)
4. **Trabajadora Social:** Visita domiciliaria, entrevista con la familia
5. **Centro de Salud:** Valoración pediátrica de lesiones
6. **Fiscalía de Menores:** Información del caso (según gravedad)
7. **Familia:** Propuesta de apoyo (educación parental, seguimiento)
8. **Entidad:** Seguimiento discreto del menor, ambiente seguro

**Resultado:** Se detecta que el padre utiliza castigos físicos por desconocimiento de alternativas educativas. Intervención familiar intensiva. Programa de parentalidad positiva. Seguimiento de 1 año. El menor continúa en la escuela como entorno seguro de referencia. Sin retirada de custodia (no era maltrato severo sino pauta educativa inadecuada corregible).

### Caso 4: Menor migrante con dificultades de integración - Sector Sociosanitario

**Situación:** En un centro de día de menores, un niño marroquí de 11 años recién llegado a España muestra aislamiento, no se relaciona con otros menores, rechaza actividades.

**Detección:** Equipo educativo del centro observa la dificultad de integración durante el primer mes.

**Intervención coordinada:**
1. **Centro de Día:** Valoración inicial de necesidades (idioma, cultura, vinculación familiar)
2. **Servicios Sociales:** Asignación de mediador intercultural
3. **Colegio:** Programa de refuerzo de español, plan de acogida
4. **Asociación de migrantes:** Conexión con comunidad marroquí local, referentes culturales
5. **Familia:** Formación en sistema educativo español, recursos comunitarios
6. **Centro de Salud:** Revisión médica completa, vacunaciones
7. **Centro de Día + Colegio:** Programa de "alumnado acompañante" (otros menores que le ayudan)

**Resultado:** En 3 meses el menor se integra progresivamente. Aprende español básico. Tiene amigos. La familia se vincula con la comunidad. El centro incorpora materiales y celebraciones multiculturales.

## Límites de la Intervención Familiar

### Qué PUEDE hacer la entidad:

✅ Detectar y comunicar situaciones de riesgo
✅ Ofrecer apoyo y orientación básica a familias
✅ Derivar a servicios especializados
✅ Colaborar con profesionales en intervenciones
✅ Crear red de apoyo entre familias
✅ Formación preventiva
✅ Seguimiento de casos en coordinación con servicios

### Qué NO puede/debe hacer la entidad:

❌ Intervenciones terapéuticas (psicología, terapia familiar)
❌ Valoraciones clínicas o diagnósticos
❌ Sustituir a servicios sociales o sanitarios
❌ Imponer medidas a las familias sin base legal
❌ Invadir privacidad familiar más allá de lo necesario para protección
❌ Decisiones unilaterales en casos graves (debe coordinarse)
❌ Juzgar o culpabilizar a las familias

### Derivación a profesionales especializados:

**Cuándo derivar a psicólogo/a infantil:**
- Síntomas de ansiedad, depresión o trauma
- Trastornos de conducta graves
- Dificultades emocionales persistentes
- Tras vivir situaciones traumáticas
- Problemas de relación graves

**Cuándo derivar a servicios sociales:**
- Situaciones de negligencia o maltrato
- Familias en riesgo de exclusión social
- Necesidad de ayudas económicas o materiales
- Problemas de vivienda o situación administrativa
- Apoyo educativo intensivo

**Cuándo derivar a servicios sanitarios:**
- Lesiones físicas que requieren valoración
- Sospecha de trastornos del desarrollo
- Problemas de salud mental
- Trastornos alimentarios
- Adicciones

## Conclusión

La protección infantil es responsabilidad compartida que requiere:
- **Familias:** Como primer entorno de protección y cuidado
- **Entidades:** Como espacios seguros y de detección temprana
- **Comunidad:** Como red de apoyo y recursos
- **Instituciones:** Como garantes legales de derechos

La colaboración efectiva multiplica la capacidad de protección. Ninguna entidad puede hacerlo sola. La clave está en:
- Comunicación fluida
- Roles claros
- Objetivos compartidos
- Respeto mutuo
- Complementariedad de recursos
- Y siempre, el interés superior del menor como brújula
    `
  },
  {
    id: 5,
    titulo: "Autocuidado y Bienestar del Personal",
    descripcion: "Cuidado del bienestar emocional del equipo que trabaja en protección infantil",
    contenido: `
# MÓDULO 5: Autocuidado y Bienestar del Personal

## Introducción

El trabajo en protección infantil es una labor profesional de alto impacto emocional. Estar expuesto/a diariamente a situaciones de vulnerabilidad, riesgo o violencia contra menores tiene consecuencias en la salud mental y emocional del personal. Este módulo aborda la importancia del autocuidado profesional como pilar fundamental para mantener la calidad del trabajo de protección.

**Premisa esencial:** No se puede cuidar bien a otros si no se cuida uno/a mismo/a. Un equipo profesional exhausto, sobrecargado emocionalmente o en situación de burnout no puede ejercer sus funciones con la calidad y sensibilidad que requiere la protección de menores.

## Impacto Emocional del Trabajo en Protección

### Características específicas del trabajo con menores en riesgo:

**1. Exposición a situaciones traumáticas**
- Conocimiento directo de situaciones de maltrato físico, abuso sexual o negligencia grave
- Escuchar relatos detallados de violencia contra menores
- Ver consecuencias del daño en niños, niñas y adolescentes
- Contacto con familias en situaciones de alta conflictividad

**2. Responsabilidad emocional elevada**
- Decisiones que afectan directamente al bienestar de menores
- Presión por "no equivocarse" (las consecuencias pueden ser graves)
- Dilemas éticos constantes (límites entre protección e intervención)
- Sentimiento de que "depende de mí" la seguridad de los menores

**3. Carga administrativa y documental**
- Documentación exhaustiva de cada caso
- Cumplimiento de plazos legales estrictos
- Coordinación con múltiples instituciones
- Gestión de conflictos con familias o compañeros

**4. Exposición a frustración sistémica**
- Casos que no avanzan por falta de recursos
- Tiempos de espera largos de los servicios externos
- Limitaciones legales o institucionales
- Situaciones que se repiten sin mejora aparente

**5. Desgaste por contacto continuo con el dolor**
- Empatía constante con el sufrimiento de menores
- Impotencia ante situaciones que no se pueden resolver completamente
- Vinculación emocional con los casos
- Sensación de "no hacer nunca suficiente"

## Tipos de Desgaste Profesional

### 1. Síndrome de Burnout (Desgaste Profesional)

**Definición:** Estado de agotamiento físico, emocional y mental causado por el estrés laboral crónico.

**Tres dimensiones del burnout:**

**A) Agotamiento emocional:**
- Sensación de estar "vacío/a" emocionalmente
- Falta de energía para afrontar el día
- Cansancio que no se recupera con el descanso
- Dificultad para levantarse e ir al trabajo
- Sentimiento de estar "quemado/a"

**B) Despersonalización (cinismo):**
- Actitudes frías, distantes o cínicas hacia menores o familias
- Tratamiento impersonal de los casos ("son solo números")
- Pérdida de sensibilidad ante el sufrimiento
- Comentarios irónicos o sarcásticos sobre los casos
- Deshumanización del trabajo

**C) Baja realización personal:**
- Sensación de no estar logrando nada
- Cuestionamiento de la utilidad del trabajo
- Pérdida de motivación
- Sentimiento de incompetencia
- Pensamientos de "no sirvo para esto"

**Señales de alerta de burnout:**
- Ausentismo laboral frecuente (bajas, retrasos)
- Errores o despistes que antes no ocurrían
- Irritabilidad o conflictos con compañeros
- Pérdida de interés en la formación o mejora
- Comentarios de "esto no tiene sentido"
- Problemas de salud física recurrentes (dolores de cabeza, estomacales, tensión muscular)

### 2. Fatiga por Compasión (Compassion Fatigue)

**Definición:** Coste emocional de la empatía continua con personas que sufren. Es específico de profesionales que ayudan a víctimas.

**Diferencia con el burnout:**
- El burnout se desarrolla gradualmente por condiciones laborales crónicas
- La fatiga por compasión puede aparecer súbitamente tras un caso especialmente duro

**Síntomas específicos:**
- Dificultad para sentir empatía o compasión
- Evitación emocional ("no quiero saber más detalles")
- Sentimientos de culpa por no involucrarse emocionalmente
- Pensamientos intrusivos sobre los casos fuera del trabajo
- Dificultad para desconectar emocionalmente
- Sueños o pesadillas sobre situaciones de los menores
- Hipervigilancia (estar siempre alerta ante posibles riesgos)

**Factores de riesgo:**
- Alta carga de casos simultáneos
- Casos especialmente graves o traumáticos
- Falta de apoyo del equipo o supervisión
- Historia personal de trauma (aumenta vulnerabilidad)
- Perfeccionismo o alta autoexigencia

### 3. Trauma Vicario (Traumatización Secundaria)

**Definición:** Transformación emocional y cognitiva que sufre el profesional por la exposición repetida a material traumático de otros.

**Es diferente de burnout y fatiga por compasión:**
- Implica cambios profundos en la visión del mundo
- Afecta a creencias y valores fundamentales
- Puede generar síntomas similares al Trastorno de Estrés Postraumático

**Manifestaciones:**
- Cambios en la visión del mundo (percepción de que "todo es peligroso")
- Pérdida de confianza en las personas
- Hipervigilancia hacia los propios hijos (si se tienen)
- Pensamientos intrusivos o imágenes mentales de los casos
- Evitación de estímulos relacionados con el trabajo
- Irritabilidad o explosiones de ira
- Dificultades de sueño, concentración o memoria
- Cambios en la espiritualidad o valores

**Ejemplo:**
> Una educadora social que trabaja con menores víctimas de abuso sexual desarrolla miedo intenso a dejar a su hija pequeña al cuidado de otras personas. Comienza a tener pensamientos intrusivos sobre posibles riesgos, sueña con situaciones de abuso y desarrolla una hipervigilancia que afecta su vida personal y familiar.

### 4. Estrés Traumático Secundario

**Definición:** Aparición de síntomas de estrés postraumático en profesionales sin haber vivido directamente el trauma.

**Síntomas:**
- Reexperimentación (flashbacks de relatos escuchados)
- Evitación (de ciertos casos o situaciones)
- Hiperactivación (estado de alerta constante)
- Cambios negativos en cognición y estado de ánimo

## Autocuidado: Estrategias Prácticas

### A nivel individual

#### 1. Autocuidado físico

**Alimentación:**
- Mantener horarios regulares de comida
- Evitar saltarse comidas por sobrecarga de trabajo
- Limitar cafeína y azúcar (especialmente en momentos de estrés)
- Hidratación adecuada
- Llevar comida saludable al trabajo

**Ejercicio físico:**
- Mínimo 30 minutos de actividad moderada 3-4 veces por semana
- Puede ser caminar, correr, nadar, yoga, baile, etc.
- El ejercicio reduce cortisol (hormona del estrés)
- Ayuda a desconectar mentalmente del trabajo

**Sueño:**
- 7-8 horas de sueño de calidad
- Rutinas regulares de horarios de acostarse y levantarse
- Evitar pantallas 1 hora antes de dormir
- Técnicas de relajación si hay insomnio
- El sueño es fundamental para la regulación emocional

**Atención médica:**
- Revisiones médicas periódicas
- No ignorar síntomas físicos (dolores persistentes, problemas digestivos)
- Atención preventiva, no solo reactiva

#### 2. Autocuidado emocional

**Conciencia emocional:**
- Identificar y nombrar las emociones que se sienten
- Aceptar que es normal sentir tristeza, rabia, frustración o impotencia
- No reprimir ni negar las emociones
- Llevar un diario emocional puede ayudar

**Expresión emocional saludable:**
- Hablar con personas de confianza (no necesariamente del trabajo)
- Llorar cuando se necesita (no es signo de debilidad)
- Escribir sobre las emociones
- Terapia psicológica si es necesario

**Técnicas de regulación emocional:**

**Respiración profunda:**
- Técnica 4-7-8: Inhalar 4 segundos, retener 7, exhalar 8
- Hacer varias respiraciones profundas en momentos de estrés
- Ayuda a activar el sistema nervioso parasimpático (calma)

**Mindfulness (atención plena):**
- Practicar estar presente en el momento actual
- Ejercicios de 5-10 minutos diarios
- Apps como Calm, Headspace, Insight Timer
- Ayuda a reducir pensamientos intrusivos

**Visualización:**
- Imaginar un lugar seguro y tranquilo
- Utilizarlo mentalmente en momentos de estrés
- Puede ser una playa, bosque, montaña, o un espacio inventado

**Grounding (enraizamiento):**
- Técnica 5-4-3-2-1 ante ansiedad:
  - 5 cosas que puedes ver
  - 4 cosas que puedes tocar
  - 3 cosas que puedes oír
  - 2 cosas que puedes oler
  - 1 cosa que puedes saborear
- Ayuda a volver al presente y calmar la ansiedad

#### 3. Autocuidado mental

**Límites profesionales claros:**

**Horarios:**
- No llevarse trabajo a casa (en la medida de lo posible)
- Desconectar el móvil/email laboral fuera de horario
- Respetar días de descanso y vacaciones

**Emocionales:**
- Empatía profesional, no sobreimplicación emocional
- Recordar: "No puedo resolver todos los problemas del mundo"
- Diferenciar entre "me preocupa" y "me responsabilizo excesivamente"
- Aceptar los límites de mi rol (no soy salvador/a, soy acompañante profesional)

**Físicos:**
- Mantener distancia física apropiada con menores y familias
- No dar número personal de teléfono
- No conectar en redes sociales personales con usuarios

**Desconexión mental:**
- Actividades que ocupen la mente en cosas diferentes (hobbies)
- Leer, ver películas, escuchar música
- Socializar con personas fuera del ámbito laboral
- Naturaleza (paseos, senderismo)

**Formación y actualización:**
- Seguir aprendiendo sobre el trabajo
- Asistir a formaciones que motiven
- Leer sobre nuevas metodologías
- El aprendizaje continuo previene el estancamiento

#### 4. Autocuidado social

**Relaciones de apoyo:**
- Mantener vínculos con familia y amigos
- No aislarse socialmente
- Compartir tiempo de calidad con personas queridas
- Pedir ayuda cuando se necesita (no es signo de debilidad)

**Ocio y diversión:**
- Actividades placenteras regularmente
- No sentir culpa por disfrutar (merecemos descansar)
- Risas, juegos, diversión son necesarios
- El ocio no es un lujo, es una necesidad

**Grupos de apoyo:**
- Conectar con otros profesionales del sector
- Compartir experiencias similares
- Aprender estrategias de otros
- Sentirse comprendido/a

#### 5. Autocuidado espiritual/de sentido

**Conexión con el propósito:**
- Recordar por qué elegí este trabajo
- Celebrar pequeños logros (no solo grandes cambios)
- Ver el impacto positivo, aunque sea pequeño
- Leer historias inspiradoras de resiliencia

**Prácticas que den sentido:**
- Meditación, oración, reflexión (según creencias)
- Conexión con la naturaleza
- Arte, música, literatura
- Voluntariado en otras áreas (cambio de perspectiva)

### A nivel organizacional

Las entidades deben implementar políticas de cuidado del equipo:

#### 1. Supervisión profesional obligatoria

**¿Qué es?**
Espacio estructurado donde un/a supervisor/a externo/a (psicólogo/a, trabajador/a social especializado/a) ayuda al equipo a analizar casos, gestionar emociones y prevenir desgaste.

**Características:**
- Periodicidad: Mínimo mensual (ideal quincenal)
- Duración: 90-120 minutos
- Espacio seguro, confidencial, sin juicios
- Diferente a reuniones de coordinación (no es gestión de casos, es cuidado del equipo)

**Beneficios:**
- Análisis objetivo de casos complejos
- Gestión de emociones difíciles del equipo
- Prevención de burnout
- Mejora de la práctica profesional
- Reducción de errores por carga emocional

#### 2. Ratios adecuadas de personal

**Evitar sobrecarga:**
- Número de casos por profesional acorde a la complejidad
- Tiempo suficiente para cada tarea
- No asumir funciones de compañeros ausentes sin ajustar carga

**Personal de apoyo:**
- Administrativos que liberen tareas de gestión
- Profesionales especializados (psicólogos, trabajadores sociales)
- Sustituciones en bajas o vacaciones

#### 3. Espacios de desahogo y reflexión

**Reuniones de equipo con espacio emocional:**
- No solo coordinación técnica
- Espacio para expresar cómo están emocionalmente
- Validación y apoyo mutuo
- Celebración de logros del equipo

**Debriefing tras incidentes críticos:**
- Reunión específica tras situaciones especialmente duras (por ejemplo, comunicar un caso grave a autoridades, gestión de emergencia)
- Expresión de emociones del equipo
- Análisis de lo ocurrido
- Apoyo psicológico si es necesario

#### 4. Formación en gestión emocional

**Temáticas:**
- Identificación y gestión de emociones
- Prevención de burnout y fatiga por compasión
- Técnicas de autocuidado
- Resiliencia profesional
- Inteligencia emocional

**Formato:**
- Talleres prácticos (no solo teóricos)
- Formación continua (mínimo anual)
- Facilitadores especializados

#### 5. Reconocimiento del trabajo realizado

**El reconocimiento previene el desgaste:**
- Valorar públicamente los esfuerzos del equipo
- Agradecimientos explícitos
- Celebrar éxitos (por pequeños que sean)
- Feedback positivo, no solo correctivo

**Incentivos no solo económicos:**
- Flexibilidad horaria
- Días de descanso adicionales tras períodos intensos
- Formación pagada por la entidad
- Mejoras en las condiciones de trabajo

#### 6. Políticas de conciliación

**Equilibrio vida-trabajo:**
- Horarios flexibles cuando sea posible
- Teletrabajo puntual si es viable
- Permisos para gestiones personales
- Respeto a vacaciones y descansos

**Cultura anti-presentismo:**
- Valorar resultados, no horas presentes
- Promover desconexión fuera de horario
- No enviar emails/mensajes fuera de horario laboral
- Respetar días de descanso

## Señales de Alerta en el Equipo

Como Delegado/a de Protección, debes estar atento/a a señales de desgaste en compañeros/as:

### Señales observables:

**Cambios de comportamiento:**
- Aislamiento del equipo (antes era sociable, ahora evita)
- Irritabilidad o conflictos frecuentes
- Llanto o explosiones emocionales
- Apatía o desinterés general

**Cambios en el rendimiento:**
- Errores o despistes inusuales
- Incumplimiento de plazos (antes era puntual)
- Desorganización (antes era organizado/a)
- Dificultad para concentrarse

**Absentismo:**
- Bajas médicas frecuentes
- Retrasos habituales
- Salidas anticipadas
- Evitación de ciertas actividades o casos

**Comentarios verbales:**
- "Esto no sirve para nada"
- "No puedo más"
- "Me da igual ya"
- "Estoy harto/a de todo esto"
- Cinismo o sarcasmo excesivo sobre el trabajo

### Qué hacer si detectas señales:

**1. Acercamiento empático:**
- Hablar en privado con la persona
- "He notado que últimamente... ¿cómo estás?"
- Escucha activa, sin juzgar
- Validar sus emociones

**2. Ofrecer apoyo:**
- "¿Hay algo en lo que pueda ayudarte?"
- Ajustar carga de trabajo si es posible
- Derivar a recursos de apoyo (psicólogo laboral)
- Proponer baja temporal si es necesario

**3. No minimizar:**
- Evitar frases como "todos estamos igual"
- No trivializar el sufrimiento
- Tomar en serio las señales

**4. Seguimiento:**
- Mantener contacto regular
- Preguntar cómo evoluciona
- Ajustar medidas según necesidad

## Apoyo entre Compañeros (Co-visión)

### Cultura de apoyo mutuo:

**Reuniones de equipo regulares:**
- Frecuencia semanal o quincenal
- No solo temas técnicos, también espacio emocional
- Formato circular (todos hablan)
- Confidencialidad de lo compartido

**Compañerismo activo:**
- Preguntar genuinamente "¿cómo estás?"
- Ofrecer ayuda sin esperar a que la pidan
- Compartir recursos útiles
- Celebrar juntos los logros

**Grupos de apoyo informales:**
- Café o comida de equipo
- Actividades fuera del trabajo
- Espacios de desconexión compartidos
- Crear vínculos más allá de lo laboral

**Mentoring entre compañeros:**
- Profesionales con más experiencia acompañan a nuevos
- Compartir aprendizajes
- Apoyo en casos difíciles
- No es jerarquía, es acompañamiento

## Recursos de Apoyo Profesional

### 1. Servicios de salud laboral

**Prevención de riesgos laborales:**
- Evaluación de riesgos psicosociales
- Medidas preventivas
- Seguimiento de condiciones laborales

**Atención médica:**
- Reconocimientos médicos
- Atención a problemas de salud relacionados con el trabajo
- Derivación a especialistas

### 2. Programas de Asistencia al Empleado (EAP)

Muchas entidades ofrecen:
- Atención psicológica gratuita (número limitado de sesiones)
- Asesoramiento legal o financiero
- Apoyo en situaciones personales difíciles
- Confidencialidad total

### 3. Terapia psicológica privada

**Cuándo considerar terapia:**
- Síntomas de burnout, ansiedad o depresión
- Dificultad para desconectar del trabajo
- Problemas de sueño persistentes
- Irritabilidad o conflictos en vida personal
- Sentimientos de desesperanza

**Tipos de terapia útiles:**
- Terapia cognitivo-conductual (para gestión de pensamientos y conductas)
- EMDR (para trauma vicario)
- Terapia centrada en la compasión
- Mindfulness-Based Stress Reduction (MBSR)

### 4. Grupos de apoyo entre profesionales

**Asociaciones profesionales:**
- Colegios profesionales (educadores sociales, psicólogos, trabajadores sociales)
- Grupos de interés específicos
- Formaciones y jornadas

**Grupos de intercambio:**
- Encuentros entre delegados/as de protección de diferentes entidades
- Compartir experiencias y estrategias
- Aprendizaje mutuo

### 5. Formación especializada

**Cursos sobre autocuidado:**
- Prevención de burnout
- Gestión emocional
- Resiliencia profesional
- Mindfulness para profesionales de ayuda

**Supervisión externa:**
- Contratar supervisor/a profesional
- Individual o grupal
- Periodicidad regular

## Casos Prácticos de Desgaste por Sector

### SECTOR EDUCATIVO - Profesora de Primaria

**Situación:**
Ana, profesora con 15 años de experiencia, comienza a llegar tarde, comete errores en calificaciones y evita hablar con compañeros. Ha gestionado este año 3 casos de posible maltrato y uno de abuso sexual. Tiene pesadillas recurrentes.

**Diagnóstico:** Trauma vicario + fatiga por compasión

**Intervención:**
1. Reunión con dirección y Delegada de Protección
2. Reducción temporal de carga (tutorías asumidas por compañera)
3. Derivación a psicólogo especializado en trauma
4. Baja temporal de 2 semanas
5. Supervisión semanal al regresar
6. Formación al claustro sobre autocuidado

**Resultado:** Tras 3 meses de apoyo, Ana recupera capacidad de trabajo. Continúa en supervisión mensual.

### SECTOR DEPORTIVO - Entrenador de Fútbol Infantil

**Situación:**
Carlos, entrenador de 10 años en el club, desarrolla irritabilidad extrema con los niños, grita frecuentemente y muestra despersonalización ("son todos iguales, no me importan"). Ha tenido que gestionar casos de acoso entre jugadores y presión de familias.

**Diagnóstico:** Síndrome de burnout (fase avanzada)

**Intervención:**
1. Reunión con dirección del club
2. Baja temporal de 1 mes
3. Terapia psicológica
4. Revisión de ratio entrenador/niños (estaba sobrecargado)
5. Contratación de asistente de entrenador
6. Formación en metodologías positivas de coaching
7. Supervisión al regresar

**Resultado:** Carlos se replantea continuar. Tras apoyo decide reducir grupos a cargo y especialización en una categoría. Mejora significativa.

### SECTOR OCIO Y TIEMPO LIBRE - Coordinadora de Campamentos

**Situación:**
Marta, coordinadora de campamentos de verano con menores en acogida, desarrolla ansiedad anticipatoria antes de cada campamento, insomnio y evitación de temas relacionados con menores fuera del trabajo. Gestiona casos muy complejos de menores con trauma.

**Diagnóstico:** Estrés traumático secundario

**Intervención:**
1. Derivación urgente a psicólogo especializado en trauma
2. Terapia EMDR
3. Rotación de funciones (temporada sin coordinación de campamentos con menores en acogida)
4. Supervisión profesional externa
5. Participación en grupo de apoyo de profesionales del sector
6. Formación en autocuidado y resiliencia

**Resultado:** Tras 6 meses de tratamiento, Marta vuelve progresivamente. Ahora alterna campamentos complejos con otros de menor carga emocional.

### SECTOR CULTURAL - Profesora de Teatro con Adolescentes

**Situación:**
Laura, profesora de teatro con adolescentes en riesgo de exclusión, pierde motivación, siente que "no sirve para nada lo que hace", falta a clases y se plantea dejar la profesión. Ha vivido varios casos de abandonos de alumnos y situaciones familiares muy duras.

**Diagnóstico:** Burnout (baja realización personal)

**Intervención:**
1. Sesiones de coaching profesional
2. Participación en programa de mentoring con otra profesora experimentada
3. Formación en metodologías de teatro social
4. Visibilización del impacto de su trabajo (testimonios de exalumnos)
5. Reconocimiento institucional de su labor
6. Reducción temporal de horas
7. Supervisión grupal con otros educadores de la escuela

**Resultado:** Laura recupera sentido de su trabajo. Diseña un proyecto innovador de teatro terapéutico que le renueva la motivación.

### SECTOR SOCIOSANITARIO - Educadora de Centro de Menores

**Situación:**
Sofía, educadora en centro de acogida, desarrolla conductas de evitación (llega justo a su hora, sale inmediatamente), somatizaciones (dolores de cabeza, estómago), y tiene explosiones de ira con los menores. Trabaja con menores con graves traumas.

**Diagnóstico:** Fatiga por compasión + inicio de burnout

**Intervención:**
1. Evaluación de riesgos psicosociales del centro
2. Reducción de ratio educadores/menores
3. Implementación de supervisión quincenal obligatoria para todo el equipo
4. Rotación de turnos (evitar siempre turnos nocturnos)
5. Terapia individual para Sofía
6. Formación al equipo en trauma y autocuidado
7. Espacios de debriefing tras incidentes críticos
8. Mejora de condiciones laborales (sala de descanso, pausas)

**Resultado:** Mejora progresiva de Sofía y de todo el equipo. El centro implementa política permanente de autocuidado.

## Plan Personal de Autocuidado

Cada profesional debe diseñar su propio plan:

### Autoevaluación inicial:

**1. ¿Cómo estoy?**
- Nivel de energía (1-10)
- Estado emocional general
- Calidad del sueño
- Relaciones personales
- Satisfacción laboral

**2. ¿Qué necesito?**
- Más descanso
- Apoyo emocional
- Cambios en el trabajo
- Terapia
- Actividades de ocio

**3. ¿Qué obstáculos tengo?**
- Falta de tiempo
- Recursos económicos
- Creencias ("no puedo parar")
- Falta de apoyo

### Diseño del plan:

**Áreas a incluir:**
- Autocuidado físico (alimentación, ejercicio, sueño)
- Autocuidado emocional (gestión emociones, límites)
- Autocuidado social (relaciones, ocio)
- Autocuidado profesional (supervisión, formación)

**Acciones concretas:**
- Específicas (¿qué voy a hacer exactamente?)
- Medibles (¿cómo sabré que lo estoy haciendo?)
- Alcanzables (¿es realista?)
- Relevantes (¿me ayudará?)
- Temporales (¿cuándo empiezo?)

**Ejemplo de plan:**
- Lunes y miércoles: 30 minutos de caminata al salir del trabajo
- Cada noche: 10 minutos de respiración profunda antes de dormir
- Viernes: desconectar email laboral del móvil
- Una vez al mes: salida con amigos no relacionados con el trabajo
- Cada 15 días: supervisión profesional
- Una vez al año: retiro o actividad de desconexión profunda

### Seguimiento:

- Revisión semanal: ¿he cumplido mi plan?
- Ajustes: ¿qué necesito cambiar?
- Celebración: reconocer logros
- Compartir con alguien de confianza para apoyo

## Conclusión

El autocuidado no es egoísmo, es responsabilidad profesional. No podemos cuidar bien a los menores si no nos cuidamos a nosotros mismos. Un equipo sano, descansado y emocionalmente equilibrado es capaz de ofrecer protección de calidad, sostenida en el tiempo y sin errores derivados del agotamiento.

**Recordar:**
- Pedir ayuda es un signo de fortaleza, no de debilidad
- El desgaste no es inevitable, es prevenible
- El autocuidado no es un lujo, es una necesidad
- Cuidar de quien cuida es responsabilidad de las organizaciones
- Cada profesional merece estar bien para poder hacer bien su trabajo

**Mensaje final:**
Si sientes que estás experimentando desgaste, fatiga por compasión o burnout, no estás solo/a y hay ayuda disponible. Buscar apoyo es un acto de valentía y de compromiso con tu trabajo y contigo mismo/a.

**Cuidar a quienes cuidan no es opcional, es esencial.**
    `
  },
  {
    id: 6,
    titulo: "Evaluación, Seguimiento y Mejora Continua",
    descripcion: "Metodologías para evaluar la eficacia del plan y mejorarlo continuamente",
    contenido: `
# MÓDULO 6: Evaluación, Seguimiento y Mejora Continua

## Introducción

Un plan de protección infantil no es un documento estático que se elabora una vez y se archiva. Es un sistema vivo que debe evaluarse, ajustarse y mejorarse continuamente para mantener su eficacia. La LOPIVI no exige solo tener un plan, sino demostrar que funciona y que se mejora con la experiencia.

**Principio fundamental:** Lo que no se mide, no se puede mejorar. La evaluación sistemática es la garantía de que el plan de protección realmente protege.

## Importancia de la Evaluación

### ¿Por qué evaluar?

**1. Garantía de eficacia:**
- Verificar que las medidas implementadas realmente funcionan
- Detectar fallos o áreas débiles antes de que generen problemas graves
- Asegurar que se cumplen los objetivos de protección

**2. Adaptación a nuevas realidades:**
- Nuevas formas de violencia (especialmente digital)
- Cambios en la población atendida
- Modificaciones normativas
- Contextos sociales cambiantes

**3. Aprendizaje de la experiencia:**
- Cada incidente gestionado aporta aprendizajes
- Identificar qué ha funcionado bien y qué no
- Incorporar buenas prácticas detectadas
- Evitar repetir errores

**4. Rendición de cuentas:**
- Transparencia ante familias, menores y autoridades
- Demostrar cumplimiento legal
- Evidencia de compromiso real con la protección
- Base para certificaciones o acreditaciones

**5. Mejora del clima organizacional:**
- Un plan que se revisa y mejora genera confianza en el equipo
- Participación del personal en mejoras aumenta compromiso
- Reducción de incertidumbre y estrés laboral

**6. Prevención de sanciones:**
- Inspecciones externas valoran positivamente cultura de mejora continua
- Evidencias documentadas de esfuerzo de cumplimiento
- Identificación proactiva de incumplimientos antes de que sean detectados externamente

## Indicadores de Eficacia

Los indicadores permiten medir objetivamente el funcionamiento del plan de protección.

### Indicadores Cuantitativos (Números)

#### 1. Formación del personal

**Indicadores:**
- Porcentaje de personal formado en LOPIVI (Meta: 100%)
- Horas de formación en protección infantil por persona/año (Meta: mínimo 4h)
- Número de formaciones específicas realizadas (Meta: mínimo 2/año)
- Porcentaje de asistencia a formaciones obligatorias (Meta: >95%)
- Personal con formación actualizada (últimos 2 años)

**Ejemplo de medición:**
> Club deportivo con 15 personas:
> - 15/15 con formación LOPIVI básica = 100% ✓
> - Promedio 6 horas/persona/año ✓
> - 3 formaciones específicas (primeros auxilios, gestión conflictos, autocuidado) ✓
> - Asistencia promedio 93% → Revisar barreras de asistencia

#### 2. Gestión de incidentes

**Indicadores:**
- Número de incidentes detectados y registrados
- Tiempo promedio de respuesta ante incidentes (Meta: <24h comunicación al Delegado/a)
- Porcentaje de incidentes con protocolo aplicado correctamente (Meta: 100%)
- Número de casos derivados a autoridades competentes
- Tasa de resolución de incidentes en plazos adecuados

**Interpretación:**
- ⚠️ Un número muy bajo de incidentes puede indicar infradetección, no ausencia de problemas
- ✓ Aumento controlado de incidentes detectados puede ser positivo (mayor sensibilidad del equipo)

**Ejemplo:**
> Escuela de música:
> - Año 1: 2 incidentes registrados
> - Año 2: 7 incidentes registrados (tras formación del equipo)
> → No ha empeorado la situación, ha mejorado la detección ✓

#### 3. Certificados de delitos sexuales

**Indicadores:**
- Porcentaje de personal con certificado vigente (Meta: 100%)
- Porcentaje de certificados con antigüedad <1 año (Meta: 100%)
- Tiempo promedio entre contratación y obtención de certificado (Meta: <15 días)
- Número de renovaciones gestionadas anualmente

**Sistema de alerta:**
- Listado de certificados con fecha de caducidad
- Aviso automático 2 meses antes de vencimiento
- Proceso definido de renovación

#### 4. Comunicación y participación

**Indicadores:**
- Número de comunicaciones recibidas por el canal seguro para menores
- Tiempo promedio de respuesta a comunicaciones (Meta: <48h)
- Porcentaje de familias informadas sobre el plan de protección (Meta: 100%)
- Participación en encuestas de satisfacción (Meta: >60%)
- Asistencia a reuniones informativas (Meta: >70%)

#### 5. Cumplimiento documental

**Indicadores:**
- Porcentaje de documentación obligatoria completa (Meta: 100%)
- Autorizaciones de imagen firmadas (Meta: 100%)
- Consentimientos informados actualizados
- Registros de incidentes documentados adecuadamente
- Actas de reuniones de coordinación

### Indicadores Cualitativos (Calidad)

#### 1. Percepción de seguridad

**Métodos de medición:**
- Encuestas anónimas a menores: "¿Te sientes seguro/a en esta entidad?" (escala 1-5)
- Encuestas a familias: "¿Confías en que tu hijo/a está protegido/a?" (escala 1-5)
- Grupos focales con menores (adaptados por edad)
- Buzón de sugerencias (análisis de contenido)

**Preguntas clave en encuestas:**
- ¿Conoces al Delegado/a de Protección?
- ¿Sabes a quién acudir si tienes un problema?
- ¿Te sientes escuchado/a?
- ¿Has presenciado situaciones que te preocuparon?

#### 2. Clima organizacional

**Métodos:**
- Encuestas de satisfacción laboral del personal
- Entrevistas individuales o grupales
- Observación del ambiente de trabajo
- Tasa de rotación del personal (alta rotación puede indicar problemas)

**Aspectos a evaluar:**
- Comunicación interna
- Apoyo entre compañeros
- Liderazgo del Delegado/a
- Claridad de protocolos
- Carga de trabajo
- Reconocimiento del esfuerzo

#### 3. Calidad de protocolos aplicados

**Evaluación mediante:**
- Revisión de casos documentados (muestra aleatoria)
- Análisis de coherencia entre protocolo y actuación real
- Identificación de desviaciones o adaptaciones
- Feedback del equipo sobre usabilidad de protocolos

**Criterios de calidad:**
- ¿Se siguieron todos los pasos del protocolo?
- ¿Se documentó adecuadamente?
- ¿Se comunicó a quien correspondía?
- ¿Se hizo en los plazos establecidos?
- ¿El resultado fue satisfactorio?

#### 4. Cultura de protección

**Indicadores observables:**
- Naturalidad al hablar de protección (no es tabú)
- Iniciativa del equipo en proponer mejoras
- Menores que expresan abiertamente preocupaciones
- Familias que participan activamente
- Casos de detección temprana (antes de que el problema se agrave)

## Herramientas de Evaluación

### 1. Autoevaluación (Checklist LOPIVI)

**¿Qué es?**
Un cuestionario exhaustivo que verifica el cumplimiento de todos los requisitos LOPIVI.

**Periodicidad:** Mínimo anual (recomendable semestral)

**Responsable:** Delegado/a de Protección con apoyo de dirección

**Contenido del checklist:**

**A) Designación del Delegado/a:**
- ☐ Existe Delegado/a principal designado formalmente
- ☐ Existe Delegado/a suplente
- ☐ Ambos tienen formación específica en protección infantil
- ☐ Ambos tienen certificado de delitos sexuales vigente
- ☐ Su identidad y contacto están visibles en la entidad
- ☐ Disponen de tiempo suficiente para sus funciones

**B) Plan de protección:**
- ☐ Existe plan de protección por escrito
- ☐ Está actualizado (revisado último año)
- ☐ Incluye análisis de riesgos específicos de la entidad
- ☐ Incluye protocolos de actuación claros
- ☐ Incluye código de conducta
- ☐ Está aprobado por dirección
- ☐ Es conocido por todo el personal
- ☐ Es accesible para consulta

**C) Formación:**
- ☐ Todo el personal ha recibido formación LOPIVI
- ☐ Hay plan de formación continua
- ☐ Se documenta la formación (asistencia, contenidos)
- ☐ Se forma a nuevo personal en su incorporación

**D) Canal de comunicación:**
- ☐ Existe canal específico para menores
- ☐ Es accesible y conocido por menores
- ☐ Es confidencial
- ☐ Hay protocolo de respuesta definido
- ☐ Se registran y responden las comunicaciones

**E) Documentación:**
- ☐ Certificados de delitos sexuales de todo el personal
- ☐ Autorizaciones de imagen
- ☐ Consentimientos informados
- ☐ Registro de incidentes
- ☐ Actas de formaciones
- ☐ Sistema de custodia segura de documentos

**F) Coordinación:**
- ☐ Hay contactos identificados con Servicios Sociales
- ☐ Hay contactos con Policía/Guardia Civil
- ☐ Hay protocolo de derivación a autoridades
- ☐ Se coordinan casos con otros servicios

**G) Participación familias:**
- ☐ Familias informadas del plan de protección
- ☐ Se realizan reuniones informativas
- ☐ Hay vías de comunicación con familias
- ☐ Se recoge feedback de familias

**Análisis de resultados:**
- 100% cumplimiento: ✓ Excelente, mantener
- 90-99%: ⚠️ Bien, identificar gaps y corregir
- 80-89%: ⚠️⚠️ Insuficiente, plan de acción urgente
- <80%: 🚨 Incumplimiento grave, revisión integral

### 2. Encuestas de Satisfacción y Percepción

**A) Encuesta a menores (adaptada por edad)**

**Para menores de 6-10 años (formato muy simple, con emojis):**
1. ¿Te sientes feliz aquí? 😊😐☹️
2. ¿Tienes amigos? 😊😐☹️
3. ¿Los adultos te escuchan? 😊😐☹️
4. ¿Sabes a quién decir si algo te preocupa? SÍ / NO
5. ¿Te han pasado cosas que te hicieron sentir mal? SÍ / NO

**Para menores de 11-18 años:**
1. ¿Te sientes seguro/a en esta entidad? (Escala 1-5)
2. ¿Conoces al Delegado/a de Protección?
3. ¿Sabes cómo comunicar un problema o preocupación?
4. ¿Crees que si comunicas algo, te van a escuchar y ayudar?
5. ¿Has presenciado situaciones que te preocuparon? Si sí, ¿las comunicaste?
6. ¿Qué mejorarías para sentirte más seguro/a?

**B) Encuesta a familias:**

1. ¿Conoce el plan de protección de esta entidad?
2. ¿Le explicaron cómo funciona el sistema de protección?
3. ¿Confía en que su hijo/a está seguro/a aquí? (Escala 1-5)
4. ¿Sabe a quién dirigirse si tiene una preocupación?
5. ¿Ha recibido información sobre señales de alerta de violencia?
6. ¿Le gustaría recibir formación sobre protección infantil?
7. Comentarios o sugerencias

**C) Encuesta a personal:**

1. ¿Conoce bien los protocolos de actuación?
2. ¿Se siente preparado/a para detectar situaciones de riesgo?
3. ¿Sabe exactamente qué hacer si detecta un caso?
4. ¿El Delegado/a de Protección es accesible?
5. ¿Recibe suficiente formación en protección infantil?
6. ¿Siente apoyo del equipo en casos difíciles?
7. ¿Qué dificultades encuentra en aplicar los protocolos?
8. ¿Qué mejoraría del sistema de protección?

### 3. Auditorías Internas

**¿Qué es?**
Revisión exhaustiva de la documentación y prácticas de protección.

**Periodicidad:** Anual

**Responsable:** Puede ser el Delegado/a con apoyo externo, o auditor externo contratado

**Proceso:**

**Fase 1: Revisión documental**
- Verificar existencia de todos los documentos obligatorios
- Comprobar vigencia (certificados, autorizaciones)
- Revisar registros de incidentes (completitud, adecuación)
- Analizar actas de formaciones
- Verificar sistema de custodia y confidencialidad

**Fase 2: Entrevistas**
- Entrevistar muestra del personal
- Entrevistar a dirección
- Entrevistar (si es posible y apropiado) a muestra de menores
- Entrevistar a muestra de familias

**Fase 3: Observación**
- Visitar instalaciones (espacios, visibilidad, seguridad)
- Observar actividades (supervisión, ratios)
- Verificar visibilidad de información sobre protección
- Comprobar accesibilidad del canal de comunicación

**Fase 4: Informe de auditoría**
- Fortalezas identificadas
- Debilidades o gaps
- Incumplimientos detectados
- Riesgos identificados
- Recomendaciones de mejora
- Plan de acción propuesto

### 4. Observación Directa

**Aspectos a observar:**

**Instalaciones:**
- ¿Hay zonas ocultas sin supervisión?
- ¿La iluminación es adecuada?
- ¿Los baños/vestuarios tienen privacidad pero supervisión externa?
- ¿Hay información visible sobre protección?

**Actividades:**
- ¿El ratio adultos/menores es adecuado?
- ¿La supervisión es activa o pasiva?
- ¿Se respetan normas de contacto físico apropiado?
- ¿El trato es respetuoso?

**Clima:**
- ¿Los menores parecen cómodos y felices?
- ¿Hay interacciones positivas entre menores y adultos?
- ¿Se gestionan conflictos de forma educativa?
- ¿Hay respeto a la diversidad?

## Revisión Anual Obligatoria del Plan

La LOPIVI exige revisión anual del plan de protección.

### Proceso de revisión:

**1. Preparación (1-2 meses antes):**
- Recopilación de datos del año (indicadores, incidentes, formaciones)
- Realización de encuestas
- Auditoría interna
- Reuniones preparatorias con equipo

**2. Análisis (1 mes antes):**
- Análisis de cumplimiento de objetivos del año
- Identificación de fortalezas y debilidades
- Detección de áreas de mejora
- Análisis de cambios normativos o contextuales

**3. Reunión de revisión (convocatoria formal):**
**Participantes:**
- Delegado/a de Protección (lidera)
- Dirección de la entidad
- Representantes del equipo
- Opcionalmente: asesor externo

**Contenido de la reunión:**
1. Presentación de datos del año
2. Análisis de indicadores
3. Revisión de incidentes gestionados (anonimizados)
4. Evaluación de formaciones realizadas
5. Feedback del equipo
6. Identificación de áreas de mejora
7. Propuestas de cambios en el plan
8. Planificación del año siguiente
9. Asignación de responsabilidades

**4. Documentación:**
- Acta de la reunión de revisión
- Informe anual de protección (documento formal)
- Plan de acción del año siguiente
- Actualización del plan de protección (si procede)

**5. Comunicación:**
- Comunicar resultados y mejoras al equipo
- Informar a familias sobre revisión y mejoras
- Presentar a dirección/patronato/junta directiva

### Contenido del Informe Anual LOPIVI:

**1. Datos de la entidad:**
- Nombre, CIF, sector, actividades
- Número de menores atendidos
- Número de personal

**2. Gestión del plan de protección:**
- Delegado/a de Protección (nombre, formación)
- Actualizaciones del plan realizadas
- Formaciones impartidas (número, horas, asistentes)
- Certificados de delitos sexuales (100% compliance)

**3. Actividad del año:**
- Incidentes detectados (número, tipología, sin datos identificativos)
- Protocolos activados
- Derivaciones realizadas
- Tiempo promedio de respuesta
- Resolución de casos

**4. Indicadores:**
- Cuantitativos (con comparativa año anterior si existe)
- Cualitativos (satisfacción, percepción seguridad)

**5. Evaluación:**
- Fortalezas del sistema
- Debilidades detectadas
- Dificultades encontradas
- Buenas prácticas identificadas

**6. Mejoras implementadas:**
- Cambios realizados durante el año
- Resultados de las mejoras

**7. Plan de acción próximo año:**
- Objetivos específicos
- Acciones concretas
- Responsables
- Plazos
- Recursos necesarios

**8. Anexos:**
- Encuestas (datos agregados)
- Informe de auditoría (si se realizó)
- Certificados de formaciones

## Gestión de Incidentes y Aprendizaje

### Cada incidente es una oportunidad de mejora

**Metodología de análisis post-incidente:**

**1. Descripción del incidente:**
- ¿Qué ocurrió exactamente?
- ¿Cuándo y dónde?
- ¿Quiénes estaban involucrados?

**2. Análisis de la gestión:**
- ¿Cómo se detectó?
- ¿Qué acciones se tomaron?
- ¿Se siguió el protocolo?
- ¿Los plazos fueron adecuados?
- ¿La comunicación fue efectiva?

**3. Identificación de factores contribuyentes:**
- ¿Qué permitió que ocurriera?
- ¿Había señales previas no detectadas?
- ¿Falló algo del sistema?
- ¿Hubo circunstancias excepcionales?

**4. Lecciones aprendidas:**
- ¿Qué funcionó bien?
- ¿Qué no funcionó?
- ¿Qué podríamos haber hecho diferente?
- ¿Qué hemos aprendido?

**5. Propuestas de mejora:**
- Cambios en protocolos
- Formación específica necesaria
- Ajustes organizativos
- Recursos adicionales

**6. Implementación:**
- Asignar responsables
- Establecer plazos
- Comunicar cambios al equipo
- Documentar las mejoras

**7. Seguimiento:**
- Verificar implementación
- Evaluar eficacia
- Ajustar si es necesario

### Ejemplos de aprendizaje de incidentes:

**Caso 1 - Sector Educativo:**

**Incidente:** Un menor comunicó al Delegado/a que otro alumno le acosaba, pero el Delegado/a estaba de vacaciones y el suplente no fue informado hasta 10 días después.

**Análisis:** Fallo en protocolo de sustitución.

**Mejora implementada:**
- Email automático del Delegado/a principal al suplente cuando se ausenta
- Cartel visible en dirección con contacto del suplente cuando principal no está
- Formación al equipo sobre comunicar SIEMPRE al Delegado/a disponible, no esperar

**Resultado:** Nuevo incidente meses después gestionado en 24h porque se aplicó el nuevo protocolo.

**Caso 2 - Sector Deportivo:**

**Incidente:** Padre agresivo entró al vestuario de niños sin supervisión tras un partido.

**Análisis:** Control de accesos insuficiente, falta de señalización.

**Mejoras implementadas:**
- Cartel visible: "Zona de menores - Acceso restringido a personal autorizado"
- Protocolo de espera de familias en zona designada
- Monitor responsable de vestuario (supervisión externa)
- Comunicación a familias sobre normas de acceso

**Resultado:** No se han repetido accesos no autorizados.

**Caso 3 - Sector Ocio:**

**Incidente:** En campamento, un menor se alejó del grupo durante una excursión y estuvo perdido 45 minutos.

**Análisis:** Ratio insuficiente monitores/menores, falta de sistema de verificación periódica.

**Mejoras implementadas:**
- Aumento de ratio: 1 monitor cada 8 menores (antes 1 cada 12)
- Sistema de "pareja de supervisión" (cada menor tiene una pareja asignada)
- Conteo obligatorio cada 30 minutos en excursiones
- Pulseras identificativas con teléfono de contacto
- Formación en protocolo de búsqueda de menor perdido

**Resultado:** En siguientes campamentos, sistema previno una situación similar (se detectó ausencia de menor en menos de 10 minutos).

## Buenas Prácticas y Difusión

### Identificación de buenas prácticas:

**¿Qué es una buena práctica?**
- Iniciativa que ha demostrado eficacia
- Puede ser replicable en otros contextos
- Mejora significativa respecto a situación anterior
- Innovadora o creativa

**Ejemplos de buenas prácticas:**

**1. Canal de comunicación gamificado (Escuela):**
Una escuela creó una app donde los menores pueden reportar preocupaciones de forma anónima mediante un sistema de "estrellas de ayuda". Ha aumentado las comunicaciones de menores un 300%.

**2. Formación entre iguales (Club deportivo):**
Deportistas juveniles (16-17 años) reciben formación específica en protección y actúan como "referentes de protección" para los más pequeños. Detección temprana de conflictos ha mejorado notablemente.

**3. Supervisión cruzada (Centro cultural):**
Profesores de diferentes actividades rotan observando clases de compañeros para feedback constructivo y supervisión mutua. Ha mejorado calidad de supervisión y reducido aislamiento profesional.

**4. Escuela de familias trimestral (Centro juvenil):**
Sesiones formativas para familias sobre diferentes temas (redes sociales, acoso, comunicación). Participación del 75% de familias y mejora en detección colaborativa.

### Difusión de buenas prácticas:

**Interna (dentro de la entidad):**
- Presentación en reuniones de equipo
- Newsletter interna
- Reconocimiento al equipo/persona que la implementó
- Incorporación a protocolos si es replicable

**Externa (otras entidades):**
- Participación en jornadas de buenas prácticas
- Publicación en webs especializadas
- Redes de entidades del sector
- Colaboración con administraciones públicas

## Participación del Equipo en la Mejora

### El equipo como motor de mejora:

**Mecanismos de participación:**

**1. Buzón de sugerencias:**
- Físico y digital
- Anónimo si se desea
- Revisión mensual
- Feedback sobre propuestas recibidas

**2. Reuniones de mejora:**
- Trimestrales, específicas para proponer mejoras
- Metodología participativa (lluvia de ideas, priorización)
- Actas con compromisos
- Seguimiento en siguiente reunión

**3. Grupos de trabajo:**
- Por áreas específicas (comunicación, formación, instalaciones)
- Composición voluntaria
- Objetivos claros
- Presentación de propuestas a dirección

**4. Formación entre iguales:**
- Quien tiene una habilidad/conocimiento lo comparte
- Reduce costes de formación
- Empodera al equipo
- Mejora clima

**Beneficios de participación:**
- Mayor compromiso del equipo
- Soluciones más ajustadas a la realidad
- Detección de problemas que la dirección no ve
- Cultura de mejora continua

## Inspecciones Externas

### Tipos de inspecciones:

**1. Inspecciones administrativas (Servicios Sociales, Educación):**
- Verificación de cumplimiento normativo
- Revisión documental
- Entrevistas
- Pueden derivar en requerimientos o sanciones

**2. Auditorías de certificación (voluntarias):**
- Entidades que buscan sello de calidad
- Normas ISO, protocolos específicos
- Evaluación exhaustiva
- Certificado válido por período determinado

**3. Inspecciones judiciales o policiales:**
- En contexto de investigación
- Requieren colaboración total
- Asesoramiento jurídico recomendable

### Preparación para inspecciones:

**Documentación a tener preparada:**

**Carpeta física o digital con:**
- Plan de protección vigente
- Nombramiento formal de Delegado/a
- Certificados de delitos sexuales de todo el personal (organizados, con vigencia)
- Registro de formaciones (con asistencias firmadas)
- Autorizaciones de imagen y consentimientos
- Registro de incidentes (anonimizados)
- Actas de reuniones de coordinación
- Informe anual LOPIVI del último año
- Evidencias de comunicación con familias (circulares, actas de reuniones)
- Protocolos de actuación
- Código de conducta firmado por personal

**Preparación del equipo:**
- Todo el personal debe conocer:
  - Quién es el Delegado/a de Protección
  - Dónde está el plan de protección
  - Qué hacer ante un incidente
  - Existencia de formaciones recibidas

**Instalaciones:**
- Espacios ordenados y seguros
- Información visible sobre protección
- Cartelería al día

**Actitud durante la inspección:**
- Colaboración total
- Transparencia
- No ocultar problemas (reconocer y mostrar plan de mejora)
- Respeto y profesionalidad

**Gestión de hallazgos:**
- Escuchar recomendaciones
- Tomar notas
- Agradecer el feedback
- Implementar correcciones en plazos indicados
- Comunicar implementación a la autoridad

## Plan de Mejora Continua

### Metodología PDCA (Plan-Do-Check-Act)

**1. PLAN (Planificar):**
- Identificar área de mejora
- Analizar causas
- Establecer objetivos SMART
- Diseñar acciones concretas
- Asignar responsables
- Establecer indicadores

**2. DO (Hacer):**
- Implementar las acciones planificadas
- Documentar el proceso
- Comunicar al equipo
- Proporcionar recursos necesarios

**3. CHECK (Verificar):**
- Medir indicadores
- Comparar con objetivos
- Recoger feedback
- Identificar desviaciones

**4. ACT (Actuar):**
- Si funciona: estandarizar (incorporar a protocolos)
- Si no funciona: ajustar y repetir ciclo
- Documentar aprendizajes
- Comunicar resultados

### Ejemplo de Plan de Mejora:

**Entidad:** Escuela de danza
**Área de mejora:** Comunicación con familias sobre protección

**1. PLAN:**
- **Objetivo SMART:** Que el 90% de familias conozcan el plan de protección en 6 meses
- **Situación actual:** Solo 40% conocen (según encuesta)
- **Acciones:**
  - Reunión informativa trimestral obligatoria
  - Envío de resumen del plan de protección por email
  - Cartel visible en recepción
  - Breve charla del Delegado/a al inicio de cada curso
- **Responsable:** Delegada de Protección + Dirección
- **Plazo:** 6 meses
- **Indicador:** % de familias que responden "Sí" a "¿Conoce el plan de protección?" en encuesta

**2. DO (implementación en 6 meses):**
- Septiembre: Reunión informativa + envío de email
- Octubre: Cartel en recepción
- Noviembre: Reunión informativa (nuevas inscripciones)
- Diciembre: Recordatorio por email
- Enero: Charla breve en inicio de curso (2º trimestre)
- Febrero: Encuesta

**3. CHECK (resultados):**
- Nueva encuesta: 85% conocen el plan
- Feedback: Familias agradecen la información, sugieren versión reducida más visual

**4. ACT:**
- Estandarizar: Incluir reunión informativa trimestral en calendario anual
- Mejorar: Crear infografía visual del plan de protección
- Nuevo objetivo: Llegar al 95% en próximos 6 meses con infografía
- **Repetir ciclo**

## Casos Prácticos de Evaluación y Mejora por Sector

### SECTOR EDUCATIVO - Colegio de Primaria

**Situación inicial:**
Colegio con plan de protección básico. Auditoría interna detecta:
- Solo 60% de personal formado
- No hay registro sistemático de incidentes
- Familias no conocen el plan

**Plan de mejora implementado:**
1. Formación obligatoria a 100% de personal (3 meses)
2. Creación de registro digital de incidentes (formato simple)
3. Reunión informativa para familias (una por trimestre)
4. Designación de Delegado/a suplente (no existía)

**Evaluación tras 1 año:**
- 100% personal formado ✓
- 12 incidentes registrados (antes no se registraban, mejora en detección)
- 80% de familias conocen el plan (mejora significativa)
- Tiempo de respuesta promedio: 18h (antes: indefinido)

**Nueva área de mejora identificada:** Participación de menores en el sistema.

### SECTOR DEPORTIVO - Club de Baloncesto

**Situación inicial:**
Inspección de Servicios Sociales identifica:
- Certificados de delitos sexuales de 3 entrenadores caducados
- Vestuarios sin supervisión adecuada
- No hay canal de comunicación específico para menores

**Plan de mejora urgente:**
1. Renovación inmediata de certificados (1 semana)
2. Protocolo de supervisión de vestuarios (monitor responsable)
3. Creación de email específico para comunicaciones: [email protected]
4. Formación al equipo técnico en protección (1 mes)

**Seguimiento a 6 meses:**
- 100% certificados vigentes (sistema de alerta automática implementado) ✓
- 0 incidentes en vestuarios (antes: 2-3 anuales) ✓
- 5 comunicaciones recibidas por menores (antes: 0), todas gestionadas correctamente ✓

**Reconocimiento:** Servicios Sociales felicitan al club por mejora e incluyen como ejemplo de buena práctica.

### SECTOR OCIO - Centro Juvenil Municipal

**Situación inicial:**
Cambio de Delegado/a de Protección tras baja del anterior. Nueva Delegada realiza evaluación:
- Plan de protección desactualizado (2 años de antigüedad)
- Protocolos complejos que nadie usa
- Alto estrés del equipo (fatiga por compasión)

**Plan de mejora:**
1. Revisión completa del plan con participación del equipo (simplificación)
2. Protocolos visuales (infografías, flujogramas)
3. Supervisión profesional externa mensual para el equipo
4. Formación en autocuidado
5. Reuniones semanales con espacio emocional

**Evaluación tras 1 año:**
- Plan actualizado y conocido por 100% del equipo ✓
- Protocolos usados realmente (antes se "inventaba") ✓
- Reducción de bajas laborales del equipo (50% menos) ✓
- Mejora del clima laboral (encuesta satisfacción: de 3/5 a 4.5/5) ✓

**Aprendizaje:** La complejidad es enemiga del cumplimiento. Simplicidad y participación del equipo son claves.

### SECTOR CULTURAL - Escuela de Música

**Situación inicial:**
Escuela pequeña (3 profesores, 40 alumnos). Sin plan de protección formal (desconocimiento de la obligación).

**Proceso de implementación desde cero:**
1. Formación del director como Delegado de Protección
2. Elaboración de plan de protección simple y realista
3. Obtención de certificados de delitos sexuales
4. Reunión informativa con familias
5. Creación de código de conducta (límites contacto físico en clases de instrumento)
6. Protocolo específico para clases individuales (puerta con ventana, familias en sala de espera)

**Evaluación al año:**
- Cumplimiento normativo completo ✓
- 1 incidente gestionado correctamente (conflicto entre alumnos) ✓
- Familias valoran positivamente la profesionalidad ✓
- Renovación de matrículas aumenta (confianza) ✓

**Clave de éxito:** Adaptación del plan a la realidad de entidad pequeña (no copiar planes de grandes entidades).

### SECTOR SOCIOSANITARIO - Centro de Acogida de Menores

**Situación inicial:**
Centro especializado en menores con trauma. Evaluación detecta:
- Alto desgaste del equipo (burnout)
- Rotación de personal elevada (30% anual)
- Incidentes de contención física no documentados adecuadamente

**Plan de mejora integral:**
1. Supervisión profesional quincenal obligatoria (psicólogo externo)
2. Reducción de ratio (de 1:8 a 1:6)
3. Protocolo exhaustivo de contención física (solo en casos justificados, siempre documentado)
4. Formación en trauma y técnicas de desescalada
5. Rotación de turnos (evitar siempre los mismos en nocturnos)
6. Sala de autocuidado del equipo (espacio tranquilo para descansos)
7. Reconocimiento y valoración del trabajo (reuniones de celebración de logros)

**Evaluación a 2 años:**
- Rotación de personal reducida a 10% ✓
- Contenciones físicas reducidas 60% (mejores técnicas de desescalada) ✓
- 100% de contenciones documentadas ✓
- Mejora significativa en bienestar del equipo (encuesta) ✓
- Mejora en evolución de los menores (indicadores de centro) ✓

**Aprendizaje:** Cuidar al equipo mejora directamente la calidad de atención a menores.

## Conclusión

La evaluación, seguimiento y mejora continua no son obligaciones burocráticas, son la esencia de un plan de protección vivo y eficaz. Un plan que no se evalúa es un plan muerto, que no evoluciona ni se adapta a la realidad cambiante.

**Principios finales:**

1. **Medir para mejorar:** Lo que no se mide, no se puede mejorar.
2. **Participación:** El equipo debe ser protagonista de la mejora.
3. **Aprender de errores:** Cada incidente es una oportunidad de aprendizaje, no de culpabilización.
4. **Sencillez:** Sistemas complejos no se cumplen. Simplicidad y claridad son clave.
5. **Continuidad:** La mejora no es un proyecto puntual, es una cultura permanente.

**Mensaje final:**

La protección infantil es responsabilidad de todos, pero requiere sistemas que funcionen. Evaluar, aprender y mejorar continuamente es lo que convierte un documento en un plan real que protege vidas.

Cada mejora implementada, cada protocolo ajustado, cada formación realizada, cada indicador analizado, es un paso más hacia entornos verdaderamente seguros donde todos los menores puedan crecer sin violencia.

**La mejora continua no es perfección, es compromiso con hacer cada vez mejor las cosas.**

---

## ¡Enhorabuena!

Has completado los 6 módulos de formación como Delegado/a de Protección. Has adquirido conocimientos sobre:

✅ Marco legal LOPIVI y derechos de la infancia
✅ Identificación y prevención de situaciones de riesgo
✅ Protocolos de actuación y comunicación
✅ Trabajo con familias y participación comunitaria
✅ Autocuidado y bienestar del equipo
✅ Evaluación, seguimiento y mejora continua

**Próximo paso:** Realizar el test de evaluación para obtener tu certificado de formación.

**Recordar:**
> "Proteger a la infancia no es una tarea, es un compromiso. Cada día, con cada menor, construimos entornos más seguros. Tu formación es el primer paso de un camino de protección y cuidado que marca la diferencia."

¡Mucho éxito en tu labor como Delegado/a de Protección!
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

    const session = getSession()

    if (!session.token || isExpired()) {
      console.error('❌ [FORMACIÓN] Sesión inválida o expirada')
      alert('No se encontró sesión activa. Por favor, inicia sesión nuevamente.')
      router.push('/login')
      return
    }

    try {
      const parsed = {
        nombre: session.userName,
        entidad: session.entityName,
        id: session.userId,
        user_id: session.userId,
        entityId: session.entityId,
        role: session.role
      }
      console.log('📋 [FORMACIÓN] Sesión encontrada:', parsed)

      // Verificar que sea delegado o suplente (ambos pueden acceder a formación)
      const esAutorizado = session.role === 'DELEGADO' || session.role === 'SUPLENTE'

      if (!esAutorizado) {
        console.error('❌ [FORMACIÓN] Usuario no autorizado. Rol:', session.role)
        alert('Solo los delegados pueden acceder a la formación.\n\nRol actual: ' + (session.role || 'desconocido'))
        router.push('/login')
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
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }, 100)
      } else {
        console.log('🎉 [FORMACIÓN] Último módulo completado, volviendo a la lista para mostrar pantalla de completado')
        setModuloActual(null)
        // Scroll al inicio de la página
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }, 100)
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
