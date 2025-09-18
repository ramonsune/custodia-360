'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function FormacionSuplentePage() {
  const [moduloActual, setModuloActual] = useState(1)
  const [progreso, setProgreso] = useState(25)

  const modulos = [
    {
      id: 1,
      titulo: 'Introducción a LOPIVI',
      descripcion: 'Conceptos básicos y marco legal',
      completado: true,
      duracion: '45 min'
    },
    {
      id: 2,
      titulo: 'Rol del Delegado Suplente',
      descripcion: 'Funciones y responsabilidades específicas',
      completado: false,
      duracion: '60 min'
    },
    {
      id: 3,
      titulo: 'Protocolos de Actuación',
      descripcion: 'Procedimientos en casos de emergencia',
      completado: false,
      duracion: '90 min'
    },
    {
      id: 4,
      titulo: 'Casos Prácticos',
      descripcion: 'Simulaciones y ejercicios',
      completado: false,
      duracion: '120 min'
    },
    {
      id: 5,
      titulo: 'Evaluación Final',
      descripcion: 'Test de certificación',
      completado: false,
      duracion: '30 min'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Formación Delegado Suplente LOPIVI</h1>
              <p className="text-gray-600 mt-2">Curso de certificación para delegados suplentes de protección</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{progreso}%</div>
              <div className="text-sm text-gray-600">Completado</div>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{width: `${progreso}%`}}
              ></div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de módulos */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Módulos del Curso</h3>
              <div className="space-y-3">
                {modulos.map((modulo) => (
                  <div
                    key={modulo.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      moduloActual === modulo.id
                        ? 'border-blue-500 bg-blue-50'
                        : modulo.completado
                          ? 'border-green-200 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setModuloActual(modulo.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          modulo.completado
                            ? 'bg-green-500 text-white'
                            : moduloActual === modulo.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-300 text-gray-600'
                        }`}>
                          {modulo.completado ? '✓' : modulo.id}
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-gray-900">{modulo.titulo}</h4>
                          <p className="text-xs text-gray-600">{modulo.duracion}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contenido del módulo actual */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Módulo {moduloActual}: {modulos.find(m => m.id === moduloActual)?.titulo}
                </h2>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {modulos.find(m => m.id === moduloActual)?.duracion}
                </span>
              </div>

              <p className="text-gray-600 mb-6">
                {modulos.find(m => m.id === moduloActual)?.descripcion}
              </p>

              {/* Contenido específico según módulo */}
              {moduloActual === 1 && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-bold text-blue-900 mb-2">¿Qué es la LOPIVI?</h3>
                    <p className="text-blue-800 text-sm">
                      La Ley Orgánica de Protección Integral a la Infancia y la Adolescencia frente a la Violencia
                      establece un marco legal integral para proteger a los menores.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-900">Objetivos principales:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        Garantizar la protección integral de menores
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        Prevenir cualquier forma de violencia
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        Establecer protocolos de actuación
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        Formar a profesionales responsables
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {moduloActual === 2 && (
                <div className="space-y-6">
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="font-bold text-orange-900 mb-2">Rol del Delegado Suplente</h3>
                    <p className="text-orange-800 text-sm">
                      El delegado suplente actúa como apoyo y sustituto del delegado principal cuando sea necesario.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-900">Responsabilidades principales:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-orange-600 mr-2">•</span>
                        Apoyo al delegado principal en todas sus funciones
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-600 mr-2">•</span>
                        Sustitución temporal en ausencias
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-600 mr-2">•</span>
                        Conocimiento completo de protocolos
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-600 mr-2">•</span>
                        Participación en la formación continua
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Botones de navegación */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => moduloActual > 1 && setModuloActual(moduloActual - 1)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                  disabled={moduloActual === 1}
                >
                  ← Anterior
                </button>

                <button
                  onClick={() => {
                    if (moduloActual < modulos.length) {
                      setModuloActual(moduloActual + 1)
                      setProgreso(Math.min(100, progreso + 20))
                    }
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={moduloActual === modulos.length}
                >
                  {moduloActual === modulos.length ? 'Finalizar' : 'Siguiente →'}
                </button>
              </div>
            </div>

            {/* Certificación */}
            {progreso === 100 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">✓</span>
                  </div>
                  <h3 className="text-xl font-bold text-green-900 mb-2">¡Formación Completada!</h3>
                  <p className="text-green-700 mb-4">
                    Has completado exitosamente la formación para Delegado Suplente LOPIVI
                  </p>
                  <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors">
                    Descargar Certificado
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navegación inferior */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
