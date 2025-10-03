// ... existing code ... <import statements and other types>

// Tipo para la tabla de contactos
export interface ContactoDB {
  id?: string
  nombre: string
  email: string
  telefono?: string
  empresa?: string
  mensaje: string
  estado?: 'pendiente' | 'respondido' | 'archivado'
  fecha_creacion?: string
  fecha_respuesta?: string
  notas_internas?: string
}

// ... existing code ... <rest of the file>
