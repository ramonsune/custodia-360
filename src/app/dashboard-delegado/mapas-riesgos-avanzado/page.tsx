'use client'

import { useState } from 'react'
import Link from 'next/link'

interface FactorRiesgo {
  id: string
  categoria: 'personal' | 'ambiental' | 'organizacional' | 'tecnologico'
  nombre: string
  descripcion: string
  probabilidad: 'muy_baja' | 'baja' | 'media' | 'alta' | 'muy_alta'
  impacto: 'minimo' | 'menor' | 'moderado' | 'mayor' | 'catastrofico'
  nivel_riesgo: 'bajo' | 'medio' | 'alto' | 'critico'
  medidas_control: string[]
  responsable: string
  estado: 'activo' | 'controlado' | 'mitigado'
  fecha_evaluacion: string
  fecha_revision: string
}

interface MedidaPreventiva {
  id: string
  factor_riesgo_id: string
  descripcion: string
  tipo: 'preventiva' | 'correctiva' | 'detectiva'
  prioridad: 'alta' | 'media' | 'baja'
  estado: 'planificada' | 'en_ejecucion' | 'completada'
  responsable: string
  fecha_limite: string
  recursos_necesarios: string[]
}

export default function MapasRiesgosAvanzadoPage() {
  const [factoresRiesgo, setFactoresRiesgo] = useState<FactorRiesgo[]>([
    {
      id: 'FR-001',
      categoria: 'personal',
      nombre: 'Personal sin formación LOPIVI',
      descripcion: 'Miembros del personal que no han completado la formación obligatoria en protección infantil',
      probabilidad: 'alta',
      impacto: 'mayor',
      nivel_riesgo: 'alto',
      medidas_control: [
        'Verificación de certificados antes del inicio',
        'Formación obligatoria en primeros 30 días',
        'Supervisión estrecha hasta completar formación'
      ],
      responsable: 'Coordinador de Formación',
      estado: 'activo',
      fecha_evaluacion: '2025-09-01',
      fecha_revision: '2025-12-01'
    },
    {
      id: 'FR-002',
      categoria: 'ambiental',
      nombre: 'Espacios sin supervisión adecuada',
      descripcion: 'Áreas del centro donde los menores pueden quedar sin supervisión adulta',
      probabilidad: 'media',
      impacto: 'mayor',
      nivel_riesgo: 'alto',
      medidas_control: [
        'Instalación de cámaras de seguridad',
        'Establecimiento de rutas de supervisión',
        'Política de "nunca solo" - siempre 2 adultos'
      ],
      responsable: 'Delegado Principal',
      estado: 'controlado',
      fecha_evaluacion: '2025-08-15',
      fecha_revision: '2025-11-15'
    },
    {
      id: 'FR-003',
      categoria: 'organizacional',
      nombre: 'Falta de protocolos claros',
      descripcion: 'Ausencia de procedimientos específicos para situaciones de riesgo',
      probabilidad: 'baja',
      impacto: 'moderado',
      nivel_riesgo: 'medio',
      medidas_control: [
        'Desarrollo de manual de protocolos',
        'Formación específica en procedimientos',
        'Revisión trimestral de protocolos'
      ],
      responsable: 'Delegado Suplente',
      estado: 'mitigado',
      fecha_evaluacion: '2025-07-10',
      fecha_revision: '2025-10-10'
    },
    {
      id: 'FR-004',
      categoria: 'tecnologico',
      nombre: 'Uso inadecuado de redes sociales',
      descripcion: 'Riesgo de contacto inapropiado entre personal y menores a través de medios digitales',
      probabilidad: 'alta',
      impacto: 'mayor',
      nivel_riesgo: 'critico',
      medidas_control: [
        'Política estricta de comunicación digital',
        'Monitoreo de redes sociales oficiales',
        'Formación en uso responsable de tecnología'
      ],
      responsable: 'Delegado Principal',
      estado: 'activo',
      fecha_evaluacion: '2025-09-20',
      fecha_revision: '2025-12-20'
    }
  ])

  const [medidasPreventivas, setMedidasPreventivas] = useState<MedidaPreventiva[]>([
    {
      id: 'MP-001',
      factor_riesgo_id: 'FR-001',
      descripcion: 'Implementar sistema de seguimiento automático de certificaciones',
      tipo: 'preventiva',
      prioridad: 'alta',
      estado: 'en_ejecucion',
      responsable: 'Coordinador RRHH',
      fecha_limite: '2025-10-30',
      recursos_necesarios: ['Software de gestión', 'Base de datos', 'Personal técnico']
    },
    {
      id: 'MP-002',
      factor_riesgo_id: 'FR-004',
      descripcion: 'Crear código de conducta digital específico',
      tipo: 'correctiva',
      prioridad: 'alta',
      estado: 'planificada',
      responsable: 'Delegado Principal',
      fecha_limite: '2025-10-15',
      recursos_necesarios: ['Asesoría legal', 'Comité de revisión', 'Material formativo']
    }
  ])

  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroNivel, setFiltroNivel] = useState('')
  const [modalNuevoRiesgo, setModalNuevoRiesgo] = useState(false)
  const [modalGestionRiesgo, setModalGestionRiesgo] = useState(false)
  const [riesgoSeleccionado, setRiesgoSeleccionado] = useState<FactorRiesgo | null>(null)
  const [nuevasMedidas, setNuevasMedidas] = useState('')

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'critico': return 'bg-red-100 text-red-800 border-red-300'
      case 'alto': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'medio': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'bajo': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'personal': return 'bg-blue-100 text-blue-800'
      case 'ambiental': return 'bg-green-100 text-green-800'
      case 'organizacional': return 'bg-purple-100 text-purple-800'
      case 'tecnologico': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const calcularNivelRiesgo = (probabilidad: string, impacto: string) => {
    const probabilidadValues = { muy_baja: 1, baja: 2, media: 3, alta: 4, muy_alta: 5 }
    const impactoValues = { minimo: 1, menor: 2, moderado: 3, mayor: 4, catastrofico: 5 }

    const prob = probabilidadValues[probabilidad as keyof typeof probabilidadValues]
    const imp = impactoValues[impacto as keyof typeof impactoValues]
    const score = prob * imp

    if (score >= 20) return 'critico'
    if (score >= 15) return 'alto'
    if (score >= 10) return 'medio'
    return 'bajo'
  }

  const abrirGestionRiesgo = (riesgo: FactorRiesgo) => {
    setRiesgoSeleccionado(riesgo)
    setNuevasMedidas('')
    setModalGestionRiesgo(true)
  }

  const agregarMedidasControl = () => {
    if (!riesgoSeleccionado || !nuevasMedidas.trim()) return

    const factoresActualizados = factoresRiesgo.map(factor => {
      if (factor.id === riesgoSeleccionado.id) {
        return {
          ...factor,
          medidas_control: [...factor.medidas_control, nuevasMedidas],
          fecha_evaluacion: new Date().toISOString().split('T')[0]
        }
      }
      return factor
    })

    setFactoresRiesgo(factoresActualizados)
    setNuevasMedidas('')
    alert('Nueva medida de control agregada')
  }

  const cambiarEstadoRiesgo = (nuevoEstado: string) => {
    if (!riesgoSeleccionado) return

    const factoresActualizados = factoresRiesgo.map(factor => {
      if (factor.id === riesgoSeleccionado.id) {
        return {
          ...factor,
          estado: nuevoEstado as any,
          fecha_evaluacion: new Date().toISOString().split('T')[0]
        }
      }
      return factor
    })

    setFactoresRiesgo(factoresActualizados)
    setModalGestionRiesgo(false)
    alert(`Estado del riesgo actualizado a: ${nuevoEstado.replace('_', ' ').toUpperCase()}`)
  }

  const factoresFiltrados = factoresRiesgo.filter(factor => {
    const cumpleCategoria = !filtroCategoria || factor.categoria === filtroCategoria
    const cumpleNivel = !filtroNivel || factor.nivel_riesgo === filtroNivel
    return cumpleCategoria && cumpleNivel
  })

  const contarPorNivel = (nivel: string) => {
    return factoresRiesgo.filter(f => f.nivel_riesgo === nivel).length
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mapa de Riesgos Avanzado</h1>
              <p className="text-gray-600 mt-2">Sistema integral de gestión de riesgos LOPIVI</p>
            </div>
            <Link
              href="/dashboard-delegado"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Volver al Dashboard
            </Link>
          </div>
        </div>

        {/* Dashboard de riesgos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-red-600">{contarPorNivel('critico')}</div>
            <div className="text-sm text-gray-600">Riesgos Críticos</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-orange-600">{contarPorNivel('alto')}</div>
            <div className="text-sm text-gray-600">Riesgos Altos</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-yellow-600">{contarPorNivel('medio')}</div>
            <div className="text-sm text-gray-600">Riesgos Medios</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-green-600">{contarPorNivel('bajo')}</div>
            <div className="text-sm text-gray-600">Riesgos Bajos</div>
          </div>
        </div>

        {/* Matriz de riesgos visual */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Matriz de Riesgos</h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-3 bg-gray-100">Probabilidad / Impacto</th>
                  <th className="border border-gray-300 p-3 bg-gray-100">Mínimo</th>
                  <th className="border border-gray-300 p-3 bg-gray-100">Menor</th>
                  <th className="border border-gray-300 p-3 bg-gray-100">Moderado</th>
                  <th className="border border-gray-300 p-3 bg-gray-100">Mayor</th>
                  <th className="border border-gray-300 p-3 bg-gray-100">Catastrófico</th>
                </tr>
              </thead>
              <tbody>
                {['Muy Alta', 'Alta', 'Media', 'Baja', 'Muy Baja'].map((prob, i) => (
                  <tr key={prob}>
                    <td className="border border-gray-300 p-3 bg-gray-100 font-medium">{prob}</td>
                    {[1, 2, 3, 4, 5].map((imp) => {
                      const score = (5 - i) * imp
                      const nivel = score >= 20 ? 'Crítico' : score >= 15 ? 'Alto' : score >= 10 ? 'Medio' : 'Bajo'
                      const color = score >= 20 ? 'bg-red-200' : score >= 15 ? 'bg-orange-200' : score >= 10 ? 'bg-yellow-200' : 'bg-green-200'
                      return (
                        <td key={imp} className={`border border-gray-300 p-3 text-center text-sm font-medium ${color}`}>
                          {nivel}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Todas las categorías</option>
              <option value="personal">Personal</option>
              <option value="ambiental">Ambiental</option>
              <option value="organizacional">Organizacional</option>
              <option value="tecnologico">Tecnológico</option>
            </select>

            <select
              value={filtroNivel}
              onChange={(e) => setFiltroNivel(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Todos los niveles</option>
              <option value="critico">Crítico</option>
              <option value="alto">Alto</option>
              <option value="medio">Medio</option>
              <option value="bajo">Bajo</option>
            </select>

            <button
              onClick={() => setModalNuevoRiesgo(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Nuevo Factor de Riesgo
            </button>
          </div>
        </div>

        {/* Lista de factores de riesgo */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Factores de Riesgo Identificados</h3>

          <div className="space-y-4">
            {factoresFiltrados.map((factor) => (
              <div key={factor.id} className={`border rounded-lg p-4 ${getNivelColor(factor.nivel_riesgo)}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="font-bold text-lg">{factor.id}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoriaColor(factor.categoria)}`}>
                        {factor.categoria.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getNivelColor(factor.nivel_riesgo)}`}>
                        RIESGO {factor.nivel_riesgo.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${factor.estado === 'activo' ? 'bg-red-100 text-red-800' : factor.estado === 'controlado' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {factor.estado.toUpperCase()}
                      </span>
                    </div>

                    <h4 className="font-semibold text-lg text-gray-900 mb-2">{factor.nombre}</h4>
                    <p className="text-gray-700 mb-3">{factor.descripcion}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <span className="font-medium">Probabilidad:</span> {factor.probabilidad.replace('_', ' ')}
                      </div>
                      <div>
                        <span className="font-medium">Impacto:</span> {factor.impacto}
                      </div>
                      <div>
                        <span className="font-medium">Responsable:</span> {factor.responsable}
                      </div>
                    </div>

                    <div className="mb-3">
                      <span className="font-medium text-sm">Medidas de control actuales:</span>
                      <ul className="text-sm text-gray-600 mt-1 ml-4">
                        {factor.medidas_control.slice(0, 2).map((medida, index) => (
                          <li key={index} className="list-disc">{medida}</li>
                        ))}
                        {factor.medidas_control.length > 2 && (
                          <li className="list-disc text-blue-600">
                            +{factor.medidas_control.length - 2} medidas más...
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="text-xs text-gray-500">
                      Última evaluación: {factor.fecha_evaluacion} | Próxima revisión: {factor.fecha_revision}
                    </div>
                  </div>

                  <button
                    onClick={() => abrirGestionRiesgo(factor)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors ml-4"
                  >
                    Gestionar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal gestión de riesgo */}
        {modalGestionRiesgo && riesgoSeleccionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">Gestionar Riesgo: {riesgoSeleccionado.nombre}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-bold mb-3">Información del Riesgo</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>ID:</strong> {riesgoSeleccionado.id}</p>
                    <p><strong>Categoría:</strong> {riesgoSeleccionado.categoria}</p>
                    <p><strong>Nivel:</strong> {riesgoSeleccionado.nivel_riesgo}</p>
                    <p><strong>Estado:</strong> {riesgoSeleccionado.estado}</p>
                    <p><strong>Responsable:</strong> {riesgoSeleccionado.responsable}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-3">Cambiar Estado</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => cambiarEstadoRiesgo('controlado')}
                      className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      Marcar como Controlado
                    </button>
                    <button
                      onClick={() => cambiarEstadoRiesgo('mitigado')}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Marcar como Mitigado
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-bold mb-3">Medidas de Control Actuales</h4>
                <div className="bg-gray-50 rounded-lg p-4 max-h-32 overflow-y-auto">
                  {riesgoSeleccionado.medidas_control.map((medida, index) => (
                    <div key={index} className="text-sm py-1 border-b border-gray-200 last:border-b-0">
                      • {medida}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-bold mb-3">Agregar Nueva Medida de Control</h4>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={nuevasMedidas}
                    onChange={(e) => setNuevasMedidas(e.target.value)}
                    placeholder="Describe la nueva medida de control..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                  />
                  <button
                    onClick={agregarMedidasControl}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Agregar
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-blue-800 mb-2">Análisis de Impacto</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Probabilidad:</strong> {riesgoSeleccionado.probabilidad.replace('_', ' ')}</p>
                    <p><strong>Impacto:</strong> {riesgoSeleccionado.impacto}</p>
                  </div>
                  <div>
                    <p><strong>Nivel calculado:</strong> {riesgoSeleccionado.nivel_riesgo}</p>
                    <p><strong>Revisión:</strong> {riesgoSeleccionado.fecha_revision}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setModalGestionRiesgo(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cerrar
                </button>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Generar Informe
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
