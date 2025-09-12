'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function DemoPage() {
  const [showEmergencyModal, setShowEmergencyModal] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Demo <span className="text-blue-800">Custodia360</span>
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Descubre cómo funciona nuestro sistema automatizado de gestión LOPIVI
          </p>
          <div className="inline-block bg-blue-800 text-white px-6 py-2 rounded-full font-bold mb-8">
            Sistema 100% funcional - Pruébalo ahora
          </div>
        </div>
      </section>

      {/* Tour Guiado Visual */}
      <section className="py-16 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tour Guiado del Sistema</h2>
            <p className="text-xl text-gray-600">Descubre las funcionalidades principales paso a paso</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Paso 1 - Panel de Control */}
            <div className="relative group">
              <div className="bg-white border border-gray-300 rounded-xl p-3 shadow-xl transform hover:scale-105 transition-transform">
                <div className="bg-white rounded-lg overflow-hidden">
                  {/* Barra de navegador */}
                  <div className="bg-gray-100 p-2 flex items-center justify-between">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-white rounded px-2 py-1 text-xs text-gray-600">
                        custodia360.es/dashboard
                      </div>
                    </div>
                  </div>

                  {/* Contenido del Dashboard */}
                  <div className="p-4 bg-gray-50">
                    {/* Header */}
<<<<<<< HEAD
                    <div className="bg-white border border-gray-300 rounded-lg p-3 mb-3">
                      <h4 className="font-bold text-sm text-gray-700">Dashboard Principal</h4>
                      <p className="text-xs text-gray-600">Hola, María García</p>
=======
                    <div className="bg-gray-800 text-white rounded-lg p-3 mb-3">
                      <h4 className="font-bold text-sm">Dashboard Principal</h4>
                      <p className="text-xs opacity-90">Hola, María García</p>
>>>>>>> f6677eec3aa575fb9fe8aa00ffe1ab2e06844d4b
                    </div>

                    {/* Métricas */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
<<<<<<< HEAD
                      <div className="bg-white border border-gray-300 rounded p-2">
                        <p className="text-gray-800 text-xs font-bold">85%</p>
                        <p className="text-xs text-gray-600">Cumplimiento</p>
                      </div>
                      <div className="bg-white border border-gray-300 rounded p-2">
                        <p className="text-gray-800 text-xs font-bold">156</p>
                        <p className="text-xs text-gray-600">Menores</p>
                      </div>
                      <div className="bg-white border border-gray-300 rounded p-2">
                        <p className="text-gray-800 text-xs font-bold">12</p>
                        <p className="text-xs text-gray-600">Personal</p>
=======
                      <div className="bg-green-50 border border-green-200 rounded p-2">
                        <p className="text-green-800 text-xs font-bold">85%</p>
                        <p className="text-xs text-green-600">Cumplimiento</p>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded p-2">
                        <p className="text-blue-800 text-xs font-bold">156</p>
                        <p className="text-xs text-blue-600">Menores</p>
                      </div>
                      <div className="bg-purple-50 border border-purple-200 rounded p-2">
                        <p className="text-purple-800 text-xs font-bold">12</p>
                        <p className="text-xs text-purple-600">Personal</p>
>>>>>>> f6677eec3aa575fb9fe8aa00ffe1ab2e06844d4b
                      </div>
                    </div>

                    {/* Alertas */}
<<<<<<< HEAD
                    <div className="bg-white border border-gray-300 rounded p-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-800 font-bold text-xs">2 Alertas Pendientes</p>
                          <p className="text-gray-600 text-xs">Requieren atención</p>
=======
                    <div className="bg-red-50 border border-red-200 rounded p-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-red-800 font-bold text-xs">2 Alertas Pendientes</p>
                          <p className="text-red-600 text-xs">Requieren atención</p>
>>>>>>> f6677eec3aa575fb9fe8aa00ffe1ab2e06844d4b
                        </div>
                        <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-pulse">!</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>



              <div className="mt-4">
                <h3 className="font-bold text-gray-900 mb-2">Panel de Control Principal</h3>
                <p className="text-sm text-gray-600">
                  Visualiza el estado completo de cumplimiento LOPIVI de tu entidad en tiempo real
                </p>
              </div>
            </div>

            {/* Paso 2 - Gestión de Casos */}
            <div className="relative group">
              <div className="bg-white border border-gray-300 rounded-xl p-3 shadow-xl transform hover:scale-105 transition-transform">
                <div className="bg-white rounded-lg overflow-hidden">
                  {/* Barra de navegador */}
                  <div className="bg-gray-100 p-2 flex items-center justify-between">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-white rounded px-2 py-1 text-xs text-gray-600">
                        custodia360.es/casos
                      </div>
                    </div>
                  </div>

                  {/* Contenido de Casos */}
                  <div className="p-4 bg-gray-50">
                    {/* Header */}
                    <div className="mb-3">
                      <h4 className="font-bold text-sm text-gray-900">Gestión de Casos</h4>
                      <p className="text-xs text-gray-600">4 casos activos</p>
                    </div>

                    {/* Lista de casos */}
                    <div className="space-y-2">
<<<<<<< HEAD
                      <div className="bg-white border border-gray-300 rounded p-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-gray-800">#0024 - Urgente</p>
                            <p className="text-xs text-gray-600">Bullying detectado</p>
=======
                      <div className="bg-red-50 border border-red-200 rounded p-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-red-800">#0024 - Urgente</p>
                            <p className="text-xs text-red-600">Bullying detectado</p>
>>>>>>> f6677eec3aa575fb9fe8aa00ffe1ab2e06844d4b
                          </div>
                          <span className="text-red-500 text-xs">!</span>
                        </div>
                      </div>

<<<<<<< HEAD
                      <div className="bg-white border border-gray-300 rounded p-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-gray-800">#0023 - En proceso</p>
                            <p className="text-xs text-gray-600">Evaluación inicial</p>
=======
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-yellow-800">#0023 - En proceso</p>
                            <p className="text-xs text-yellow-600">Evaluación inicial</p>
>>>>>>> f6677eec3aa575fb9fe8aa00ffe1ab2e06844d4b
                          </div>
                          <span className="text-yellow-500 text-xs">⚠</span>
                        </div>
                      </div>

<<<<<<< HEAD
                      <div className="bg-white border border-gray-300 rounded p-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-gray-800">#0022 - Resuelto</p>
                            <p className="text-xs text-gray-600">Caso cerrado</p>
=======
                      <div className="bg-green-50 border border-green-200 rounded p-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-green-800">#0022 - Resuelto</p>
                            <p className="text-xs text-green-600">Caso cerrado</p>
>>>>>>> f6677eec3aa575fb9fe8aa00ffe1ab2e06844d4b
                          </div>
                          <span className="text-green-500 text-xs">✓</span>
                        </div>
                      </div>

<<<<<<< HEAD
                      <div className="bg-white border border-gray-300 rounded p-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-gray-800">#0021 - Seguimiento</p>
                            <p className="text-xs text-gray-600">Revisión mensual</p>
=======
                      <div className="bg-blue-50 border border-blue-200 rounded p-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-blue-800">#0021 - Seguimiento</p>
                            <p className="text-xs text-blue-600">Revisión mensual</p>
>>>>>>> f6677eec3aa575fb9fe8aa00ffe1ab2e06844d4b
                          </div>
                          <span className="text-blue-500 text-xs">📋</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>



              <div className="mt-4">
                <h3 className="font-bold text-gray-900 mb-2">Sistema de Casos</h3>
                <p className="text-sm text-gray-600">
                  Registra, gestiona y haz seguimiento de cualquier incidencia con protocolos guiados
                </p>
              </div>
            </div>

            {/* Paso 3 - Documentos */}
            <div className="relative group">
              <div className="bg-white border border-gray-300 rounded-xl p-3 shadow-xl transform hover:scale-105 transition-transform">
                <div className="bg-white rounded-lg overflow-hidden">
                  {/* Barra de navegador */}
                  <div className="bg-gray-100 p-2 flex items-center justify-between">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-white rounded px-2 py-1 text-xs text-gray-600">
                        custodia360.es/documentos
                      </div>
                    </div>
                  </div>

                  {/* Contenido de Documentos */}
                  <div className="p-4 bg-gray-50">
                    {/* Header */}
                    <div className="mb-3">
                      <h4 className="font-bold text-sm text-gray-900">Documentación LOPIVI</h4>
                      <p className="text-xs text-gray-600">Todos los documentos listos</p>
                    </div>

                    {/* Grid de documentos */}
                    <div className="grid grid-cols-2 gap-2">
<<<<<<< HEAD
                      <div className="bg-white border border-gray-300 rounded p-2 hover:bg-gray-50 transition-colors cursor-pointer">
                        <p className="text-xs font-bold text-gray-800">Plan Protección</p>
                        <p className="text-xs text-gray-600">PDF</p>
                      </div>

                      <div className="bg-white border border-gray-300 rounded p-2 hover:bg-gray-50 transition-colors cursor-pointer">
                        <p className="text-xs font-bold text-gray-800">Certificado</p>
                        <p className="text-xs text-gray-600">PDF</p>
                      </div>

                      <div className="bg-white border border-gray-300 rounded p-2 hover:bg-gray-50 transition-colors cursor-pointer">
                        <p className="text-xs font-bold text-gray-800">Protocolos</p>
                        <p className="text-xs text-gray-600">PDF</p>
                      </div>

                      <div className="bg-white border border-gray-300 rounded p-2 hover:bg-gray-50 transition-colors cursor-pointer">
                        <p className="text-xs font-bold text-gray-800">Código Conducta</p>
                        <p className="text-xs text-gray-600">PDF</p>
=======
                      <div className="bg-blue-50 border border-blue-200 rounded p-2 hover:bg-blue-100 transition-colors cursor-pointer">
                        <p className="text-xs font-bold text-blue-800">Plan Protección</p>
                        <p className="text-xs text-blue-600">PDF</p>
                      </div>

                      <div className="bg-green-50 border border-green-200 rounded p-2 hover:bg-green-100 transition-colors cursor-pointer">
                        <p className="text-xs font-bold text-green-800">Certificado</p>
                        <p className="text-xs text-green-600">PDF</p>
                      </div>

                      <div className="bg-purple-50 border border-purple-200 rounded p-2 hover:bg-purple-100 transition-colors cursor-pointer">
                        <p className="text-xs font-bold text-purple-800">Protocolos</p>
                        <p className="text-xs text-purple-600">PDF</p>
                      </div>

                      <div className="bg-orange-50 border border-orange-200 rounded p-2 hover:bg-orange-100 transition-colors cursor-pointer">
                        <p className="text-xs font-bold text-orange-800">Código Conducta</p>
                        <p className="text-xs text-orange-600">PDF</p>
>>>>>>> f6677eec3aa575fb9fe8aa00ffe1ab2e06844d4b
                      </div>
                    </div>

                    {/* Botón de descarga */}
<<<<<<< HEAD
                    <button className="mt-3 w-full bg-blue-600 text-white text-xs font-bold py-2 rounded hover:bg-blue-700 transition-colors">
=======
                    <button className="mt-3 w-full bg-purple-600 text-white text-xs font-bold py-2 rounded hover:bg-purple-700 transition-colors">
>>>>>>> f6677eec3aa575fb9fe8aa00ffe1ab2e06844d4b
                      Descargar Todo
                    </button>
                  </div>
                </div>
              </div>



              <div className="mt-4">
                <h3 className="font-bold text-gray-900 mb-2">Centro de Documentación</h3>
                <p className="text-sm text-gray-600">
                  Todos los documentos LOPIVI generados automáticamente y listos para descargar
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Real Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ejemplo Dashboard Real del Delegado</h2>
            <p className="text-xl text-gray-600 mb-6">Esto es exactamente lo que verás en tu entidad</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-blue-800 font-medium">
                Este es un ejemplo de un Dashboard funcionando con datos de una entidad
              </p>
            </div>
          </div>

          {/* Dashboard Preview Completo */}
          <div className="bg-gray-100 rounded-xl p-8 mb-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Header del Dashboard */}
<<<<<<< HEAD
              <div className="bg-white text-black p-6 border-b border-gray-200">
=======
              <div className="bg-gray-800 text-white p-6">
>>>>>>> f6677eec3aa575fb9fe8aa00ffe1ab2e06844d4b
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xl font-bold">C</span>
                    </div>
                    <div>
<<<<<<< HEAD
                      <h3 className="text-xl font-bold text-black">Club Deportivo Ejemplo</h3>
                      <p className="text-gray-600 text-sm">Juan García Rodríguez (Delegado de Protección)</p>
=======
                      <h3 className="text-xl font-bold">Club Deportivo Ejemplo</h3>
                      <p className="text-gray-300 text-sm">Juan García Rodríguez (Delegado de Protección)</p>
>>>>>>> f6677eec3aa575fb9fe8aa00ffe1ab2e06844d4b
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Cumplimiento: 87%
                  </span>
                </div>
              </div>

              {/* Estadísticas principales */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
<<<<<<< HEAD
                  <div className="bg-white border border-gray-300 rounded-lg p-4 text-center">
                    <h4 className="text-gray-700 font-bold text-sm mb-1">Personal Formado</h4>
                    <div className="text-3xl font-bold text-gray-900">87%</div>
                    <p className="text-gray-600 text-sm">28/32 personas</p>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-600 h-2 rounded-full" style={{width: '87%'}}></div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-300 rounded-lg p-4 text-center">
                    <h4 className="text-gray-700 font-bold text-sm mb-1">Familias Informadas</h4>
                    <div className="text-3xl font-bold text-gray-900">94%</div>
                    <p className="text-gray-600 text-sm">156/166 familias</p>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-600 h-2 rounded-full" style={{width: '94%'}}></div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-300 rounded-lg p-4 text-center">
                    <h4 className="text-gray-700 font-bold text-sm mb-1">Menores Informados</h4>
                    <div className="text-3xl font-bold text-gray-900">91%</div>
                    <p className="text-gray-600 text-sm">218/240 menores</p>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-600 h-2 rounded-full" style={{width: '91%'}}></div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-300 rounded-lg p-4 text-center">
                    <h4 className="text-gray-700 font-bold text-sm mb-1">Casos Activos</h4>
=======
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <h4 className="text-blue-600 font-bold text-sm mb-1">Personal Formado</h4>
                    <div className="text-3xl font-bold text-gray-900">87%</div>
                    <p className="text-gray-600 text-sm">28/32 personas</p>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '87%'}}></div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <h4 className="text-green-600 font-bold text-sm mb-1">Familias Informadas</h4>
                    <div className="text-3xl font-bold text-gray-900">94%</div>
                    <p className="text-gray-600 text-sm">156/166 familias</p>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '94%'}}></div>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                    <h4 className="text-purple-600 font-bold text-sm mb-1">Menores Informados</h4>
                    <div className="text-3xl font-bold text-gray-900">91%</div>
                    <p className="text-gray-600 text-sm">218/240 menores</p>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: '91%'}}></div>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <h4 className="text-red-600 font-bold text-sm mb-1">Casos Activos</h4>
>>>>>>> f6677eec3aa575fb9fe8aa00ffe1ab2e06844d4b
                    <div className="text-3xl font-bold text-gray-900">1</div>
                    <p className="text-gray-600 text-sm">3 resueltos este año</p>
                  </div>
                </div>

                {/* Acciones rápidas */}
                <div className="mb-8">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Acciones Rápidas</h4>

                  {/* Botón de Emergencia - Interactivo */}
                  <div className="mb-6">
                    <button
                      onClick={() => setShowEmergencyModal(true)}
<<<<<<< HEAD
                      className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-red-600 px-6 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-3 shadow-lg transition-colors"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
=======
                      className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-3 shadow-lg transition-colors"
                    >
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
>>>>>>> f6677eec3aa575fb9fe8aa00ffe1ab2e06844d4b
                        <span className="text-red-600 text-xl font-bold">!</span>
                      </div>
                      CASO DE EMERGENCIA
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
<<<<<<< HEAD
                    <button className="bg-white border border-gray-300 text-red-600 p-3 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
                      Informe Inspección
                    </button>
                    <button className="bg-white border border-gray-300 hover:bg-gray-50 p-3 rounded-lg transition-colors text-sm">
                      <div className="font-medium text-gray-900">Gestionar Personas</div>
                    </button>
                    <button className="bg-white border border-gray-300 hover:bg-gray-50 p-3 rounded-lg transition-colors text-sm">
                      <div className="font-medium text-gray-900">Comunicaciones</div>
                    </button>
                    <button className="bg-white border border-gray-300 hover:bg-gray-50 p-3 rounded-lg transition-colors text-sm">
=======
                    <button className="bg-red-600 text-white p-3 rounded-lg font-medium hover:bg-red-700 transition-colors text-sm">
                      Informe Inspección
                    </button>
                    <button className="bg-blue-50 hover:bg-blue-100 p-3 rounded-lg transition-colors text-sm">
                      <div className="font-medium text-gray-900">Gestionar Personas</div>
                    </button>
                    <button className="bg-green-50 hover:bg-green-100 p-3 rounded-lg transition-colors text-sm">
                      <div className="font-medium text-gray-900">Comunicaciones</div>
                    </button>
                    <button className="bg-orange-50 hover:bg-orange-100 p-3 rounded-lg transition-colors text-sm">
>>>>>>> f6677eec3aa575fb9fe8aa00ffe1ab2e06844d4b
                      <div className="font-medium text-gray-900">Gestión Casos</div>
                    </button>
                  </div>
                </div>

                {/* Alertas y estado */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-3">Alertas Pendientes</h4>
                    <div className="space-y-2">
<<<<<<< HEAD
                      <div className="bg-white border border-gray-300 p-3 text-sm">
                        • Certificación de María López caduca en 15 días
                      </div>
                      <div className="bg-white border border-gray-300 p-3 text-sm">
=======
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 text-sm">
                        • Certificación de María López caduca en 15 días
                      </div>
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 text-sm">
>>>>>>> f6677eec3aa575fb9fe8aa00ffe1ab2e06844d4b
                        • 4 familias pendientes de firmar código de conducta
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-3">Estado General</h4>
<<<<<<< HEAD
                    <div className="bg-white border border-gray-300 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Cumplimiento Global</span>
                        <span className="text-xl font-bold text-gray-700">87%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-gray-600 h-3 rounded-full" style={{width: '87%'}}></div>
=======
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Cumplimiento Global</span>
                        <span className="text-xl font-bold text-orange-600">87%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-orange-600 h-3 rounded-full" style={{width: '87%'}}></div>
>>>>>>> f6677eec3aa575fb9fe8aa00ffe1ab2e06844d4b
                      </div>
                      <p className="text-xs text-gray-600 mt-2">12 documentos pendientes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Características Detalladas */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Qué puedes hacer con <span className="text-blue-800">Custodia360</span>?</h2>
            <p className="text-xl text-gray-600">Todas las funcionalidades incluidas desde el primer día</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Gestión de Personas */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Gestión de Personas</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Registro completo del personal</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Base de datos de familias</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Información de menores</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Control de formaciones</span>
                </li>
              </ul>
            </div>

            {/* Sistema de Comunicaciones */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Comunicaciones</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Envío masivo de documentos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Templates personalizados</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Recordatorios automáticos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Seguimiento de respuestas</span>
                </li>
              </ul>
            </div>

            {/* Gestión de Casos */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Gestión de Casos</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✓</span>
                  <span>Registro de incidentes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✓</span>
                  <span>Workflow de seguimiento</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✓</span>
                  <span>Comunicación con autoridades</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✓</span>
                  <span>Archivo confidencial</span>
                </li>
              </ul>
            </div>

            {/* Informes Automáticos */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Informes Automáticos</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  <span>Informes de cumplimiento</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  <span>Estadísticas en tiempo real</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  <span>Generación automática PDF</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  <span>Informes para inspecciones</span>
                </li>
              </ul>
            </div>

            {/* Formación Online */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Formación Online</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>Cursos LOPIVI</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>Certificados automáticos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>Seguimiento de progreso</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>Recordatorios de renovación</span>
                </li>
              </ul>
            </div>

            {/* Sistema de Alertas */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sistema de Alertas</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">✓</span>
                  <span>Alertas de vencimientos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">✓</span>
                  <span>Notificaciones automáticas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">✓</span>
                  <span>Recordatorios de tareas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">✓</span>
                  <span>Monitoreo continuo</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Proceso de Implementación Demo */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cómo implementamos tu sistema</h2>
            <p className="text-xl text-gray-600">Proceso 100% automatizado en 72 horas</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
<<<<<<< HEAD
              <div className="text-5xl font-bold text-black mb-6">1</div>
=======
              <div className="text-5xl font-bold text-blue-600 mb-6">1</div>
>>>>>>> f6677eec3aa575fb9fe8aa00ffe1ab2e06844d4b
              <h3 className="text-xl font-bold text-gray-900 mb-4">Configuración Inteligente</h3>
              <p className="text-gray-600">
                Generamos automáticamente toda la documentación, protocolos y configuración para tu entidad.
              </p>
            </div>

            <div className="text-center">
<<<<<<< HEAD
              <div className="text-5xl font-bold text-black mb-6">2</div>
=======
              <div className="text-5xl font-bold text-green-600 mb-6">2</div>
>>>>>>> f6677eec3aa575fb9fe8aa00ffe1ab2e06844d4b
              <h3 className="text-xl font-bold text-gray-900 mb-4">Activación Inmediata</h3>
              <p className="text-gray-600">
                Activamos el sistema completo y proporcionamos acceso inmediato al dashboard del delegado.
              </p>
            </div>

            <div className="text-center">
<<<<<<< HEAD
              <div className="text-5xl font-bold text-black mb-6">3</div>
=======
              <div className="text-5xl font-bold text-orange-600 mb-6">3</div>
>>>>>>> f6677eec3aa575fb9fe8aa00ffe1ab2e06844d4b
              <h3 className="text-xl font-bold text-gray-900 mb-4">Funcionamiento 24/7</h3>
              <p className="text-gray-600">
                Tu entidad queda implementada con mantenimiento automático y actualizaciones continuas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Convencido? ¡Implementa LOPIVI hoy!</h2>
          <p className="text-xl mb-8">Sistema 100% funcional en menos de 72 horas</p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/planes"
              className="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              Ver Precios y Contratar
            </Link>
            <Link
              href="/guia"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-900 transition-colors"
            >
              Guía Implementación
            </Link>
          </div>
        </div>
      </section>

      {/* Modal de Caso de Emergencia */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-3xl font-bold">!</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Protocolo de Emergencia Activado</h3>
              <p className="text-gray-600">¿Qué tipo de situación necesita gestionar?</p>
            </div>

            <div className="space-y-3 mb-6">
              <button className="w-full bg-red-600 text-white p-4 rounded-lg font-medium hover:bg-red-700 transition-colors text-left">
                🚨 Incidente con menor - Activar protocolo inmediato
              </button>
              <button className="w-full bg-orange-500 text-white p-4 rounded-lg font-medium hover:bg-orange-600 transition-colors text-left">
                ⚠️ Situación de riesgo - Necesita valoración
              </button>
              <button className="w-full bg-blue-600 text-white p-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-left">
                📞 Contactar autoridades competentes
              </button>
              <button className="w-full bg-purple-600 text-white p-4 rounded-lg font-medium hover:bg-purple-700 transition-colors text-left">
                📝 Documentar incidente para seguimiento
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors">
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
