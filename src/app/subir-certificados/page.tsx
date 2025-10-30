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

interface CertificadoSubido {
  archivo: string;
  fecha: string;
  nombre: string;
  tamaño: number;
}

export default function SubirCertificadosPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [certificadoSubido, setCertificadoSubido] = useState<CertificadoSubido | null>(null);
  const [subiendo, setSubiendo] = useState(false);
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

      // Cargar certificado existente si lo hay
      const certificadoExistente = localStorage.getItem(`certificados_${userData.id}`);
      if (certificadoExistente) {
        setCertificadoSubido(JSON.parse(certificadoExistente));
        setGuardado(true);
      }
    } catch (error) {
      console.error('Error loading session:', error);
      router.push('/login-delegados');
    }
  }, [router]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !usuario) return;

    // Validaciones
    if (file.size > 5 * 1024 * 1024) { // 5MB máximo
      alert('El archivo no puede superar los 5MB');
      return;
    }

    if (!file.type.includes('pdf') && !file.type.includes('image')) {
      alert('Solo se permiten archivos PDF o imágenes (JPG, PNG)');
      return;
    }

    setSubiendo(true);

    try {
      // Simular subida de archivo - en producción sería una API real
      const reader = new FileReader();
      reader.onload = (e) => {
        const resultado = e.target?.result as string;

        const certificadoData = {
          archivo: resultado,
          fecha: new Date().toISOString(),
          nombre: file.name,
          tamaño: file.size
        };

        localStorage.setItem(`certificados_${usuario.id}`, JSON.stringify(certificadoData));
        setCertificadoSubido(certificadoData);
        setGuardado(true);
        setSubiendo(false);

        // Mostrar mensaje de éxito y redirigir al dashboard correcto
        setTimeout(() => {
          if (usuario.tipo === 'suplente') {
            router.push('/dashboard-suplente');
          } else {
            router.push('/dashboard-delegado');
          }
        }, 2000);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error subiendo archivo:', error);
      alert('Error al subir el archivo. Inténtalo de nuevo.');
      setSubiendo(false);
    }
  };

  const eliminarCertificado = () => {
    if (!usuario) return;

    const confirmacion = confirm('¿Estás seguro de que quieres eliminar este certificado?');
    if (confirmacion) {
      localStorage.removeItem(`certificados_${usuario.id}`);
      setCertificadoSubido(null);
      setGuardado(false);
    }
  };

  const formatearTamaño = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
                Certificado de Antecedentes Penales
              </h1>
              <p className="text-gray-600 mt-1">
                {usuario.nombre} | {usuario.entidad}
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
              <p className="text-green-800 font-medium">✅ Certificado subido correctamente</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Subir Certificado de Antecedentes Penales
            </h2>
            <p className="text-gray-600">
              Según la normativa LOPIVI, todos los delegados de protección deben aportar
              un certificado de antecedentes penales actualizado para poder ejercer sus funciones.
            </p>
          </div>

          {/* Información sobre el certificado */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-900 mb-2">📋 Requisitos del Certificado:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Certificado de antecedentes penales emitido por el Ministerio de Justicia</li>
              <li>• Vigencia máxima de 3 meses desde la fecha de emisión</li>
              <li>• Debe incluir antecedentes relacionados con delitos contra menores</li>
              <li>• Formato válido: PDF o imagen (JPG, PNG)</li>
              <li>• Tamaño máximo: 5MB</li>
            </ul>
          </div>

          {/* Zona de subida de archivos */}
          {!certificadoSubido ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Subir Certificado de Antecedentes Penales
                </h3>
                <p className="text-gray-600 mb-4">
                  Arrastra tu archivo aquí o haz clic para seleccionar
                </p>
                <label className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg cursor-pointer transition-colors">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  {subiendo ? 'Subiendo...' : 'Seleccionar Archivo'}
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    disabled={subiendo}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  PDF, JPG, PNG hasta 5MB
                </p>
              </div>
            </div>
          ) : (
            /* Archivo subido */
            <div className="border border-green-200 rounded-lg p-6 bg-green-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-green-900">{certificadoSubido.nombre}</h3>
                    <p className="text-sm text-green-700">
                      Subido el {new Date(certificadoSubido.fecha).toLocaleDateString('es-ES')} • {formatearTamaño(certificadoSubido.tamaño)}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = certificadoSubido.archivo;
                      link.download = certificadoSubido.nombre;
                      link.click();
                    }}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                  >
                    Descargar
                  </button>
                  <button
                    onClick={eliminarCertificado}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Información legal */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">⚖️ Información Legal:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Este certificado es obligatorio según el artículo 20 de la LOPIVI</li>
              <li>• Los datos serán tratados conforme al RGPD y legislación de protección de datos</li>
              <li>• El certificado se archivará de forma segura y confidencial</li>
              <li>• Solo personal autorizado tendrá acceso a esta documentación</li>
              <li>• Deberás renovar el certificado cuando caduque</li>
            </ul>
          </div>

          {/* Enlaces útiles */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">🔗 Enlaces Útiles:</h3>
            <div className="space-y-2">
              <a
                href="https://sede.mjusticia.gob.es/cs/Satellite/Sede/es/tramites/certificado-antecedentes"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-700 hover:text-blue-900 text-sm underline"
              >
                → Solicitar Certificado de Antecedentes Penales (Ministerio de Justicia)
              </a>
              <a
                href="https://www.boe.es/buscar/doc.php?id=BOE-A-2021-9347"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-700 hover:text-blue-900 text-sm underline"
              >
                → Consultar Ley Orgánica 8/2021 (LOPIVI)
              </a>
            </div>
          </div>

          {/* Botón continuar */}
          {certificadoSubido && (
            <div className="mt-6 text-center">
              <button
                onClick={() => router.push('/sistema-bloqueado')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                ✅ Continuar con la Configuración
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
