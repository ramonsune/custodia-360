'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verificarEstadoConfiguracion, calcularEstadoBloqueo } from '@/utils/sistemaBloqueo';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  entidad: string;
  tipo: string;
}

export default function SistemaBloqueadoPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [accionesPendientes, setAccionesPendientes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userSession = localStorage.getItem('userSession');
    if (!userSession) {
      router.push('/login-delegados');
      return;
    }

    try {
      const userData = JSON.parse(userSession);
      setUsuario(userData);

      // Verificar estado de configuración
      const configuracion = verificarEstadoConfiguracion(userData);
      const estado = calcularEstadoBloqueo(configuracion);

      setAccionesPendientes(estado.accionesPendientes);

      // Si la configuración está completa, redirigir al dashboard
      if (!estado.bloqueado) {
        if (userData.tipo === 'suplente') {
          router.push('/dashboard-suplente');
        } else {
          router.push('/dashboard-delegado');
        }
        return;
      }
    } catch (error) {
      console.error('Error loading session:', error);
      router.push('/login-delegados');
    }

    setLoading(false);
  }, [router]);

  const configurarCanalComunicacion = () => {
    router.push('/configuracion-canal');
  };

  const subirCertificados = () => {
    router.push('/subir-certificados');
  };

  const verificarConfiguracion = () => {
    if (!usuario) return;

    const configuracion = verificarEstadoConfiguracion(usuario);
    const estado = calcularEstadoBloqueo(configuracion);

    if (!estado.bloqueado) {
      // Configuración completa, redirigir al dashboard
      if (usuario.tipo === 'suplente') {
        router.push('/dashboard-suplente');
      } else {
        router.push('/dashboard-delegado');
      }
    } else {
      // Actualizar acciones pendientes
      setAccionesPendientes(estado.accionesPendientes);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Verificando configuración...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-xl border-l-4 border-red-600">
          {/* Header de bloqueo */}
          <div className="bg-red-600 text-white p-6 rounded-t-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m12-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h1 className="text-2xl font-bold">🚫 SISTEMA BLOQUEADO</h1>
                <p className="text-red-100 mt-1">Configuración obligatoria pendiente</p>
              </div>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Hola {usuario.nombre},
              </h2>
              <p className="text-gray-700 mb-4">
                Para cumplir con la normativa LOPIVI y reactivar tu acceso a Custodia360,
                debes completar la siguiente configuración obligatoria:
              </p>
            </div>

            {/* Lista de acciones pendientes */}
            <div className="space-y-4 mb-8">
              {accionesPendientes.includes('Canal de comunicación') && (
                <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.001 8.001 0 01-7.745-6H5c-.552 0-1-.448-1-1s.448-1 1-1h.255a8.001 8.001 0 0115.49 0H21c.552 0 1 .448 1 1s-.448 1-1 1h-.255A8.001 8.001 0 0121 12z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium text-orange-900">Canal de comunicación</h3>
                        <p className="text-sm text-orange-700">
                          Configura el canal de comunicación para menores y familias
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={configurarCanalComunicacion}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      CONFIGURAR AHORA
                    </button>
                  </div>
                </div>
              )}

              {accionesPendientes.includes('Certificados de antecedentes penales') && (
                <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium text-blue-900">Certificados de antecedentes penales</h3>
                        <p className="text-sm text-blue-700">
                          Sube tu certificado de antecedentes penales actualizado
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={subirCertificados}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      SUBIR CERTIFICADO
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Información adicional */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-2">ℹ️ Información importante:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• El sistema permanecerá bloqueado hasta completar toda la configuración</li>
                <li>• Esta configuración es obligatoria según la normativa LOPIVI</li>
                <li>• Una vez completada, tendrás acceso completo a Custodia360</li>
                <li>• El responsable de contratación ha sido notificado del bloqueo</li>
              </ul>
            </div>

            {/* Botón verificar */}
            <div className="text-center">
              <button
                onClick={verificarConfiguracion}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                ✅ VERIFICAR CONFIGURACIÓN
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Pulsa aquí después de completar las acciones para verificar el estado
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            ¿Necesitas ayuda? Contacta con soporte:
            <a href="mailto:soporte@custodia360.com" className="text-blue-600 hover:text-blue-800 ml-1">
              soporte@custodia360.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
