export default function AccesoSimple() {
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>ACCESO SIMPLE - SIN COMPLICACIONES</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>

        <a href="/dashboard-entidad" style={{ textDecoration: 'none' }}>
          <div style={{ backgroundColor: '#3b82f6', color: 'white', padding: '30px', borderRadius: '10px', textAlign: 'center', cursor: 'pointer' }}>
            <h2 style={{ margin: '0 0 10px 0' }}>CONTRATANTE</h2>
            <p style={{ margin: '0' }}>Dashboard Entidad</p>
          </div>
        </a>

        <a href="/login-delegados" style={{ textDecoration: 'none' }}>
          <div style={{ backgroundColor: '#10b981', color: 'white', padding: '30px', borderRadius: '10px', textAlign: 'center', cursor: 'pointer' }}>
            <h2 style={{ margin: '0 0 10px 0' }}>DELEGADO PRINCIPAL</h2>
            <p style={{ margin: '0' }}>Iniciar Sesión</p>
          </div>
        </a>

        <a href="/login-delegados?tipo=suplente" style={{ textDecoration: 'none' }}>
          <div style={{ backgroundColor: '#f59e0b', color: 'white', padding: '30px', borderRadius: '10px', textAlign: 'center', cursor: 'pointer' }}>
            <h2 style={{ margin: '0 0 10px 0' }}>DELEGADO SUPLENTE</h2>
            <p style={{ margin: '0' }}>Iniciar Sesión</p>
          </div>
        </a>

        <a href="/bienvenida-delegado-principal" style={{ textDecoration: 'none' }}>
          <div style={{ backgroundColor: '#8b5cf6', color: 'white', padding: '30px', borderRadius: '10px', textAlign: 'center', cursor: 'pointer' }}>
            <h2 style={{ margin: '0 0 10px 0' }}>NUEVO DELEGADO</h2>
            <p style={{ margin: '0' }}>Formación Delegado</p>
          </div>
        </a>

        <a href="/bienvenida-delegado-suplente" style={{ textDecoration: 'none' }}>
          <div style={{ backgroundColor: '#6366f1', color: 'white', padding: '30px', borderRadius: '10px', textAlign: 'center', cursor: 'pointer' }}>
            <h2 style={{ margin: '0 0 10px 0' }}>NUEVO SUPLENTE</h2>
            <p style={{ margin: '0' }}>Formación Suplente</p>
          </div>
        </a>

        <a href="/dashboard-custodia360" style={{ textDecoration: 'none' }}>
          <div style={{ backgroundColor: '#374151', color: 'white', padding: '30px', borderRadius: '10px', textAlign: 'center', cursor: 'pointer' }}>
            <h2 style={{ margin: '0 0 10px 0' }}>CUSTODIA360</h2>
            <p style={{ margin: '0' }}>Dashboard Admin</p>
          </div>
        </a>

      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <a href="/" style={{ color: '#3b82f6', textDecoration: 'none' }}>← Volver al inicio</a>
      </div>

      <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', padding: '16px', marginTop: '40px', maxWidth: '600px', margin: '40px auto 0' }}>
        <h3 style={{ color: '#dc2626', margin: '0 0 10px 0' }}>PÁGINA DE EMERGENCIA</h3>
        <p style={{ color: '#7f1d1d', margin: '0', fontSize: '14px' }}>
          Esta página usa solo HTML básico. Si estos enlaces no funcionan, el problema es más profundo.
          Cada enlace debería llevarte directamente al dashboard correspondiente.
        </p>
      </div>
    </div>
  )
}
