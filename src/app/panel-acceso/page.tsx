'use client'

export default function PanelAcceso() {
  const irA = (url: string) => {
    console.log('Navegando a:', url)
    window.open(url, '_self')
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <h1 style={{
          textAlign: 'center',
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '20px'
        }}>
          🎯 ACCESO DIRECTO A DASHBOARDS
        </h1>

        <p style={{
          textAlign: 'center',
          color: '#6b7280',
          marginBottom: '50px',
          fontSize: '1.1rem'
        }}>
          Haz clic en cualquier botón para ir directamente al dashboard
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '25px'
        }}>

          {/* CONTRATANTE */}
          <button
            onClick={() => irA('/dashboard-entidad')}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '40px 30px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🏢</div>
            <div style={{ fontSize: '1.3rem', marginBottom: '8px' }}>CONTRATANTE</div>
            <div style={{ fontSize: '0.9rem', opacity: '0.9' }}>Dashboard de Entidad</div>
          </button>

          {/* DELEGADO */}
          <button
            onClick={() => irA('/login-delegados')}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              padding: '40px 30px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>👨‍💼</div>
            <div style={{ fontSize: '1.3rem', marginBottom: '8px' }}>DELEGADO PRINCIPAL</div>
            <div style={{ fontSize: '0.9rem', opacity: '0.9' }}>Iniciar Sesión</div>
          </button>

          {/* SUPLENTE */}
          <button
            onClick={() => irA('/dashboard-suplente')}
            style={{
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              padding: '40px 30px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>👥</div>
            <div style={{ fontSize: '1.3rem', marginBottom: '8px' }}>SUPLENTE</div>
            <div style={{ fontSize: '0.9rem', opacity: '0.9' }}>Dashboard Suplente</div>
          </button>

          {/* NUEVO DELEGADO */}
          <button
            onClick={() => irA('/formacion-delegado')}
            style={{
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              padding: '40px 30px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎓</div>
            <div style={{ fontSize: '1.3rem', marginBottom: '8px' }}>NUEVO DELEGADO</div>
            <div style={{ fontSize: '0.9rem', opacity: '0.9' }}>Formación</div>
          </button>

          {/* NUEVO SUPLENTE */}
          <button
            onClick={() => irA('/formacion-suplente')}
            style={{
              backgroundColor: '#6366f1',
              color: 'white',
              border: 'none',
              padding: '40px 30px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📚</div>
            <div style={{ fontSize: '1.3rem', marginBottom: '8px' }}>NUEVO SUPLENTE</div>
            <div style={{ fontSize: '0.9rem', opacity: '0.9' }}>Formación</div>
          </button>

          {/* CUSTODIA360 */}
          <button
            onClick={() => irA('/dashboard-custodia360')}
            style={{
              backgroundColor: '#374151',
              color: 'white',
              border: 'none',
              padding: '40px 30px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⚙️</div>
            <div style={{ fontSize: '1.3rem', marginBottom: '8px' }}>CUSTODIA360</div>
            <div style={{ fontSize: '0.9rem', opacity: '0.9' }}>Panel Admin</div>
          </button>

        </div>

        {/* BOTÓN DE PRUEBA */}
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <button
            onClick={() => {
              alert('¡FUNCIONA! Los clicks se detectan correctamente')
              console.log('Test click funciona')
            }}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              padding: '20px 40px',
              borderRadius: '8px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            🔥 PROBAR SI FUNCIONA EL CLICK
          </button>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
            ↑ Haz clic aquí primero para verificar que los clicks funcionan
          </p>
        </div>

      </div>
    </div>
  )
}
