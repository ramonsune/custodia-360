'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  entidad: string;
  tipo: string;
}

export default function ConfiguracionCanalPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [canalSeleccionado, setCanalSeleccionado] = useState<string>('');
  const [configuracion, setConfiguracion] = useState({
    telefono: '',
    email: '',
    horario: '',
    responsable: '',
    instrucciones: ''
  });
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    const userSession = localStorage.getItem('userSession');
    if (!userSession) {
      router.push('/login-delegados');
      return;
    }

    try {
      const userData = JSON.parse(userSession);
      setUsuario(userData);

      // Cargar configuración existente si la hay
      const canalExistente = localStorage.getItem(`canal_comunicacion_${userData.entidad}`);
      if (canalExistente) {
        const config = JSON.parse(canalExistente);
        setCanalSeleccionado(config.tipo);
        setConfiguracion(config.configuracion);
        setGuardado(true);
      }
    } catch (error) {
      console.error('Error loading session:', error);
      router.push('/login-delegados');
    }
  }, [router]);

  const handleGuardarConfiguracion = async () => {
    if (!canalSeleccionado || !usuario) return;

    setGuardando(true);

    try {
      const configCompleta = {
        tipo: canalSeleccionado,
        configuracion,
        fechaConfiguracion: new Date().toISOString(),
        configuradoPor: usuario.nombre
      };

      localStorage.setItem(`canal_comunicacion_${usuario.entidad}`, JSON.stringify(configCompleta));

      setGuardado(true);

      // Mostrar mensaje de éxito y redirigir al dashboard correcto
      setTimeout(() => {
        if (usuario.tipo === 'suplente') {
          router.push('/dashboard-suplente');
        } else {
          router.push('/dashboard-delegado');
        }
      }, 2000);

    } catch (error) {
      console.error('Error guardando configuración:', error);
      alert('Error al guardar la configuración. Inténtalo de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  if (!usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Configuración del Canal de Comunicación
              </h1>
              <p className="text-gray-600 mt-1">
                Entidad: {usuario.entidad} | Configurado por: {usuario.nombre}
              </p>
            </div>
            <button
              onClick={() => {
                if (usuario?.tipo === 'suplente') {
                  router.push('/dashboard-suplente');
                } else {
                  router.push('/dashboard-delegado');
                }
              }}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-gray-700 transition-colors"
            >
              ← Volver al Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {guardado && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-800 font-medium">✅ Configuración guardada correctamente</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Canal de Comunicación para Menores y Familias
            </h2>
            <p className="text-gray-600">
              Configura un canal de comunicación accesible donde menores y familias puedan
              reportar situaciones de riesgo o realizar consultas relacionadas con la protección infantil.
            </p>
          </div>

          {/* Selección de tipo de canal */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tipo de Canal</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setCanalSeleccionado('telefono')}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  canalSeleccionado === 'telefono'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <svg className="w-8 h-8 mx-auto mb-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <h4 className="font-medium">Línea Telefónica</h4>
                  <p className="text-sm text-gray-600">Contacto directo por teléfono</p>
                </div>
              </button>

              <button
                onClick={() => setCanalSeleccionado('email')}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  canalSeleccionado === 'email'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <svg className="w-8 h-8 mx-auto mb-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h4 className="font-medium">Email Dedicado</h4>
                  <p className="text-sm text-gray-600">Correo electrónico específico</p>
                </div>
              </button>

              <button
                onClick={() => setCanalSeleccionado('mixto')}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  canalSeleccionado === 'mixto'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <svg className="w-8 h-8 mx-auto mb-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.001 8.001 0 01-7.745-6H5c-.552 0-1-.448-1-1s.448-1 1-1h.255a8.001 8.001 0 0115.49 0H21c.552 0 1 .448 1 1s-.448 1-1 1h-.255A8.001 8.001 0 0121 12z" />
                  </svg>
                  <h4 className="font-medium">Canal Mixto</h4>
                  <p className="text-sm text-gray-600">Teléfono + Email</p>
                </div>
              </button>
            </div>
          </div>

          {/* Configuración específica */}
          {canalSeleccionado && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Configuración del Canal</h3>

              {(canalSeleccionado === 'telefono' || canalSeleccionado === 'mixto') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={configuracion.telefono}
                    onChange={(e) => setConfiguracion({...configuracion, telefono: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: +34 900 123 456"
                    required
                  />
                </div>
              )}

              {(canalSeleccionado === 'email' || canalSeleccionado === 'mixto') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección de Email *
                  </label>
                  <input
                    type="email"
                    value={configuracion.email}
                    onChange={(e) => setConfiguracion({...configuracion, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: proteccion@entidad.com"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horario de Atención *
                </label>
                <input
                  type="text"
                  value={configuracion.horario}
                  onChange={(e) => setConfiguracion({...configuracion, horario: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Lunes a Viernes de 9:00 a 18:00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Responsable del Canal *
                </label>
                <input
                  type="text"
                  value={configuracion.responsable}
                  onChange={(e) => setConfiguracion({...configuracion, responsable: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre del responsable de atender las comunicaciones"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instrucciones para Menores y Familias
                </label>
                <textarea
                  value={configuracion.instrucciones}
                  onChange={(e) => setConfiguracion({...configuracion, instrucciones: e.target.value})}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Instrucciones claras sobre cómo usar este canal de comunicación..."
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">ℹ️ Información importante:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Este canal debe estar disponible para menores y familias las 24 horas</li>
                  <li>• Es obligatorio responder en un plazo máximo de 24 horas</li>
                  <li>• Todas las comunicaciones deben documentarse según protocolos LOPIVI</li>
                  <li>• El canal debe ser confidencial y seguro</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    if (usuario?.tipo === 'suplente') {
                      router.push('/dashboard-suplente');
                    } else {
                      router.push('/dashboard-delegado');
                    }
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGuardarConfiguracion}
                  disabled={guardando || !canalSeleccionado}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    guardando || !canalSeleccionado
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  {guardando ? 'Guardando...' : 'Guardar Configuración'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
