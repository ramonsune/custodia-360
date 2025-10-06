'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  tipo: string;
  entidad: string;
  certificacionVigente?: boolean;
  formacionCompletada?: boolean;
  tipoEntidad?: string | null;
}

// Datos de formación específicos para delegados suplentes
const formacionDataSuplente = {
  1: {
    titulo: "Introducción a la LOPIVI para Suplentes",
    secciones: [
      {
        titulo: "Marco Legal y su Aplicación como Suplente",
        contenido: "Como Delegado Suplente, su función trasciende el simple apoyo para convertirse en un elemento crucial de continuidad y robustez del sistema de protección. La LOPIVI no solo permite sino que exige la designación de un delegado suplente."
      }
    ]
  },
  2: {
    titulo: "Funciones Específicas del Delegado Suplente",
    secciones: [
      {
        titulo: "Coordinación con el Delegado Principal",
        contenido: "El delegado suplente debe mantener una comunicación fluida y coordinación efectiva con el delegado principal en todo momento."
      }
    ]
  }
};

export default function FormacionSuplente() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [moduloActual, setModuloActual] = useState(1);
  const [seccionActual, setSeccionActual] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const userSession = localStorage.getItem('userSession');
    if (!userSession) {
      router.push('/admin/login');
      return;
    }

    try {
      const userData = JSON.parse(userSession);
      setUsuario(userData);
    } catch (error) {
      console.error('Error parsing user session:', error);
      router.push('/admin/login');
    }
  }, [router]);

  const moduloActualData = formacionDataSuplente[moduloActual as keyof typeof formacionDataSuplente];
  const seccionActualData = moduloActualData?.secciones[seccionActual];

  if (!usuario) {
    return <div className="min-h-screen flex items-center justify-center text-gray-700">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Formación Especializada - Delegado Suplente
              </h1>
              <p className="text-gray-600">
                Módulo {moduloActual}: {moduloActualData?.titulo}
              </p>
            </div>

            {seccionActualData && (
              <div className="contenido-modulo">
                <h2 className="text-2xl font-semibold text-purple-800 mb-4">
                  {seccionActualData.titulo}
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {seccionActualData.contenido}
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button
                onClick={() => {
                  if (seccionActual > 0) {
                    setSeccionActual(seccionActual - 1);
                  } else if (moduloActual > 1) {
                    setModuloActual(moduloActual - 1);
                    setSeccionActual(0);
                  }
                }}
                disabled={moduloActual === 1 && seccionActual === 0}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>

              <button
                onClick={() => {
                  const moduloData = formacionDataSuplente[moduloActual as keyof typeof formacionDataSuplente];
                  if (seccionActual < moduloData.secciones.length - 1) {
                    setSeccionActual(seccionActual + 1);
                  } else if (moduloActual < Object.keys(formacionDataSuplente).length) {
                    setModuloActual(moduloActual + 1);
                    setSeccionActual(0);
                  }
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
