'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function FormacionDelegadoPage() {
  const [sectorSeleccionado, setSectorSeleccionado] = useState('deportivo')
  const [tipoFormacion, setTipoFormacion] = useState('principal') // principal o suplente

  const sectores = {
    deportivo: {
      nombre: 'Deportivo',
      descripcion: 'Clubs deportivos, escuelas deportivas, gimnasios',
      color: 'blue',
      casos: ['Vestuarios', 'Viajes deportivos', 'Concentraciones']
    },
    educativo: {
      nombre: 'Educativo',
      descripcion: 'Colegios, institutos, centros educativos',
      color: 'green',
      casos: ['Aulas', 'Patios escolares', 'Actividades extraescolares']
    },
    ocio: {
      nombre: 'Ocio y Tiempo Libre',
      descripcion: 'Campamentos, ludotecas, centros de ocio',
      color: 'orange',
      casos: ['Campamentos', 'Actividades nocturnas', 'Excursiones']
    },
    cultural: {
      nombre: 'Cultural',
      descripcion: 'Academias, conservatorios, centros culturales',
      color: 'purple',
      casos: ['Clases individuales', 'Ensayos', 'Espectáculos']
    },
    social: {
      nombre: 'Social',
      descripcion: 'ONGs, centros sociales, asociaciones',
      color: 'teal',
      casos: ['Atención social', 'Programas familiares', 'Seguimiento']
    }
  }

  const modulos = [
    {
      id: 1,
      titulo: 'Introducción LOPIVI',
      duracion: '60 min',
      descripcion: 'Fundamentos legales y marco normativo',
      contenido: [
        'Qué es la LOPIVI y por qué existe',
        'Obligaciones legales de las entidades',
        'Responsabilidades y sanciones',
        'Marco legal español e internacional'
      ]
    },
    {
      id: 2,
      titulo: 'Rol del Delegado de Protección',
      duracion: '60 min',
      descripcion: 'Funciones, responsabilidades y competencias',
      contenido: [
        'Perfil y competencias del delegado',
        'Funciones principales y secundarias',
        'Relación con dirección y personal',
        'Coordinación con delegado suplente'
      ]
    },
    {
      id: 3,
      titulo: 'Protocolos de Actuación',
      duracion: '90 min',
      descripcion: 'Procedimientos específicos por situaciones',
      contenido: [
        'Protocolo de prevención',
        'Protocolo de detección',
        'Protocolo de actuación inmediata',
        'Protocolo de seguimiento'
      ]
    },
    {
      id: 4,
      titulo: 'Gestión de Casos',
      duracion: '90 min',
      descripcion: 'Manejo integral de situaciones reales',
      contenido: [
        'Registro y documentación',
        'Evaluación de riesgo',
        'Comunicación con autoridades',
        'Seguimiento y cierre de casos'
      ]
    },
    {
      id: 5,
      titulo: 'Casos Prácticos Sectoriales',
      duracion: '60 min',
      descripcion: `Situaciones específicas del sector ${sectores[sectorSeleccionado].nombre.toLowerCase()}`,
      contenido: sectores[sectorSeleccionado].casos.map(caso => `Caso práctico: ${caso}`)
    }
  ]

  const progresoFormacion = {
    principal: { completados: 0, total: 5 },
    suplente: { completados: 0, total: 5 }
  }

  const getSectorColorClass = (color, type) => {
    const colorMap = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-500', button: 'bg-blue-600 hover:bg-blue-700' },
      green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-500', button: 'bg-green-600 hover:bg-green-700' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-500', button: 'bg-orange-600 hover:bg-orange-700' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-500', button: 'bg-purple-600 hover:bg-purple-700' },
      teal: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-500', button: 'bg-teal-600 hover:bg-teal-700' }
    }
    return colorMap[color]?.[type] || ''
  }

  const sectorActual = sectores[sectorSeleccionado]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-block bg-white text-black px-4 py-2 rounded-full font-bold text-sm mb-4">
              DEMO - Vista previa del Campus Virtual
            </div>
            <h1 className="text-4xl font-bold mb-4">Campus Virtual LOPIVI</h1>
            <p className="text-xl text-blue-100 mb-6">
              Formación especializada para Delegados de Protección
            </p>
            <div className="inline-block bg-green-600 px-6 py-2 rounded-full font-bold">
              Certificación Custodia360
            </div>
          </div>

          {/* Selector de tipo de formación */}
          <div className="flex justify-center mb-8">
            <div className="bg-white bg-opacity-10 rounded-lg p-2 flex">
              <button
                onClick={() => setTipoFormacion('principal')}
                className={`px-6 py-2 rounded font-bold transition-colors ${
                  tipoFormacion === 'principal'
                    ? 'bg-white text-blue-900'
                    : 'text-white hover:bg-white hover:bg-opacity-20'
                }`}
              >
                Delegado Principal
              </button>
              <button
                onClick={() => setTipoFormacion('suplente')}
                className={`px-6 py-2 rounded font-bold transition-colors ${
                  tipoFormacion === 'suplente'
                    ? 'bg-white text-blue-900'
                    : 'text-white hover:bg-white hover:bg-opacity-20'
                }`}
              >
                Delegado Suplente (+10€)
              </button>
            </div>
          </div>

          {/* Progreso general */}
          <div className="bg-white bg-opacity-10 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-bold mb-4">
              Progreso - {tipoFormacion === 'principal' ? 'Delegado Principal' : 'Delegado Suplente'}
            </h3>
            <div className="flex items-center mb-2">
              <div className="flex-1 bg-white bg-opacity-20 rounded-full h-3">
                <div
                  className="bg-green-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(progresoFormacion[tipoFormacion].completados / progresoFormacion[tipoFormacion].total) * 100}%` }}
                ></div>
              </div>
              <span className="ml-4 font-bold">
                {progresoFormacion[tipoFormacion].completados}/{progresoFormacion[tipoFormacion].total}
              </span>
            </div>
            <p className="text-blue-100 text-sm">
              {progresoFormacion[tipoFormacion].completados === 0
                ? 'Comienza tu formación especializada'
                : `${progresoFormacion[tipoFormacion].completados} módulos completados`
              }
            </p>
          </div>
        </div>
      </section>

      {/* Selector de Sector */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-6">Selecciona tu sector</h2>
          <div className="grid md:grid-cols-5 gap-4">
            {Object.entries(sectores).map(([key, sector]) => (
              <button
                key={key}
                onClick={() => setSectorSeleccionado(key)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  sectorSeleccionado === key
                    ? `${getSectorColorClass(sector.color, 'border')} ${getSectorColorClass(sector.color, 'bg')}`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-bold text-gray-900 mb-2">{sector.nombre}</h3>
                <p className="text-sm text-gray-600">{sector.descripcion}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Módulos de Formación */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Módulos de Formación - Sector {sectorActual.nombre}
            </h2>
            <p className="text-xl text-gray-600">
              Formación especializada de {modulos.reduce((total, modulo) => {
                const tiempo = parseInt(modulo.duracion);
                return total + tiempo;
              }, 0)} minutos total
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {modulos.map((modulo) => (
              <div key={modulo.id} className="bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 ${getSectorColorClass(sectorActual.color, 'bg')} rounded-lg flex items-center justify-center mr-4`}>
                        <span className={`${getSectorColorClass(sectorActual.color, 'text')} font-bold text-lg`}>
                          {modulo.id}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{modulo.titulo}</h3>
                        <p className="text-gray-600">{modulo.descripcion}</p>
                      </div>
                    </div>
                    <span className={`${getSectorColorClass(sectorActual.color, 'bg')} ${getSectorColorClass(sectorActual.color, 'text')} px-3 py-1 rounded-full text-sm font-bold`}>
                      {modulo.duracion}
                    </span>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-3">Contenido del módulo:</h4>
                    <ul className="space-y-2">
                      {modulo.contenido.map((item, index) => (
                        <li key={index} className="flex items-start text-gray-700">
                          <span className={`${getSectorColorClass(sectorActual.color, 'text')} mr-2 font-bold`}>•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <button
                      disabled
                      className="flex-1 bg-gray-400 text-white py-3 rounded-lg font-bold cursor-not-allowed opacity-60"
                      title="Este es un ejemplo del campus virtual. Contrata para acceder al contenido real."
                    >
                      Comenzar Módulo (Demo)
                    </button>
                    <button
                      onClick={() => {
                        alert(`VISTA PREVIA - ${modulo.titulo}\n\nSector: ${sectorActual.nombre}\nDuración: ${modulo.duracion}\n\nContenido principal:\n${modulo.contenido.slice(0,4).map((item, i) => `${i+1}. ${item}`).join('\n')}\n\nPulsa "Comenzar Módulo" para acceder al campus virtual completo`)
                      }}
                      className="px-4 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                      title={`Vista previa del módulo ${modulo.titulo}`}
                    >
                      Vista Previa
                    </button>
                  </div>
                </div>

                {/* Estado del módulo */}
                <div className="px-6 py-3 bg-gray-50 border-t rounded-b-xl">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Estado: No iniciado</span>
                    <span className="text-gray-500">0% completado</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Información de Certificación */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Proceso de Certificación</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-center mb-4">
                <span className="text-4xl font-bold text-gray-700">1</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Completa Formación</h3>
              <p className="text-gray-600">Supera los 5 módulos especializados para tu sector</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-center mb-4">
                <span className="text-4xl font-bold text-gray-700">2</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Supera el Test</h3>
              <p className="text-gray-600">Test de 30 preguntas con 80% mínimo para aprobar</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-center mb-4">
                <span className="text-4xl font-bold text-gray-700">3</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Obtén Certificado</h3>
              <p className="text-gray-600">Certificado de formación y acceso completo al dashboard</p>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-orange-800 mb-2">
              Delegado Suplente - Misma Formación, Máxima Seguridad
            </h3>
            <p className="text-orange-700 mb-4">
              Recomendamos certificar un delegado suplente para garantizar continuidad 24/7.
              Mismo nivel de formación y responsabilidades.
            </p>
            <div className="text-sm text-orange-600">
              <strong>Precio delegado suplente:</strong> +10€ por entidad
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para comenzar tu formación?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Conviértete en Delegado de Protección en tu sector
          </p>

          <div className="flex justify-center gap-4">
            <Link
              href="/formacion-lopivi/bienvenida"
              className="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors inline-block"
            >
              Comenzar Formación {tipoFormacion === 'principal' ? 'Principal' : 'Suplente'}
            </Link>
            <Link
              href="/formacion-lopivi/test-unico"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-900 transition-colors inline-block"
            >
              Ver Test de Certificación
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
