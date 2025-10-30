import Link from 'next/link'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Proceso: <span className="text-blue-600">Custodia360</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Descubre lo fácil que es cumplir completamente con la LOPIVI gracias a nuestra automatización.
            Desde la contratación hasta el control continuo.
          </p>
        </div>
      </section>

      {/* Roles LOPIVI Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Quién hace qué en el Plan de Protección LOPIVI?
            </h2>
            <p className="text-lg text-gray-600">
              Cada persona tiene un rol específico para garantizar la protección de los menores
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Delegado */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-blue-600 text-xl font-bold">D</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-3">Delegado</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>Principal:</strong> Responsable principal LOPIVI</li>
                <li>• <strong>Suplente:</strong> Sustituye cuando es necesario</li>
                <li>• Formación completa y certificación</li>
                <li>• Gestión del sistema y protocolos</li>
              </ul>
            </div>

            {/* Personal con Contacto */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-red-600 text-xl font-bold">PC</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-3">Personal con Contacto</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>Entrenadores, monitores, técnicos</strong></li>
                <li>• <strong>Certificado antecedentes obligatorio</strong></li>
                <li>• Formación completa + test exigente</li>
                <li>• Renovación cada 6 meses</li>
              </ul>
            </div>

            {/* Personal sin Contacto */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-green-600 text-xl font-bold">PS</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-3">Personal sin Contacto</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>Administrativos, limpieza, servicios</strong></li>
                <li>• <strong>Sin certificado antecedentes</strong></li>
                <li>• Formación básica + test simple</li>
                <li>• Información sobre protocolos</li>
              </ul>
            </div>

            {/* Familias */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-purple-600 text-xl font-bold">F</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-3">Familias</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>Padres, madres, tutores legales</strong></li>
                <li>• <strong>Solo información básica LOPIVI</strong></li>
                <li>• Confirmación de lectura</li>
                <li>• Acceso a canal de comunicación</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 inline-block">
              <p className="text-blue-800 font-medium">
                EN 5 SIMPLES PASOS
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 1. Contratación Automática - Mockup izquierda */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Mockup */}
            <div className="order-2 lg:order-1">
              <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {/* Browser header */}
                <div className="bg-gray-100 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="bg-white rounded px-3 py-1 text-sm text-gray-600">
                      custodia360.es/contratar
                    </div>
                  </div>
                </div>

                {/* Form content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Contratación Automática</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                      <span className="text-sm font-medium">1. Datos de tu entidad</span>
                      <span className="text-green-600 font-bold">✓ Completado</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded">
                      <span className="text-sm font-medium">2. Designar delegado</span>
                      <span className="text-blue-600 font-bold">→ En proceso</span>
                    </div>

                    <div className="p-3 border border-gray-200 rounded">
                      <div className="text-sm font-medium text-gray-900 mb-2">Delegado/a Principal</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <input className="border rounded px-2 py-1" placeholder="Nombre completo" value="María García" readOnly />
                        <input className="border rounded px-2 py-1" placeholder="DNI" value="12345678A" readOnly />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
                      <span className="text-sm font-medium">3. Pago (desde 19€ + IVA)</span>
                      <span className="text-gray-500">Pendiente</span>
                    </div>
                  </div>

                  <button className="w-full bg-green-600 text-white py-3 rounded-lg font-medium mt-4 shadow-lg">
                    Finalizar Contratación
                  </button>
                </div>
              </div>
            </div>

            {/* Explicación */}
            <div className="order-1 lg:order-2">
              <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium inline-block mb-4">
                Paso 1: Contratación
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Contrata en 3 minutos
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-blue-600 text-sm font-bold">1</span>
                  </div>
                  <div>
                    <strong className="text-gray-900">Datos básicos</strong>
                    <p className="text-gray-600">Solo nombre de entidad, número de menores y contacto</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-blue-600 text-sm font-bold">2</span>
                  </div>
                  <div>
                    <strong className="text-gray-900">Designa delegado/a</strong>
                    <p className="text-gray-600">Una persona de tu equipo que será el responsable</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-blue-600 text-sm font-bold">3</span>
                  </div>
                  <div>
                    <strong className="text-gray-900">Pago automático</strong>
                    <p className="text-gray-600">Desde 19€ + IVA. Implementación inmediata</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Implementación 72h - Mockup derecha */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Explicación */}
            <div>
              <div className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium inline-block mb-4">
                Paso 2: Implementación
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                72 horas y listo
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-green-600 text-sm font-bold">Ok</span>
                  </div>
                  <div>
                    <strong className="text-gray-900">Plan de Protección automático</strong>
                    <p className="text-gray-600">Generado específicamente para tu tipo de entidad</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-green-600 text-sm font-bold">Ok</span>
                  </div>
                  <div>
                    <strong className="text-gray-900">Protocolos personalizados</strong>
                    <p className="text-gray-600">Adaptados a tu actividad y número de menores</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-green-600 text-sm font-bold">Ok</span>
                  </div>
                  <div>
                    <strong className="text-gray-900">Dashboard activado</strong>
                    <p className="text-gray-600">Acceso inmediato al sistema de gestión</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-green-600 text-sm font-bold">Ok</span>
                  </div>
                  <div>
                    <strong className="text-gray-900">Documentación completa</strong>
                    <p className="text-gray-600">Todos los PDFs necesarios generados</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Mockup */}
            <div>
              <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 text-2xl font-bold">Auto</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Implementación Automática</h3>
                  <p className="text-gray-600">Estado actual de tu proceso</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-bold">Ok</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Plan de Protección</div>
                        <div className="text-sm text-gray-600">Generado automáticamente</div>
                      </div>
                    </div>
                    <span className="text-green-600 font-bold">100%</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-bold">Ok</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Protocolos de Actuación</div>
                        <div className="text-sm text-gray-600">Personalizados para tu entidad</div>
                      </div>
                    </div>
                    <span className="text-green-600 font-bold">100%</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-bold">...</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Dashboard Delegado/a</div>
                        <div className="text-sm text-gray-600">María García - Activando acceso</div>
                      </div>
                    </div>
                    <span className="text-blue-600 font-bold">85%</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-100 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-900">18 horas restantes</div>
                  <div className="text-sm text-gray-600">para completar implementación</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Formación del Delegado - Mockup izquierda */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Mockup */}
            <div className="order-2 lg:order-1">
              <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-orange-600 text-white p-4">
                  <h3 className="font-bold">Campus Virtual LOPIVI</h3>
                  <p className="text-orange-100 text-sm">María García - Delegado/a Principal</p>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">Progreso de Formación</span>
                      <span className="font-bold text-orange-600">75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-600 h-2 rounded-full" style={{width: '75%'}}></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <span className="font-medium">Módulo 1: Introducción LOPIVI</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Completado</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <span className="font-medium">Módulo 2: Protocolo Actuación</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Completado</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <span className="font-medium">Módulo 3: Legislación Actual</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">En curso</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <span className="font-medium">Módulo 4: Evaluación Final</span>
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">Pendiente</span>
                    </div>
                  </div>

                  <button className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold mt-4 shadow-lg hover:bg-orange-700 transition-colors">
                    Continuar Formación
                  </button>
                </div>
              </div>
            </div>

            {/* Explicación */}
            <div className="order-1 lg:order-2">
              <div className="bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium inline-block mb-4">
                Paso 3: Formación Delegado/a
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Campus virtual especializado
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-orange-600 text-sm font-bold">1</span>
                  </div>
                  <div>
                    <strong className="text-gray-900">Formación adaptada al rol</strong>
                    <p className="text-gray-600">Contenido específico para delegados de protección</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-orange-600 text-sm font-bold">2</span>
                  </div>
                  <div>
                    <strong className="text-gray-900">Módulos prácticos</strong>
                    <p className="text-gray-600">Casos reales y protocolos de actuación</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-orange-600 text-sm font-bold">3</span>
                  </div>
                  <div>
                    <strong className="text-gray-900">Certificación</strong>
                    <p className="text-gray-600">Certificamos que te has formado</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-orange-600 text-sm font-bold">4</span>
                  </div>
                  <div>
                    <strong className="text-gray-900">Seguimiento continuo</strong>
                    <p className="text-gray-600">Actualizaciones automáticas de normativa</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Formación del Equipo y Comunicación - Mockup derecha */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Explicación */}
            <div>
              <div className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium inline-block mb-4">
                Paso 4: Formación Equipo y Comunicación
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Todo el equipo formado y familias informadas
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-purple-600 text-sm font-bold">1</span>
                  </div>
                  <div>
                    <strong className="text-gray-900">Formación automática del personal</strong>
                    <p className="text-gray-600">Asignación masiva según roles y responsabilidades</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-purple-600 text-sm font-bold">2</span>
                  </div>
                  <div>
                    <strong className="text-gray-900">Comunicación a familias</strong>
                    <p className="text-gray-600">Cartas automáticas informando sobre LOPIVI</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-purple-600 text-sm font-bold">3</span>
                  </div>
                  <div>
                    <strong className="text-gray-900">Certificados digitales</strong>
                    <p className="text-gray-600">Generación automática tras completar formación</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-purple-600 text-sm font-bold">4</span>
                  </div>
                  <div>
                    <strong className="text-gray-900">Registro de cumplimiento</strong>
                    <p className="text-gray-600">Documentación lista para inspecciones</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Mockup */}
            <div>
              <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Gestión de Formación del Equipo</h3>
                  <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm font-medium">
                    Asignar Formación
                  </button>
                </div>

                {/* Progreso general */}
                <div className="mb-6 p-4 bg-purple-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">Progreso Total del Equipo</span>
                    <span className="font-bold text-purple-600">28/32 certificados</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-purple-600 h-3 rounded-full" style={{width: '87.5%'}}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">87.5% del personal certificado</p>
                </div>

                {/* Personal por departamento */}
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">Entrenadores (8/8)</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Completo</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '100%'}}></div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">Personal Administrativo (12/15)</span>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">En progreso</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{width: '80%'}}></div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">Personal de Apoyo (8/9)</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Pendiente 1</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '89%'}}></div>
                    </div>
                  </div>
                </div>

                {/* Comunicación familias */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-bold text-blue-800 mb-2">Comunicación con Familias</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Cartas informativas enviadas</span>
                      <span className="font-bold text-blue-600">247/247</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Confirmaciones recibidas</span>
                      <span className="font-bold text-green-600">231/247</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Control y Monitoreo - Mockup izquierda */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Mockup */}
            <div className="order-2 lg:order-1">
              <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-teal-600 text-white p-4">
                  <h3 className="font-bold">Panel de Control LOPIVI</h3>
                  <p className="text-teal-100 text-sm">Club Deportivo Ejemplo - Monitoreo 24/7</p>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">100%</div>
                      <div className="text-sm text-gray-600">Cumplimiento</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">247</div>
                      <div className="text-sm text-gray-600">Menores protegidos</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">32</div>
                      <div className="text-sm text-gray-600">Personal formado</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <span className="font-medium">Plan de Protección</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Activo</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <span className="font-medium">Documentación</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Completa</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <span className="font-medium">Último informe</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">15 Dic 2024</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <span className="font-medium">Próxima renovación</span>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">Jun 2025</span>
                    </div>
                  </div>

                  <button className="w-full bg-teal-600 text-white py-3 rounded-lg font-bold mt-4 shadow-lg hover:bg-teal-700 transition-colors">
                    Generar Informe de Cumplimiento
                  </button>
                </div>
              </div>
            </div>

            {/* Explicación */}
            <div className="order-1 lg:order-2">
              <div className="bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-medium inline-block mb-4">
                Paso 5: Control y Monitoreo
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Dashboard 24/7 siempre preparado
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-teal-600 text-sm font-bold">1</span>
                  </div>
                  <div>
                    <strong className="text-gray-900">Monitoreo en tiempo real</strong>
                    <p className="text-gray-600">Estado de cumplimiento actualizado automáticamente</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-teal-600 text-sm font-bold">2</span>
                  </div>
                  <div>
                    <strong className="text-gray-900">Informes automáticos</strong>
                    <p className="text-gray-600">PDFs listos para cualquier inspección</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-teal-600 text-sm font-bold">3</span>
                  </div>
                  <div>
                    <strong className="text-gray-900">Alertas inteligentes</strong>
                    <p className="text-gray-600">Notificaciones de renovaciones y actualizaciones</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-teal-600 text-sm font-bold">4</span>
                  </div>
                  <div>
                    <strong className="text-gray-900">Protocolo de emergencia</strong>
                    <p className="text-gray-600">Acceso directo para casos urgentes</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-blue-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Convencido de lo fácil que es?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Todo el proceso automatizado
          </p>
          <div className="flex justify-center">
            <Link href="/planes" className="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
              Ver Planes y Contratar
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
