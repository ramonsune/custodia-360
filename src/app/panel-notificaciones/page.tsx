'use client';

import { useState, useEffect } from 'react';

interface EmailEnviado {
  fecha: string;
  tipo: string;
  destinatario: string;
  asunto: string;
  mensaje: string;
  entidad: string;
  usuario: string;
}

export default function PanelNotificacionesPage() {
  const [emailsEnviados, setEmailsEnviados] = useState<EmailEnviado[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');

  useEffect(() => {
    cargarEmails();
  }, []);

  const cargarEmails = () => {
    const emails = JSON.parse(localStorage.getItem('emails_enviados') || '[]');
    setEmailsEnviados(emails.reverse()); // Más recientes primero
  };

  const limpiarEmails = () => {
    if (confirm('¿Estás seguro de que quieres limpiar todas las notificaciones?')) {
      localStorage.removeItem('emails_enviados');
      setEmailsEnviados([]);
    }
  };

  const simularDias = (dias: number) => {
    if (confirm(`¿Simular que han pasado ${dias} días desde la contratación?`)) {
      // Obtener todas las fechas de contratación
      const keys = Object.keys(localStorage);
      const fechasContratacion = keys.filter(key => key.startsWith('fecha_contratacion_'));

      fechasContratacion.forEach(key => {
        const fechaOriginal = new Date(localStorage.getItem(key) || '');
        const fechaSimulada = new Date(fechaOriginal.getTime() - (dias * 24 * 60 * 60 * 1000));
        localStorage.setItem(key, fechaSimulada.toISOString());
      });

      // Limpiar notificaciones enviadas para que se puedan enviar de nuevo
      const entidades = [...new Set(keys.filter(k => k.startsWith('notificaciones_')))];
      entidades.forEach(key => localStorage.removeItem(key));

      alert(`Simulación aplicada. Las fechas de contratación se han movido ${dias} días hacia atrás.`);
      window.location.reload();
    }
  };

  const resetearConfiguracion = (entidad: string) => {
    if (confirm(`¿Resetear configuración de ${entidad}?`)) {
      localStorage.removeItem(`canal_comunicacion_${entidad}`);
      localStorage.removeItem(`notificaciones_${entidad}`);

      // Buscar usuarios de esta entidad y eliminar sus certificados
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('certificados_')) {
          const userSession = localStorage.getItem('userSession');
          if (userSession) {
            const userData = JSON.parse(userSession);
            if (userData.entidad === entidad) {
              localStorage.removeItem(key);
            }
          }
        }
      });

      alert(`Configuración de ${entidad} reseteada.`);
      cargarEmails();
    }
  };

  const emailsFiltrados = emailsEnviados.filter(email => {
    if (filtroTipo === 'todos') return true;
    return email.tipo === filtroTipo;
  });

  const getEstadisticas = () => {
    const entidades = [...new Set(emailsEnviados.map(e => e.entidad))];
    const notificaciones15 = emailsEnviados.filter(e => e.tipo.includes('15')).length;
    const notificaciones30 = emailsEnviados.filter(e => e.tipo.includes('30')).length;

    return {
      totalEmails: emailsEnviados.length,
      entidadesAfectadas: entidades.length,
      notificaciones15,
      notificaciones30
    };
  };

  const stats = getEstadisticas();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Panel de Notificaciones LOPIVI</h1>
          <p className="text-blue-100">Sistema de gestión de bloqueos y notificaciones automáticas</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">{stats.totalEmails}</div>
            <div className="text-gray-600">Emails Enviados</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">{stats.entidadesAfectadas}</div>
            <div className="text-gray-600">Entidades Afectadas</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-orange-600">{stats.notificaciones15}</div>
            <div className="text-gray-600">Avisos 15 días</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-red-600">{stats.notificaciones30}</div>
            <div className="text-gray-600">Bloqueos</div>
          </div>
        </div>

        {/* Controles de testing */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">🧪 Controles de Testing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium mb-2">Simular días transcurridos:</h3>
              <div className="space-y-2">
                <button
                  onClick={() => simularDias(10)}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Simular 10 días
                </button>
                <button
                  onClick={() => simularDias(15)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Simular 15 días (Notificación)
                </button>
                <button
                  onClick={() => simularDias(30)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Simular 30 días (Bloqueo)
                </button>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Gestión de datos:</h3>
              <div className="space-y-2">
                <button
                  onClick={limpiarEmails}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Limpiar Notificaciones
                </button>
                <button
                  onClick={() => {
                    if (confirm('¿Resetear TODAS las configuraciones?')) {
                      const keys = Object.keys(localStorage);
                      keys.forEach(key => {
                        if (key.startsWith('canal_comunicacion_') ||
                            key.startsWith('certificados_') ||
                            key.startsWith('notificaciones_') ||
                            key.startsWith('fecha_contratacion_')) {
                          localStorage.removeItem(key);
                        }
                      });
                      alert('Todas las configuraciones han sido reseteadas.');
                      cargarEmails();
                    }
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Reset Total
                </button>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Estado del sistema:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div>• Emails simulados en localStorage</div>
                <div>• Fechas de contratación registradas</div>
                <div>• Configuraciones por entidad</div>
                <div>• Sistema de bloqueos activo</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Filtros</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFiltroTipo('todos')}
              className={`px-4 py-2 rounded ${filtroTipo === 'todos'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Todos ({emailsEnviados.length})
            </button>
            <button
              onClick={() => setFiltroTipo('contratante_15')}
              className={`px-4 py-2 rounded ${filtroTipo === 'contratante_15'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Contratante 15 días
            </button>
            <button
              onClick={() => setFiltroTipo('delegado_15')}
              className={`px-4 py-2 rounded ${filtroTipo === 'delegado_15'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Delegado 15 días
            </button>
            <button
              onClick={() => setFiltroTipo('contratante_30')}
              className={`px-4 py-2 rounded ${filtroTipo === 'contratante_30'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Contratante Bloqueo
            </button>
            <button
              onClick={() => setFiltroTipo('delegado_30')}
              className={`px-4 py-2 rounded ${filtroTipo === 'delegado_30'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Delegado Bloqueo
            </button>
          </div>
        </div>

        {/* Lista de notificaciones */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Notificaciones Enviadas ({emailsFiltrados.length})</h2>
          </div>
          <div className="divide-y">
            {emailsFiltrados.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No hay notificaciones registradas
              </div>
            ) : (
              emailsFiltrados.map((email, index) => (
                <div key={index} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          email.tipo.includes('30')
                            ? 'bg-red-100 text-red-800'
                            : email.tipo.includes('15')
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {email.tipo.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(email.fecha).toLocaleString('es-ES')}
                        </span>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">{email.asunto}</h3>
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Para:</strong> {email.destinatario} |
                        <strong> Entidad:</strong> {email.entidad} |
                        <strong> Usuario:</strong> {email.usuario}
                      </div>
                      <details className="text-sm text-gray-700">
                        <summary className="cursor-pointer hover:text-gray-900">Ver mensaje completo</summary>
                        <div className="mt-2 p-3 bg-gray-50 rounded whitespace-pre-line">
                          {email.mensaje}
                        </div>
                      </details>
                    </div>
                    <button
                      onClick={() => resetearConfiguracion(email.entidad)}
                      className="ml-4 text-red-600 hover:text-red-800 text-sm"
                    >
                      Reset Config
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
