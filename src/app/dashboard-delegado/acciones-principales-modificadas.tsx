{/* Acciones Principales - VERSIÓN MODIFICADA SIN FONDOS DE COLOR */}
<div className="bg-white rounded-xl shadow-lg p-6 mb-8">
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-xl font-bold text-gray-900">Acciones Principales</h3>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
    {/* Botón Enviar Documentación */}
    <button
      onClick={() => setModalEnviarDoc(true)}
      className="border border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50 p-6 rounded-xl transition-all hover:scale-105 shadow-lg"
    >
      <div className="text-center">
        <h4 className="font-bold text-lg mb-2 text-blue-600">Enviar Documentación</h4>
        <p className="text-sm text-gray-600">Enviar protocolos y documentos a miembros de la entidad</p>
      </div>
    </button>

    {/* Botón Caso de Emergencia */}
    <button
      onClick={() => setModalEmergencia(true)}
      className="border border-gray-200 hover:border-red-300 bg-white hover:bg-red-50 p-6 rounded-xl transition-all hover:scale-105 shadow-lg"
    >
      <div className="text-center">
        <h4 className="font-bold text-lg mb-2 text-red-600">Caso de Emergencia</h4>
        <p className="text-sm text-gray-600">Protocolos de actuación ante situaciones críticas</p>
      </div>
    </button>

    {/* Botón Personal */}
    <button
      onClick={() => setModalPersonalCompleto(true)}
      className="border border-gray-200 hover:border-green-300 bg-white hover:bg-green-50 p-6 rounded-xl transition-all hover:scale-105 shadow-lg"
    >
      <div className="text-center">
        <h4 className="font-bold text-lg mb-2 text-green-600">Personal</h4>
        <p className="text-sm text-gray-600">Gestionar miembros y ver historial de interacciones</p>
      </div>
    </button>

    {/* Botón Centro de Notificaciones */}
    <button
      onClick={() => setModalNotificaciones(true)}
      className="border border-gray-200 hover:border-purple-300 bg-white hover:bg-purple-50 p-6 rounded-xl transition-all hover:scale-105 shadow-lg relative"
    >
      <div className="text-center">
        <h4 className="font-bold text-lg mb-2 text-purple-600">Centro de Notificaciones</h4>
        <p className="text-sm text-gray-600">Recordatorios y tareas pendientes LOPIVI</p>
        {conteoNotificaciones.total > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            {conteoNotificaciones.total}
          </div>
        )}
      </div>
    </button>

    {/* Botón Familias */}
    <button
      onClick={() => setModalFamilias(true)}
      className="border border-gray-200 hover:border-pink-300 bg-white hover:bg-pink-50 p-6 rounded-xl transition-all hover:scale-105 shadow-lg"
    >
      <div className="text-center">
        <h4 className="font-bold text-lg mb-2 text-pink-600">Familias</h4>
        <p className="text-sm text-gray-600">Comunicación con familias y tutores</p>
      </div>
    </button>

    {/* Botón Biblioteca LOPIVI */}
    <button
      onClick={() => setModalBiblioteca(true)}
      className="border border-gray-200 hover:border-amber-300 bg-white hover:bg-amber-50 p-6 rounded-xl transition-all hover:scale-105 shadow-lg"
    >
      <div className="text-center">
        <h4 className="font-bold text-lg mb-2 text-amber-600">Biblioteca LOPIVI</h4>
        <p className="text-sm text-gray-600">Documentos y normativas actualizadas</p>
      </div>
    </button>
  </div>
</div>
