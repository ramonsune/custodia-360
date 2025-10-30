// Importar el nuevo componente al inicio del archivo
import IndiceCumplimiento from './indice-cumplimiento'

// ... resto de imports y código ...

// En la sección JSX, reemplazar el modal de cumplimiento existente con:

{/* Modal Cumplimiento - Nuevo Componente */}
<IndiceCumplimiento
  isOpen={modalCumplimiento}
  onClose={() => setModalCumplimiento(false)}
  estadisticasAvanzadas={estadisticasAvanzadas}
  elementosFaltantes={elementosFaltantes}
  detallesCumplimiento={detallesCumplimiento}
/>
