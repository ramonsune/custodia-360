'use client'

import { useState } from 'react'

export default function GuiaPage() {
  // URLs públicas de Supabase Storage
  const URL_GUIA_LOPIVI = 'https://gkoyqfusawhnobvkoijc.supabase.co/storage/v1/object/public/docs/guias/guia-lopivi-completa.pdf'
  const URL_GUIA_PLAN = 'https://gkoyqfusawhnobvkoijc.supabase.co/storage/v1/object/public/docs/guias/guia-plan-de-proteccion.pdf'

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-700 mb-6">
            Guía <span className="text-blue-800">LOPIVI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Todo lo que necesitas saber para implementar y cumplir la LOPIVI en tu entidad y tener un plan de protección
          </p>
          <p className="text-lg text-gray-500 mb-8">
            Documentación técnica especializada para el cumplimiento normativo
          </p>
        </div>
      </section>

      {/* Roles dentro de las entidades */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Roles dentro de las Entidades</h2>
            <p className="text-xl text-gray-600">Cada persona tiene un papel específico en la protección infantil</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Delegado/a Principal */}
            <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Delegado/a Principal</h3>
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                <li>• Responsabilidad máxima de protección</li>
                <li>• Coordinación general del sistema</li>
                <li>• Comunicación con autoridades</li>
                <li>• Supervisión de protocolos</li>
                <li>• Formación obligatoria LOPIVI</li>
              </ul>
            </div>

            {/* Delegado/a Suplente */}
            <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16,4C18.11,4 19.82,5.69 19.82,7.8C19.82,9.91 18.11,11.6 16,11.6C13.89,11.6 12.18,9.91 12.18,7.8C12.18,5.69 13.89,4 16,4M16,13.4C18.67,13.4 21.82,14.73 21.82,16.6V18.4H10.18V16.6C10.18,14.73 13.33,13.4 16,13.4M8,6A3,3 0 0,1 11,9A3,3 0 0,1 8,12A3,3 0 0,1 5,9A3,3 0 0,1 8,6M8,13C10.67,13 16,14.33 16,17V19H0V17C0,14.33 5.33,13 8,13Z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Delegado/a Suplente</h3>
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                <li>• Apoyo al delegado principal</li>
                <li>• Sustitución en ausencias</li>
                <li>• Seguimiento de casos asignados</li>
                <li>• Coordinación con el principal</li>
                <li>• Formación específica requerida</li>
              </ul>
            </div>

            {/* Personal con Contacto */}
            <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16,13C15.71,13 15.38,13 15.03,13.05C16.19,13.89 17,15 17,16.5V19H23V16.5C23,14.17 18.33,13 16,13M8,13C5.67,13 1,14.17 1,16.5V19H15V16.5C15,14.17 10.33,13 8,13M8,11A3,3 0 0,0 11,8A3,3 0 0,0 8,5A3,3 0 0,0 5,8A3,3 0 0,0 8,11M16,11A3,3 0 0,0 19,8A3,3 0 0,0 16,5A3,3 0 0,0 13,8A3,3 0 0,0 16,11Z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Personal con Contacto</h3>
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                <li>• Interacción directa con menores</li>
                <li>• Formación LOPIVI obligatoria</li>
                <li>• Certificado de antecedentes</li>
                <li>• Seguimiento de protocolos</li>
                <li>• Detección de señales de riesgo</li>
              </ul>
            </div>

            {/* Personal sin Contacto y Familias */}
            <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Personal sin Contacto y Familias</h3>
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                <li>• Personal: Conocimiento básico LOPIVI</li>
                <li>• Personal: Colaboración en protocolos</li>
                <li>• Familias: Información del delegado</li>
                <li>• Familias: Canal de comunicación</li>
                <li>• Familias: Colaboración activa</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="border border-blue-200 rounded-lg p-6 max-w-4xl mx-auto">
              <h3 className="text-lg font-bold text-blue-900 mb-3">
                Responsabilidad Compartida
              </h3>
              <p className="text-blue-800">
                La protección infantil es responsabilidad de TODA la comunidad. Cada rol es fundamental para crear un entorno seguro donde los menores puedan desarrollarse sin riesgo de violencia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido adicional */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-700 mb-4">Paso a Paso</h2>
            <p className="text-xl text-gray-600">Implementación ordenada y sistemática</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Analiza tu entidad</h3>
              <p className="text-gray-600">Identifica riesgos específicos y requisitos según tu tipo de actividad, pero tranquilo, gracias a C360, ya no es complejo ni necesitas consultores externos, nosotros lo hemos automatizado TODO</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Designa delegado/a</h3>
              <p className="text-gray-600">Selecciona y nosotros formamos a la persona responsable de protección</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Implementa protocolos</h3>
              <p className="text-gray-600">Establece procedimientos y forma a todo el personal</p>
            </div>
          </div>
        </div>
      </section>

      {/* PDFs Descargables */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-700 mb-4">Documentación Técnica</h2>
            <p className="text-xl text-gray-600">Guías completas para implementación LOPIVI</p>
            <div className="mt-6 border-2 border-orange-300 rounded-lg p-6 max-w-4xl mx-auto">
              <p className="text-orange-800 text-base leading-relaxed">
                Como en C360 lo que nos mueve es la protección de los menores, si no quieres o no puedes contratarnos, te facilitamos las guías para que lo puedas hacer tú mismo, pero una vez generada la documentación inicial, dependerá enteramente de ti y de tu sistema de gestión documental la actualización y seguimiento (obligatorios) y sobre todo dependerá de ti que tu Plan no acabe <span className="font-bold">OLVIDADO EN UN CAJÓN</span>.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Guía LOPIVI */}
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Guía LOPIVI Completa</h3>
              <p className="text-gray-600 mb-6">
                Documento informativo de 25 páginas con el marco legal, obligaciones específicas, protocolos de actuación, formación del personal y casos prácticos reales.
              </p>
              <div className="border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-blue-800 mb-2">Incluye:</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Marco legal completo</li>
                  <li>• Obligaciones específicas</li>
                  <li>• Protocolos de actuación</li>
                  <li>• Formación del personal</li>
                  <li>• Casos prácticos reales</li>
                </ul>
              </div>
              <a
                href={URL_GUIA_LOPIVI}
                download="Guia-LOPIVI-Completa.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors text-center"
              >
                Descargar Guía LOPIVI Completa (PDF)
              </a>
            </div>

            {/* Guía Plan de Protección */}
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="w-20 h-20 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Guía Plan de Protección</h3>
              <p className="text-gray-600 mb-6">
                Guía técnica con estructura de plan completa, análisis de riesgos, medidas preventivas, protocolos de emergencia y plantillas personalizadas.
              </p>
              <div className="border border-green-200 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-green-800 mb-2">Incluye:</h4>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Estructura del plan completa</li>
                  <li>• Análisis de riesgos específicos</li>
                  <li>• Medidas preventivas detalladas</li>
                  <li>• Protocolos de emergencia</li>
                  <li>• Plantillas personalizables</li>
                </ul>
              </div>
              <a
                href={URL_GUIA_PLAN}
                download="Guia-Plan-de-Proteccion.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors text-center"
              >
                Descargar Guía Plan de Protección (PDF)
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Necesitas implementación automática?</h2>
          <p className="text-xl mb-8">Con Custodia360 podrás tener todo listo en 72 horas</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/contratar/datos-entidad"
              className="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              Contratar Custodia360
            </a>
            <a
              href="/planes"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-900 transition-colors"
            >
              Ver Planes
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
