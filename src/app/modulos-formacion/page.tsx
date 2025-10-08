'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ModuloData {
  id: number;
  titulo: string;
  descripcion: string;
  contenido: string;
  tipoEntidad: string;
}

const modulosBase: ModuloData[] = [
  {
    id: 1,
    titulo: "Fundamentos de la LOPIVI y Marco Legal",
    descripcion: "Introducción a la Ley Orgánica de Protección Integral a la Infancia y la Adolescencia frente a la violencia",
    contenido: `# Módulo 1: Fundamentos de la LOPIVI y Marco Legal

## Introducción
La Ley Orgánica 8/2021, de 4 de junio, de protección integral a la infancia y la adolescencia frente a la violencia (LOPIVI), constituye un hito legislativo en España para la protección de los menores.

## Objetivos del Módulo
- Comprender el marco legal de la LOPIVI
- Identificar los principios fundamentales de protección infantil
- Conocer las obligaciones legales de las entidades
- Entender el rol del Delegado de Protección

## 1. Marco Legal y Normativo

### 1.1 Antecedentes Legislativos
La LOPIVI se desarrolla en cumplimiento de la Convención sobre los Derechos del Niño de 1989 y responde a las recomendaciones del Comité de los Derechos del Niño de Naciones Unidas.

### 1.2 Principios Fundamentales
- **Interés superior del menor**: Todas las decisiones deben priorizarlo
- **No discriminación**: Igualdad de trato independientemente de cualquier circunstancia
- **Derecho a la vida y desarrollo**: Garantizar condiciones para su desarrollo integral
- **Participación**: Derecho del menor a ser escuchado

### 1.3 Ámbito de Aplicación
La LOPIVI se aplica a todas las entidades que desarrollen actividades que impliquen contacto habitual con menores de edad, incluyendo:
- Centros educativos y de formación
- Entidades deportivas y de ocio
- Centros de protección y reforma
- Entidades religiosas
- Asociaciones y fundaciones

## 2. Obligaciones de las Entidades

### 2.1 Designación de Delegado de Protección
Todas las entidades deben designar un Delegado de Protección que:
- Promueva medidas de sensibilización y prevención
- Coordine los casos que se presenten
- Comunique a las autoridades competentes
- Identifique factores de riesgo y situaciones de violencia

### 2.2 Plan de Protección
Las entidades deben elaborar un Plan de Protección que incluya:
- Análisis del entorno y actividades
- Medidas de prevención y protección específicas
- Protocolos de actuación ante situaciones de riesgo
- Código de conducta del personal

### 2.3 Formación del Personal
Todo el personal debe recibir formación específica en:
- Derechos de la infancia
- Prevención de la violencia contra menores
- Detección de situaciones de riesgo
- Protocolos de actuación

## 3. Tipos de Violencia Identificados

### 3.1 Violencia Física
Cualquier acción no accidental que provoque daño físico o enfermedad.

### 3.2 Violencia Psicológica
Actos que produzcan desvalorización, sufrimiento o agresión psicológica.

### 3.3 Violencia Sexual
Cualquier acto de naturaleza sexual realizado sin consentimiento o cuando el menor no tiene capacidad para prestarlo.

### 3.4 Violencia por Negligencia
Falta de atención que prive al menor de elementos básicos para su desarrollo.

## 4. Factores de Riesgo y Protección

### 4.1 Factores de Riesgo
- Aislamiento del menor
- Falta de supervisión adecuada
- Espacios sin visibilidad
- Personal sin formación
- Ausencia de protocolos claros

### 4.2 Factores de Protección
- Supervisión constante y apropiada
- Espacios seguros y visibles
- Personal formado y sensibilizado
- Protocolos claros de actuación
- Participación de familias

## Conclusiones
La LOPIVI establece un marco integral para la protección de menores que requiere:
- Compromiso institucional
- Formación continua del personal
- Implementación de medidas preventivas
- Coordinación entre profesionales
- Evaluación y mejora continua

## Evaluación del Módulo
1. Identifique 3 situaciones de riesgo específicas en su entidad
2. Enumere las medidas de protección que implementaría
3. Diseñe un protocolo de comunicación para su entidad`,
    tipoEntidad: 'general'
  },
  {
    id: 2,
    titulo: "Identificación y Prevención de Situaciones de Riesgo",
    descripcion: "Herramientas específicas para detectar y prevenir situaciones de violencia contra menores en entidades deportivas y de ocio",
    contenido: `# Módulo 2: Identificación y Prevención de Situaciones de Riesgo

## Introducción
La prevención y detección temprana de situaciones de riesgo es fundamental para garantizar la protección efectiva de los menores. Este módulo proporciona herramientas prácticas específicas para diferentes tipos de entidades.

## Objetivos del Módulo
- Identificar señales de alerta y factores de riesgo específicos
- Desarrollar habilidades de observación y evaluación
- Implementar medidas preventivas efectivas según el tipo de entidad
- Crear entornos seguros y protectores

## 1. Señales de Alerta e Indicadores

### 1.1 Indicadores Físicos
- Lesiones inexplicables o inconsistentes con la explicación dada
- Lesiones en diferentes estados de curación
- Marcas de mordeduras, quemaduras o golpes
- Negligencia en la higiene personal
- Fatiga constante o problemas de sueño
- Quejas frecuentes de dolores sin causa médica

### 1.2 Indicadores Emocionales y Conductuales
- Cambios súbitos en el comportamiento
- Regresión a comportamientos de edades anteriores
- Miedo excesivo hacia adultos específicos
- Comportamiento sexual inapropiado para la edad
- Autolesiones o intentos de suicidio
- Problemas de concentración o rendimiento

## 2. Factores de Riesgo Específicos por Entorno

### 2.1 En Entidades Deportivas
#### Situaciones de Alto Riesgo:
- Entrenamientos individuales sin supervisión
- Vestuarios sin control de acceso
- Viajes y concentraciones deportivas
- Relaciones de poder entrenador-deportista
- Presión por rendimiento deportivo
- Contacto físico normalizado

#### Medidas Preventivas Deportivas:
- Política de "dos adultos" en entrenamientos
- Vestuarios con supervisión apropiada
- Protocolos claros para viajes
- Límites claros en el contacto físico
- Formación específica para entrenadores
- Código de conducta deportivo específico

### 2.2 En Entidades de Ocio y Tiempo Libre
#### Situaciones de Alto Riesgo:
- Actividades al aire libre con poca supervisión
- Campamentos y excursiones
- Actividades nocturnas
- Espacios de pernocta
- Actividades acuáticas
- Talleres en espacios cerrados

#### Medidas Preventivas en Ocio:
- Ratios adecuadas monitor-menor (1:8 máximo)
- Supervisión 24/7 en campamentos
- Protocolos de emergencia claros
- Espacios de descanso seguros
- Formación en primeros auxilios
- Control de acceso a instalaciones

## Conclusiones
La identificación y prevención de situaciones de riesgo requiere:
- Formación específica por tipo de entidad
- Protocolos adaptados a cada actividad
- Observación sistemática y documentación
- Coordinación entre profesionales
- Evaluación y mejora continua`,
    tipoEntidad: 'general'
  },
  {
    id: 3,
    titulo: "Protocolos de Actuación y Comunicación",
    descripcion: "Procedimientos específicos para la gestión de casos y comunicación efectiva según el tipo de entidad",
    contenido: `# Módulo 3: Protocolos de Actuación y Comunicación

## Introducción
Los protocolos de actuación constituyen la herramienta fundamental para garantizar una respuesta eficaz, coordinada y profesional ante situaciones de riesgo o maltrato. Este módulo detalla los procedimientos específicos adaptados a diferentes tipos de entidades.

## Objetivos del Módulo
- Dominar los protocolos de actuación específicos
- Desarrollar habilidades de comunicación efectiva
- Establecer canales de coordinación apropiados
- Garantizar el cumplimiento de obligaciones legales

## 1. Protocolo General de Actuación

### 1.1 Principios Fundamentales
- **Protección inmediata** del menor
- **Respuesta rápida** y coordinada
- **Confidencialidad** y privacidad
- **Documentación** completa y precisa
- **Seguimiento** continuo del caso

### 1.2 Fases del Protocolo
1. **Detección/Revelación**
2. **Evaluación inicial**
3. **Protección inmediata**
4. **Comunicación**
5. **Seguimiento**
6. **Evaluación final**

## 2. Protocolos Específicos por Tipo de Entidad

### 2.1 Protocolos para Entidades Deportivas

#### Durante Entrenamientos:
**Protocolo Específico:**
1. **Detención inmediata** de la actividad si hay riesgo presente
2. **Separación discreta** del menor del posible agresor
3. **Comunicación inmediata** con el delegado de protección
4. **Documentación** de la situación observada
5. **Comunicación con familia** si es seguro
6. **Seguimiento** médico si es necesario

### 2.2 Protocolos para Entidades de Ocio

#### Durante Actividades Diarias:
**Protocolo Específico:**
1. **Observación discreta** y documentación
2. **Comunicación inmediata** con coordinador
3. **Evaluación con otros monitores** presentes
4. **Activación de protocolo** según gravedad
5. **Comunicación apropiada** con menor
6. **Seguimiento continuo** durante la actividad

## Conclusiones
Los protocolos de actuación y comunicación deben ser:
- **Específicos** para cada tipo de entidad
- **Claros** y fáciles de aplicar
- **Conocidos** por todo el personal
- **Practicados** regularmente
- **Actualizados** según experiencia`,
    tipoEntidad: 'general'
  },
  {
    id: 4,
    titulo: "Trabajo con Familias y Participación Comunitaria",
    descripcion: "Estrategias para involucrar a las familias y la comunidad en la protección infantil según el tipo de entidad",
    contenido: `# Módulo 4: Trabajo con Familias y Participación Comunitaria

## Introducción
El trabajo efectivo con familias y la participación comunitaria son elementos fundamentales para el éxito de cualquier programa de protección infantil. Este módulo aborda las estrategias específicas para involucrar a las familias y la comunidad en la protección de menores.

## Objetivos del Módulo
- Desarrollar estrategias de comunicación efectiva con familias
- Fomentar la participación activa de padres y tutores
- Crear redes de apoyo comunitario
- Establecer canales de información y prevención

## 1. Comunicación Efectiva con Familias

### 1.1 Principios de Comunicación
- **Transparencia**: Información clara y honesta
- **Respeto**: Valorar la diversidad cultural y familiar
- **Confidencialidad**: Proteger la privacidad familiar
- **Participación**: Involucrar activamente a las familias
- **Empatía**: Comprender las perspectivas familiares

### 1.2 Estrategias de Comunicación por Tipo de Entidad

#### En Entidades Deportivas:
- **Reuniones informativas**: Presentación de políticas de protección
- **Comunicación de resultados**: Informes sobre progreso deportivo y bienestar
- **Canales directos**: WhatsApp, email para comunicación rápida
- **Sesiones de feedback**: Espacios para escuchar preocupaciones familiares
- **Participación en eventos**: Invitación a entrenamientos y competiciones

#### En Entidades de Ocio:
- **Orientaciones familiares**: Sesiones informativas antes de actividades
- **Comunicación diaria**: Informes sobre actividades y bienestar
- **Visitas familiares**: Días de puertas abiertas
- **Talleres educativos**: Formación en protección infantil para padres
- **Redes sociales**: Comunicación visual del día a día

## 2. Participación Activa de las Familias

### 2.1 Niveles de Participación

#### Nivel Informativo:
- Recepción de información sobre políticas
- Conocimiento de protocolos de seguridad
- Acceso a recursos educativos

#### Nivel Consultivo:
- Participación en encuestas de satisfacción
- Consultas sobre cambios en políticas
- Feedback sobre servicios

## Conclusiones
El trabajo efectivo con familias y comunidades requiere:
- Estrategias de comunicación adaptadas
- Respeto a la diversidad cultural
- Construcción gradual de confianza
- Participación activa y significativa
- Evaluación y mejora continua`,
    tipoEntidad: 'general'
  },
  {
    id: 5,
    titulo: "Autocuidado y Bienestar del Personal",
    descripcion: "Estrategias para el cuidado del bienestar físico y emocional del personal que trabaja en protección infantil",
    contenido: `# Módulo 5: Autocuidado y Bienestar del Personal

## Introducción
El trabajo en protección infantil puede generar un alto nivel de estrés y desgaste emocional en el personal. Este módulo aborda las estrategias necesarias para mantener el bienestar físico y emocional de quienes trabajan directamente con menores.

## Objetivos del Módulo
- Reconocer los factores de riesgo para el bienestar del personal
- Desarrollar estrategias de autocuidado personal y profesional
- Implementar sistemas de apoyo organizacional
- Prevenir el burnout y el trauma vicario

## 1. Factores de Riesgo y Estrés Laboral

### 1.1 Fuentes de Estrés Específicas

#### En Entidades Deportivas:
- **Presión por resultados**: Demandas de rendimiento competitivo
- **Responsabilidad legal**: Temor a demandas o acusaciones
- **Conflictos con padres**: Expectativas irreales o críticas constantes
- **Decisiones rápidas**: Necesidad de actuar bajo presión
- **Horarios irregulares**: Entrenamientos, competiciones y viajes

#### En Entidades de Ocio:
- **Supervisión constante**: Vigilancia continua de grupos grandes
- **Actividades de riesgo**: Responsabilidad en actividades al aire libre
- **Diversidad de necesidades**: Atender diferentes edades y necesidades
- **Situaciones imprevistas**: Manejo de emergencias y conflictos
- **Estacionalidad**: Intensidad variable según temporadas

## 2. Trauma Vicario y Burnout

### 2.1 Trauma Vicario
El trauma vicario es el estrés emocional que resulta de la exposición a los traumas de otros, especialmente cuando se trabaja con víctimas de abuso o maltrato.

### 2.2 Síndrome de Burnout
#### Componentes del Burnout:
- **Agotamiento emocional**: Sensación de estar emocionalmente drenado
- **Despersonalización**: Actitudes cínicas hacia menores y familias
- **Reducción de logro personal**: Sentimiento de incompetencia profesional

## 3. Estrategias de Autocuidado Personal

### 3.1 Cuidado Físico
- Ejercicio regular
- Nutrición adecuada
- Descanso y sueño apropiado

### 3.2 Cuidado Emocional
- Gestión del estrés
- Relaciones sociales saludables
- Actividades de disfrute

## Conclusiones
El autocuidado del personal es esencial para:
- Mantener la calidad del servicio a menores
- Prevenir el agotamiento y burnout
- Garantizar la sostenibilidad profesional
- Promover el bienestar integral
- Crear ambientes laborales saludables`,
    tipoEntidad: 'general'
  },
  {
    id: 6,
    titulo: "Evaluación, Seguimiento y Mejora Continua",
    descripcion: "Metodologías para evaluar la efectividad de los programas de protección infantil y implementar mejoras continuas",
    contenido: `# Módulo 6: Evaluación, Seguimiento y Mejora Continua

## Introducción
La evaluación sistemática y la mejora continua son elementos fundamentales para garantizar la efectividad de los programas de protección infantil. Este módulo proporciona las herramientas necesarias para medir, evaluar y mejorar continuamente la calidad de los servicios.

## Objetivos del Módulo
- Desarrollar sistemas de evaluación integral
- Implementar metodologías de seguimiento efectivas
- Establecer procesos de mejora continua
- Crear indicadores de calidad específicos

## 1. Fundamentos de la Evaluación

### 1.1 Tipos de Evaluación

#### Evaluación Formativa:
- **Propósito**: Mejora durante la implementación
- **Características**: Continua, diagnóstica, orientada al proceso
- **Beneficios**: Permite ajustes en tiempo real

#### Evaluación Sumativa:
- **Propósito**: Valorar resultados finales
- **Características**: Al final del programa, orientada a resultados
- **Beneficios**: Determina efectividad general

## 2. Indicadores de Calidad Específicos

### 2.1 Para Entidades Deportivas
- **Tasa de incidentes**: Número de incidentes por 1000 horas de actividad
- **Tiempo de respuesta**: Tiempo promedio de respuesta a emergencias
- **Satisfacción del deportista**: Escalas de satisfacción y bienestar
- **Retención**: Tasa de permanencia en la actividad deportiva

### 2.2 Para Entidades de Ocio
- **Ratio monitor-menor**: Cumplimiento de ratios establecidas
- **Formación del personal**: Porcentaje de personal formado en protección
- **Participación activa**: Nivel de involucramiento en actividades
- **Desarrollo social**: Mejora en habilidades sociales y relacionales

## 3. Mejora Continua

### 3.1 Ciclo PDCA (Plan-Do-Check-Act)

#### Planificar (Plan):
- Identificación de oportunidades de mejora
- Análisis de causas raíz
- Diseño de intervenciones
- Establecimiento de metas

#### Hacer (Do):
- Implementación piloto
- Capacitación del personal
- Ajuste de procedimientos
- Documentación de cambios

## Conclusiones
La evaluación y mejora continua son esenciales para:
- Garantizar la calidad de los servicios
- Demostrar efectividad e impacto
- Identificar oportunidades de mejora
- Mantener la confianza de stakeholders
- Cumplir con estándares profesionales`,
    tipoEntidad: 'general'
  }
];

export default function ModulosFormacionPage() {
  const router = useRouter();
  const [modulosCompletados, setModulosCompletados] = useState<number[]>([]);
  const [moduloActual, setModuloActual] = useState<ModuloData | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuario, setUsuario] = useState<any>(null);
  const [tipoEntidad, setTipoEntidad] = useState('general');

  useEffect(() => {
    // Verificar si hay usuario autenticado
    const userData = localStorage.getItem('userData');
    if (!userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);
    setUsuario(user);

    // Obtener tipo de entidad de la sesión
    const entidadData = localStorage.getItem('entidadData');
    if (entidadData) {
      const entidad = JSON.parse(entidadData);
      setTipoEntidad(entidad.tipo_entidad || 'general');
    }

    // Cargar progreso desde localStorage
    const progreso = localStorage.getItem('modulosProgreso');
    if (progreso) {
      setModulosCompletados(JSON.parse(progreso));
    }
  }, [router]);

  const marcarModuloCompletado = (moduloId: number) => {
    const nuevosCompletados = [...modulosCompletados];
    if (!nuevosCompletados.includes(moduloId)) {
      nuevosCompletados.push(moduloId);
      setModulosCompletados(nuevosCompletados);
      localStorage.setItem('modulosProgreso', JSON.stringify(nuevosCompletados));
    }
    setMostrarModal(false);

    // Si se completaron todos los módulos principales (1-6), redirigir al test
    if (nuevosCompletados.length >= 6) {
      router.push('/test-evaluacion-principal');
    }
  };

  const abrirModulo = (modulo: ModuloData) => {
    // Verificar acceso secuencial
    if (modulo.id > 1) {
      const moduloAnteriorCompletado = modulosCompletados.includes(modulo.id - 1);
      if (!moduloAnteriorCompletado) {
        alert(`Debe completar el Módulo ${modulo.id - 1} antes de acceder a este módulo.`);
        return;
      }
    }

    setModuloActual(modulo);
    setMostrarModal(true);
  };

  const descargarModulo = (modulo: ModuloData) => {
    const blob = new Blob([modulo.contenido], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Modulo_${modulo.id}_${modulo.titulo.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const imprimirModulo = () => {
    if (moduloActual) {
      const ventanaImpresion = window.open('', '_blank');
      if (ventanaImpresion) {
        ventanaImpresion.document.write(`
          <html>
            <head>
              <title>${moduloActual.titulo}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #2563eb; }
                h2 { color: #1e40af; }
                h3 { color: #1e3a8a; }
                p { line-height: 1.6; }
                ul, ol { line-height: 1.6; }
              </style>
            </head>
            <body>
              <div style="white-space: pre-wrap;">${moduloActual.contenido}</div>
            </body>
          </html>
        `);
        ventanaImpresion.document.close();
        ventanaImpresion.print();
      }
    }
  };

  const obtenerEstadoModulo = (moduloId: number) => {
    if (modulosCompletados.includes(moduloId)) {
      return 'completado';
    } else if (moduloId === 1 || modulosCompletados.includes(moduloId - 1)) {
      return 'disponible';
    } else {
      return 'bloqueado';
    }
  };

  const filtrarModulos = () => {
    return modulosBase.filter(modulo =>
      modulo.tipoEntidad === 'general' || modulo.tipoEntidad === tipoEntidad
    );
  };

  if (!usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Módulos de Formación Custodia360
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Formación integral en protección infantil adaptada a su tipo de entidad
          </p>
        </div>

        {/* Información de la formación */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Información de la Formación</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Modalidad de Estudio</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Formación online autodirigida</li>
                <li>• Progreso secuencial obligatorio</li>
                <li>• Contenido adaptado a su tipo de entidad</li>
                <li>• Certificación al completar todos los módulos</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Recursos Disponibles</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Descarga de módulos para estudio offline</li>
                <li>• Opción de impresión</li>
                <li>• Seguimiento automático del progreso</li>
                <li>• Test de evaluación final</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Instrucciones para la Formación</h3>
          <div className="space-y-3 text-blue-800">
            <p><strong>1. Lectura Secuencial:</strong> Debe leer los módulos en orden. No podrá acceder al siguiente hasta completar el anterior.</p>
            <p><strong>2. Estudio del Contenido:</strong> Haga clic en "Leer Módulo" para acceder al contenido completo de cada módulo.</p>
            <p><strong>3. Recursos de Estudio:</strong> Puede descargar cada módulo para estudiarlo offline o imprimirlo para su comodidad.</p>
            <p><strong>4. Finalización:</strong> Una vez completados todos los módulos, podrá realizar el test de evaluación para obtener su certificación.</p>
          </div>
        </div>

        {/* Progreso general */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Progreso de Formación</h2>
          <div className="flex items-center mb-2">
            <div className="flex-1 bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${(modulosCompletados.length / 6) * 100}%` }}
              ></div>
            </div>
            <span className="ml-4 text-sm font-medium text-gray-700">
              {modulosCompletados.length}/6 módulos completados
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {modulosCompletados.length === 6
              ? "¡Felicitaciones! Ha completado todos los módulos. Puede proceder al test de evaluación."
              : `Progreso: ${Math.round((modulosCompletados.length / 6) * 100)}% completado`
            }
          </p>
        </div>

        {/* Grid de módulos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filtrarModulos().map((modulo) => {
            const estado = obtenerEstadoModulo(modulo.id);

            return (
              <div key={modulo.id} className={`bg-white rounded-lg shadow-lg p-6 border-2 transition-all duration-200 ${
                estado === 'completado'
                  ? 'border-green-200 bg-green-50'
                  : estado === 'disponible'
                  ? 'border-blue-200 hover:border-blue-300 hover:shadow-xl'
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    estado === 'completado'
                      ? 'bg-green-100 text-green-800'
                      : estado === 'disponible'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    Módulo {modulo.id}
                  </span>
                  {estado === 'completado' && (
                    <span className="text-green-600 text-sm font-medium">✓ Completado</span>
                  )}
                  {estado === 'bloqueado' && (
                    <span className="text-gray-400 text-sm">🔒 Bloqueado</span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {modulo.titulo}
                </h3>

                <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                  {modulo.descripcion}
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => abrirModulo(modulo)}
                    disabled={estado === 'bloqueado'}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      estado === 'bloqueado'
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : estado === 'completado'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {estado === 'completado' ? 'Revisar Módulo' : 'Leer Módulo'}
                  </button>

                  <button
                    onClick={() => descargarModulo(modulo)}
                    disabled={estado === 'bloqueado'}
                    className={`w-full py-2 px-4 rounded-lg font-medium border transition-colors ${
                      estado === 'bloqueado'
                        ? 'border-gray-200 text-gray-500 cursor-not-allowed'
                        : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    Descargar Módulo
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Botón de continuar al test */}
        {modulosCompletados.length >= 6 && (
          <div className="text-center">
            <button
              onClick={() => router.push('/test-evaluacion-principal')}
              className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors"
            >
              Continuar al Test de Evaluación
            </button>
          </div>
        )}

        {/* Modal de módulo */}
        {mostrarModal && moduloActual && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen flex flex-col">
              {/* Header del modal */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">
                  {moduloActual.titulo}
                </h2>
                <button
                  onClick={() => setMostrarModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Contenido del modal */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                    {moduloActual.contenido}
                  </div>
                </div>
              </div>

              {/* Footer del modal */}
              <div className="flex flex-wrap gap-4 p-6 border-t bg-gray-50">
                <button
                  onClick={imprimirModulo}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Imprimir
                </button>
                <button
                  onClick={() => descargarModulo(moduloActual)}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Descargar
                </button>
                <button
                  onClick={() => marcarModuloCompletado(moduloActual.id)}
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Marcar como Completado
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
