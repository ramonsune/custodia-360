'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'

interface FAQ {
  id: string
  pregunta: string
  respuesta: string
  categoria: string
}

const faqs: FAQ[] = [
  // LOPIVI y Normativa
  {
    id: 'lopivi-1',
    categoria: 'LOPIVI y Normativa',
    pregunta: '¿Qué es la LOPIVI y por qué es obligatoria?',
    respuesta: 'La LOPIVI (Ley Orgánica de Protección Integral a la Infancia y la Adolescencia frente a la Violencia) es obligatoria desde junio de 2021 para todas las entidades que trabajan con menores. Establece medidas de protección integral contra cualquier forma de violencia hacia menores, incluyendo la designación de un Delegado de Protección y la implementación de protocolos específicos.'
  },
  {
    id: 'lopivi-2',
    categoria: 'LOPIVI y Normativa',
    pregunta: '¿Qué entidades deben cumplir la LOPIVI?',
    respuesta: 'Todas las entidades que trabajen con menores: clubes deportivos, colegios, guarderías, campamentos, academias, centros de ocio, parroquias, catequesis, ONGs, ludotecas, centros terapéuticos, asociaciones juveniles, etc. Si tu entidad tiene contacto regular con menores de edad, debe cumplir la LOPIVI.'
  },
  {
    id: 'lopivi-3',
    categoria: 'LOPIVI y Normativa',
    pregunta: '¿Cuáles son las sanciones por no cumplir la LOPIVI?',
    respuesta: 'Las sanciones van desde 10.000€ hasta 1.000.000€ dependiendo de la gravedad del incumplimiento. Además, puede conllevar el cierre temporal o definitivo de la entidad. En 2021-2024 se han realizado 2.847 inspecciones y el 73% de las entidades inspeccionadas han recibido multas por incumplimiento.'
  },
  {
    id: 'lopivi-4',
    categoria: 'LOPIVI y Normativa',
    pregunta: '¿Qué es un Plan de Protección Infantil?',
    respuesta: 'Es el documento fundamental que exige la LOPIVI. Incluye protocolos de actuación, código de conducta, formación del personal, procedimientos de comunicación de situaciones de riesgo, y medidas de protección específicas para tu entidad. Debe estar adaptado a tu tipo de actividad y ser accesible a todo el personal.'
  },

  // Custodia360 y Servicio
  {
    id: 'custodia-1',
    categoria: 'Custodia360 y Servicio',
    pregunta: '¿Qué es Custodia360 exactamente?',
    respuesta: 'Custodia360 es la primera empresa de España con un sistema completamente automatizado para el cumplimiento de la LOPIVI. Te ayudamos a implementar toda la normativa en 72 horas: Plan de Protección personalizado, formación y certificación del delegado, protocolos de actuación, y dashboard de gestión 24/7.'
  },
  {
    id: 'custodia-2',
    categoria: 'Custodia360 y Servicio',
    pregunta: '¿En qué se diferencia Custodia360 de otros servicios?',
    respuesta: 'Somos los únicos con un sistema 100% automatizado. Mientras otros requieren meses de trabajo manual, nosotros implementamos todo en 72 horas. Además, incluimos dashboard online, actualizaciones automáticas de normativa, formación virtual del delegado, y soporte técnico continuo.'
  },
  {
    id: 'custodia-3',
    categoria: 'Custodia360 y Servicio',
    pregunta: '¿Realmente puedo tener todo listo en 72 horas?',
    respuesta: 'Sí, garantizado. En 10 minutos completas la contratación, en 24 horas generamos tu Plan de Protección personalizado, y en 72 horas tu delegado está formado y certificado. Tu entidad queda completamente conforme con la LOPIVI en ese plazo.'
  },
  {
    id: 'custodia-4',
    categoria: 'Custodia360 y Servicio',
    pregunta: '¿Qué incluye exactamente el servicio?',
    respuesta: 'TODO lo necesario para cumplir la LOPIVI: Plan de Protección personalizado, formación y certificación del delegado/suplente, protocolos de actuación, código de conducta, dashboard online 24/7, y actualizaciones automáticas.'
  },

  // Delegado de Protección
  {
    id: 'delegado-1',
    categoria: 'Delegado de Protección',
    pregunta: '¿Quién puede ser Delegado de Protección?',
    respuesta: 'Cualquier persona mayor de edad vinculada a tu entidad: entrenadores, profesores, coordinadores, directores, párrocos, catequistas, monitores, administradores, etc. Nosotros nos encargamos de formarle y certificarle según los requisitos de la LOPIVI.'
  },
  {
    id: 'delegado-2',
    categoria: 'Delegado de Protección',
    pregunta: '¿Es obligatorio tener un delegado suplente?',
    respuesta: 'La ley no especifica la obligatoriedad del suplente, pero es altamente recomendable para garantizar la continuidad de la protección. En Custodia360 incluimos la formación del suplente sin coste adicional en todos nuestros planes.'
  },
  {
    id: 'delegado-3',
    categoria: 'Delegado de Protección',
    pregunta: '¿Qué formación recibe el delegado?',
    respuesta: 'Formación especializada de 20 horas en nuestro campus virtual: fundamentos LOPIVI, detección de situaciones de riesgo, protocolos de actuación, comunicación con menores, gestión de casos, marco legal, y uso del dashboard. Al finalizar recibe certificación oficial.'
  },
  {
    id: 'delegado-4',
    categoria: 'Delegado de Protección',
    pregunta: '¿Puede el delegado ser la misma persona que contrata?',
    respuesta: 'Sí, es muy común. El director, coordinador, párroco o responsable de la entidad puede ser tanto quien contrata como quien actúa como Delegado de Protección. Nosotros adaptamos la formación a su rol específico.'
  },

  // Planes y Precios
  {
    id: 'planes-1',
    categoria: 'Planes y Precios',
    pregunta: '¿Cuánto cuesta cumplir la LOPIVI con Custodia360?',
    respuesta: 'Nuestros planes van desde 38€ (1-100 menores) hasta 500€ (+501 menores), con pago único anual. Incluye TODO: Plan de Protección, formación delegado, dashboard, actualizaciones y soporte. Sin costes ocultos ni sorpresas.'
  },
  {
    id: 'planes-2',
    categoria: 'Planes y Precios',
    pregunta: '¿El pago es mensual o anual?',
    respuesta: 'El pago es anual, lo que te permite tener un coste fijo y predecible. Incluye todo el servicio durante 12 meses: dashboard activo, actualizaciones automáticas, soporte técnico, y renovación de certificaciones.'
  },
  {
    id: 'planes-3',
    categoria: 'Planes y Precios',
    pregunta: '¿Hay costes adicionales ocultos?',
    respuesta: 'No, nunca. El precio que ves es el precio final. Incluye formación del delegado y suplente, todas las actualizaciones, soporte técnico, generación de documentos, y cualquier cambio en la normativa durante el año.'
  },
  {
    id: 'planes-4',
    categoria: 'Planes y Precios',
    pregunta: '¿Qué plan necesito para mi entidad?',
    respuesta: 'Depende del número de menores con los que trabajáis: Plan 100 (1-100 menores - 38€), Plan 200 (101-250 menores - 78€), Plan 500 (251-500 menores - 210€), Plan 500+ (más de 501 menores - 500€). También tenemos Custodia Temporal para eventos (100€).'
  },

  // Proceso y Contratación
  {
    id: 'proceso-1',
    categoria: 'Proceso y Contratación',
    pregunta: '¿Cómo es el proceso de contratación?',
    respuesta: 'Súper simple: 1) Eliges tu plan según número de menores, 2) Completas un formulario de 10 minutos con datos básicos, 3) Realizas el pago, y 4) En 72 horas tienes todo listo. Nosotros nos encargamos del resto automáticamente.'
  },
  {
    id: 'proceso-2',
    categoria: 'Proceso y Contratación',
    pregunta: '¿Qué datos necesitáis de mi entidad?',
    respuesta: 'Solo los básicos: nombre de la entidad, CIF, dirección, contacto principal, tipo de actividad, y datos del delegado designado. Durante la configuración completaremos algunos detalles específicos para personalizar tu Plan de Protección.'
  },
  {
    id: 'proceso-3',
    categoria: 'Proceso y Contratación',
    pregunta: '¿Puedo cambiar de plan después de contratar?',
    respuesta: 'Sí, puedes actualizar tu plan en cualquier momento si tu entidad crece o cambian tus necesidades. La diferencia de precio se prorratea y los cambios se aplican inmediatamente en tu dashboard.'
  },


  // Dashboard y Tecnología
  {
    id: 'tech-1',
    categoria: 'Dashboard y Tecnología',
    pregunta: '¿Qué es el dashboard de Custodia360?',
    respuesta: 'Es tu centro de control online disponible 24/7. Desde ahí gestionas casos, consultas protocolos, recibes alertas, generas informes, accedes a la formación, y mantienes todo actualizado. Funciona en móvil, tablet y ordenador.'
  },
  {
    id: 'tech-2',
    categoria: 'Dashboard y Tecnología',
    pregunta: '¿Necesito instalar algún software?',
    respuesta: 'No, todo funciona desde tu navegador web. Custodia360 es 100% online, sin instalaciones, sin actualizaciones manuales. Solo necesitas conexión a internet para acceder desde cualquier dispositivo.'
  },
  {
    id: 'tech-3',
    categoria: 'Dashboard y Tecnología',
    pregunta: '¿Los datos están seguros?',
    respuesta: 'Absolutamente. Utilizamos encriptación bancaria, servidores seguros en la UE, backups automáticos, y cumplimos RGPD. Los datos de menores tienen protección especial y solo accede personal autorizado de tu entidad.'
  },
  {
    id: 'tech-4',
    categoria: 'Dashboard y Tecnología',
    pregunta: '¿Funciona en móviles y tablets?',
    respuesta: 'Sí, perfectamente. El dashboard está optimizado para todos los dispositivos. Puedes gestionar casos, consultar protocolos, recibir alertas y acceder a toda la información desde tu móvil en cualquier momento.'
  },

  // Casos Prácticos
  {
    id: 'casos-1',
    categoria: 'Casos Prácticos',
    pregunta: '¿Qué hago si detecto una situación de riesgo?',
    respuesta: 'El dashboard te guía paso a paso: 1) Registra el caso inmediatamente, 2) El sistema te indica el protocolo específico a seguir, 3) Te conecta con los recursos necesarios, 4) Genera automáticamente la documentación, y 5) Te da seguimiento del caso.'
  },
  {
    id: 'casos-2',
    categoria: 'Casos Prácticos',
    pregunta: '¿Cuándo debo contactar con las autoridades?',
    respuesta: 'El dashboard te indica exactamente cuándo y cómo contactar con servicios sociales, policía o fiscalía según el tipo de caso. Incluye teléfonos de emergencia, formularios automáticos, y protocolos específicos para cada situación.'
  },
  {
    id: 'casos-3',
    categoria: 'Casos Prácticos',
    pregunta: '¿Puedo consultar casos anteriores?',
    respuesta: 'Sí, el dashboard mantiene un historial completo de todos los casos gestionados, con total confidencialidad. Puedes consultar protocolos aplicados, seguimientos realizados, y documentación generada para referencia futura.'
  },
  {
    id: 'casos-4',
    categoria: 'Casos Prácticos',
    pregunta: '¿Qué pasa si llega una inspección?',
    respuesta: 'Estás completamente preparado. El dashboard genera instantáneamente todos los documentos necesarios: Plan de Protección actualizado, certificaciones del delegado, registro de casos, protocolos aplicados, y evidencias de cumplimiento.'
  },

  // Soporte y Actualizaciones
  {
    id: 'soporte-1',
    categoria: 'Soporte y Actualizaciones',
    pregunta: '¿Qué soporte técnico ofrecéis?',
    respuesta: 'Soporte completo incluido en todos los planes: chat online, email de soporte, y documentación completa.'
  },
  {
    id: 'soporte-2',
    categoria: 'Soporte y Actualizaciones',
    pregunta: '¿Se actualiza automáticamente con cambios en la ley?',
    respuesta: 'Sí, completamente automático. Monitoreamos continuamente cambios en la normativa LOPIVI y actualizamos automáticamente tu Plan de Protección, protocolos, y formación. Recibes notificación de todos los cambios aplicados.'
  },

  {
    id: 'soporte-4',
    categoria: 'Soporte y Actualizaciones',
    pregunta: '¿Hay formación continua para el delegado?',
    respuesta: 'Sí, incluimos actualizaciones de formación cuando hay cambios normativos, nuevos casos tipo, o mejores prácticas. El delegado mantiene su certificación actualizada automáticamente.'
  },

  // Situaciones Específicas
  {
    id: 'especificas-1',
    categoria: 'Situaciones Específicas',
    pregunta: '¿Funciona para entidades religiosas como parroquias?',
    respuesta: 'Por supuesto. Tenemos experiencia específica con parroquias, catequesis, grupos pastorales juveniles, y comunidades religiosas. El Plan de Protección se adapta a las actividades específicas como catequesis, campamentos, grupos de jóvenes, etc.'
  },
  {
    id: 'especificas-2',
    categoria: 'Situaciones Específicas',
    pregunta: '¿Sirve para centros educativos y colegios?',
    respuesta: 'Sí, completamente. Adaptamos el Plan de Protección al entorno educativo: aulas, recreos, actividades extraescolares, excursiones, comedores, etc. Incluye protocolos específicos para profesores, personal de apoyo, y tutores.'
  },
  {
    id: 'especificas-3',
    categoria: 'Situaciones Específicas',
    pregunta: '¿Qué pasa con entidades que organizan eventos temporales?',
    respuesta: 'Tenemos Custodia Temporal (100€) específicamente para campamentos de verano, eventos deportivos, colonias, actividades puntuales, etc. Incluye Plan de Protección temporal y formación express del responsable.'
  },
  {
    id: 'especificas-4',
    categoria: 'Situaciones Específicas',
    pregunta: '¿Funciona para ONGs y asociaciones?',
    respuesta: 'Perfectamente. Muchas ONGs, asociaciones juveniles, fundaciones, y organizaciones de voluntariado ya confían en nosotros. Adaptamos protocolos a actividades de voluntariado, programas sociales, y trabajo comunitario con menores.'
  }
]

const categorias = [
  'Todas',
  'LOPIVI y Normativa',
  'Custodia360 y Servicio',
  'Delegado de Protección',
  'Planes y Precios',
  'Proceso y Contratación',
  'Dashboard y Tecnología',
  'Casos Prácticos',
  'Soporte y Actualizaciones',
  'Situaciones Específicas'
]

export default function FAQsPage() {
  const [categoriaActiva, setCategoriaActiva] = useState('Todas')
  const [faqAbierta, setFaqAbierta] = useState<string | null>(null)

  const faqsFiltradas = categoriaActiva === 'Todas'
    ? faqs
    : faqs.filter(faq => faq.categoria === categoriaActiva)

  const toggleFaq = (id: string) => {
    setFaqAbierta(faqAbierta === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Preguntas Frecuentes
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Resolvemos todas tus dudas sobre Custodia360, la LOPIVI, el proceso de implementación,
              y cómo proteger a los menores en tu entidad
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contratar/datos-entidad"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                Empezar Ahora
              </Link>
              <Link
                href="/contacto"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Consulta Personalizada
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación por Categorías */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2">
            {categorias.map((categoria) => (
              <button
                key={categoria}
                onClick={() => setCategoriaActiva(categoria)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  categoriaActiva === categoria
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {categoria}
              </button>
            ))}
          </div>
          <div className="mt-3 text-sm text-gray-600">
            Mostrando {faqsFiltradas.length} pregunta{faqsFiltradas.length !== 1 ? 's' : ''}
            {categoriaActiva !== 'Todas' && ` en "${categoriaActiva}"`}
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-4">
          {faqsFiltradas.map((faq) => (
            <div key={faq.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <button
                className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                onClick={() => toggleFaq(faq.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {faq.pregunta}
                    </h3>
                    <span className="text-sm text-blue-600 font-medium">
                      {faq.categoria}
                    </span>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    {faqAbierta === faq.id ? (
                      <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </button>

              {faqAbierta === faq.id && (
                <div className="px-6 pb-4">
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.respuesta}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">
            ¿No encuentras la respuesta que buscas?
          </h2>
          <p className="text-blue-100 mb-6">
            Nuestro equipo de expertos en LOPIVI está aquí para ayudarte con cualquier duda específica
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contacto"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              Contactar con Expertos
            </Link>
            <a
              href="tel:+34678771198"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Llamar: 678 771 198
            </a>
          </div>
        </div>

        {/* Enlaces útiles */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Recursos Adicionales
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/guia" className="text-blue-600 hover:text-blue-800 font-medium">
                  Guía Completa LOPIVI
                </Link>
              </li>
              <li>
                <a
                  href="https://www.boe.es/buscar/doc.php?id=BOE-A-2021-9347"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Ley LOPIVI en el BOE
                </a>
              </li>
              <li>
                <Link href="/planes" className="text-blue-600 hover:text-blue-800 font-medium">
                  Ver Todos los Planes
                </Link>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Comienza Ya
            </h3>
            <p className="text-gray-600 mb-4">
              Implementa la LOPIVI en tu entidad en solo 72 horas
            </p>
            <Link
              href="/contratar/datos-entidad"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors inline-block"
            >
              Contratar Custodia360
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
