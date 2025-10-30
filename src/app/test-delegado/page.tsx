'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestDelegadoPage() {
  const [delegados, setDelegados] = useState<any[]>([])
  const [entidades, setEntidades] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Cargar delegados existentes
  const cargarDelegados = async () => {
    try {
      const { data, error } = await supabase
        .from('delegados')
        .select(`
          *,
          entidades (
            id,
            nombre,
            tipo_entidad,
            plan
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setDelegados(data || [])
    } catch (error) {
      console.error('Error cargando delegados:', error)
    }
  }

  // Cargar entidades existentes
  const cargarEntidades = async () => {
    try {
      const { data, error } = await supabase
        .from('entidades')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setEntidades(data || [])
    } catch (error) {
      console.error('Error cargando entidades:', error)
    }
  }

  // Crear delegados de prueba
  const crearDelegadosPrueba = async () => {
    setLoading(true)
    setMessage('')

    try {
      // Primero crear una entidad de prueba si no existe
      let entidadPrueba
      const entidadExistente = entidades.find(e => e.cif === 'A12345678')

      if (!entidadExistente) {
        const { data: nuevaEntidad, error: entidadError } = await supabase
          .from('entidades')
          .insert({
            nombre: 'Club Deportivo Demo',
            cif: 'A12345678',
            direccion: 'Calle Demo 123',
            ciudad: 'Madrid',
            codigo_postal: '28001',
            provincia: 'Madrid',
            telefono: '912345678',
            email: 'admin@clubdemo.com',
            tipo_entidad: 'deportivo',
            numero_menores: 50,
            plan: 'Plan Básico',
            precio_mensual: 29.99,
            dashboard_email: 'admin@clubdemo.com',
            dashboard_password: 'admin123',
            legal_hash: 'demo_hash_' + Date.now()
          })
          .select()
          .single()

        if (entidadError) throw entidadError
        entidadPrueba = nuevaEntidad
      } else {
        entidadPrueba = entidadExistente
      }

      // Crear delegados de prueba
      const delegadosDemo = [
        {
          entidad_id: entidadPrueba.id,
          tipo: 'principal',
          nombre: 'Maria',
          apellidos: 'García López',
          dni: '12345678A',
          telefono: '612345678',
          email: 'maria.garcia@clubdeportivo.com',
          password: 'delegado123',
          experiencia: 'Formadora deportiva con 5 años de experiencia',
          disponibilidad: 'Tiempo completo',
          certificado_penales: true,
          estado: 'activo'
        },
        {
          entidad_id: entidadPrueba.id,
          tipo: 'suplente',
          nombre: 'Carlos',
          apellidos: 'Rodríguez Fernández',
          dni: '87654321B',
          telefono: '698765432',
          email: 'carlos.rodriguez@clubdeportivo.com',
          password: 'suplente123',
          experiencia: 'Monitor deportivo',
          disponibilidad: 'Tiempo parcial',
          certificado_penales: true,
          estado: 'activo'
        }
      ]

      // Verificar si ya existen antes de crearlos
      for (const delegadoDemo of delegadosDemo) {
        const existeEmail = delegados.find(d => d.email === delegadoDemo.email)

        if (!existeEmail) {
          const { error } = await supabase
            .from('delegados')
            .insert(delegadoDemo)

          if (error) {
            console.error('Error creando delegado:', error)
          } else {
            console.log('✅ Delegado creado:', delegadoDemo.email)
          }
        } else {
          console.log('ℹ️ Delegado ya existe:', delegadoDemo.email)
        }
      }

      setMessage('✅ Delegados de prueba verificados/creados exitosamente')
      await cargarDelegados()

    } catch (error) {
      console.error('Error creando delegados:', error)
      setMessage('❌ Error: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarEntidades()
    cargarDelegados()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🧪 Test - Delegados LOPIVI
          </h1>
          <p className="text-gray-600">
            Verificar y crear delegados de prueba en Supabase
          </p>
        </div>

        {/* Acciones */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones</h2>

          <div className="flex gap-4 mb-4">
            <button
              onClick={crearDelegadosPrueba}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creando...' : 'Crear/Verificar Delegados de Prueba'}
            </button>

            <button
              onClick={() => { cargarDelegados(); cargarEntidades(); }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Recargar Datos
            </button>
          </div>

          {message && (
            <div className={`p-3 rounded ${message.includes('❌') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}
        </div>

        {/* Credenciales de acceso */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-blue-800 mb-4">🔑 Credenciales para Login</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded border">
              <h3 className="font-bold text-gray-900 mb-2">Delegado Principal</h3>
              <p><strong>Email:</strong> maria.garcia@clubdeportivo.com</p>
              <p><strong>Contraseña:</strong> delegado123</p>
              <p><strong>URL:</strong> <a href="/login-delegados?tipo=principal" className="text-blue-600 hover:underline">/login-delegados?tipo=principal</a></p>
            </div>
            <div className="bg-white p-4 rounded border">
              <h3 className="font-bold text-gray-900 mb-2">Delegado Suplente</h3>
              <p><strong>Email:</strong> carlos.rodriguez@clubdeportivo.com</p>
              <p><strong>Contraseña:</strong> suplente123</p>
              <p><strong>URL:</strong> <a href="/login-delegados?tipo=suplente" className="text-blue-600 hover:underline">/login-delegados?tipo=suplente</a></p>
            </div>
          </div>
        </div>

        {/* Entidades existentes */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            🏢 Entidades en Supabase ({entidades.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">CIF</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {entidades.map((entidad) => (
                  <tr key={entidad.id}>
                    <td className="px-4 py-2 text-sm text-gray-900">{entidad.id}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{entidad.nombre}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{entidad.cif}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{entidad.tipo_entidad}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{entidad.plan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delegados existentes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            👥 Delegados en Supabase ({delegados.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Entidad</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {delegados.map((delegado) => (
                  <tr key={delegado.id}>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {delegado.nombre} {delegado.apellidos}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500">{delegado.email}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">
                      <span className={`px-2 py-1 text-xs rounded ${
                        delegado.tipo === 'principal'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {delegado.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500">
                      {delegado.entidades?.nombre || 'Sin entidad'}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500">
                      <span className={`px-2 py-1 text-xs rounded ${
                        delegado.estado === 'activo'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {delegado.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
          >
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  )
}
