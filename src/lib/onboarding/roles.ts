// Ejemplos de roles por sector de actividad CNAE
export const roleExamplesBySector: Record<string, {
  personal_contacto: string[]
  personal_sin_contacto: string[]
  directiva: string[]
  familia: string[]
}> = {
  // Ocio educativo, campamentos
  '9329': {
    personal_contacto: ['Monitor/a de tiempo libre', 'Coordinador/a de actividades', 'Educador/a'],
    personal_sin_contacto: ['Personal administrativo', 'Limpieza', 'Cocina'],
    directiva: ['Director/a de campamento', 'Presidente/a asociación', 'Vocal de junta'],
    familia: ['Padre/Madre', 'Tutor legal', 'Abuelo/a']
  },
  // Deportes
  '9311': {
    personal_contacto: ['Entrenador/a', 'Monitor/a deportivo', 'Fisioterapeuta infantil'],
    personal_sin_contacto: ['Mantenimiento instalaciones', 'Administración', 'Limpieza'],
    directiva: ['Presidente/a club', 'Director/a deportivo', 'Vocal junta directiva'],
    familia: ['Padre/Madre', 'Tutor legal', 'Familiar autorizado']
  },
  // Educación infantil
  '8510': {
    personal_contacto: ['Maestro/a', 'Educador/a infantil', 'Monitor/a comedor'],
    personal_sin_contacto: ['Secretaría', 'Mantenimiento', 'Limpieza'],
    directiva: ['Director/a del centro', 'Jefe/a de estudios', 'Coordinador/a'],
    familia: ['Padre/Madre', 'Tutor legal', 'Abuelo/a']
  },
  // Educación primaria
  '8520': {
    personal_contacto: ['Maestro/a', 'Profesor/a', 'Monitor/a extraescolares', 'Orientador/a'],
    personal_sin_contacto: ['Personal administrativo', 'Conserje', 'Limpieza'],
    directiva: ['Director/a', 'Jefe/a estudios', 'Secretario/a', 'Presidente/a AMPA'],
    familia: ['Padre/Madre', 'Tutor legal', 'Familiar autorizado']
  },
  // Educación secundaria
  '8531': {
    personal_contacto: ['Profesor/a', 'Tutor/a', 'Monitor/a actividades', 'Orientador/a'],
    personal_sin_contacto: ['Secretaría', 'Conserjería', 'Mantenimiento'],
    directiva: ['Director/a', 'Jefe/a estudios', 'Coordinador/a', 'Vocal consejo escolar'],
    familia: ['Padre/Madre', 'Tutor legal', 'Familiar autorizado']
  },
  // Centros residenciales
  '8730': {
    personal_contacto: ['Educador/a social', 'Monitor/a residencia', 'Psicólogo/a', 'Trabajador/a social'],
    personal_sin_contacto: ['Cocina', 'Limpieza', 'Mantenimiento'],
    directiva: ['Director/a del centro', 'Coordinador/a', 'Responsable área'],
    familia: ['Padre/Madre', 'Tutor legal', 'Familiar de referencia']
  },
  // Guarderías
  '8891': {
    personal_contacto: ['Educador/a infantil', 'Auxiliar', 'Monitor/a'],
    personal_sin_contacto: ['Limpieza', 'Cocina'],
    directiva: ['Director/a', 'Coordinador/a pedagógico'],
    familia: ['Padre/Madre', 'Tutor legal', 'Abuelo/a']
  },
  // Actividades recreativas
  '9321': {
    personal_contacto: ['Monitor/a parque', 'Animador/a', 'Supervisor/a'],
    personal_sin_contacto: ['Taquilla', 'Limpieza', 'Mantenimiento'],
    directiva: ['Gerente', 'Responsable operaciones', 'Coordinador/a'],
    familia: ['Padre/Madre', 'Tutor legal', 'Acompañante autorizado']
  },
  // Default/Genérico
  'default': {
    personal_contacto: ['Monitor/a', 'Educador/a', 'Responsable actividades'],
    personal_sin_contacto: ['Administración', 'Limpieza', 'Mantenimiento'],
    directiva: ['Director/a', 'Presidente/a', 'Vocal junta'],
    familia: ['Padre/Madre', 'Tutor legal', 'Familiar autorizado']
  }
}

export function getRoleExamples(sectorCode: string | null) {
  return roleExamplesBySector[sectorCode || 'default'] || roleExamplesBySector['default']
}

// Validaciones de campos por rol
export function validatePersonalContacto(data: any) {
  const errors: string[] = []

  if (!data.nombre || data.nombre.trim().length < 2) {
    errors.push('Nombre es obligatorio (mínimo 2 caracteres)')
  }
  if (!data.apellidos || data.apellidos.trim().length < 2) {
    errors.push('Apellidos son obligatorios (mínimo 2 caracteres)')
  }
  if (!data.dni || data.dni.trim().length < 8) {
    errors.push('DNI/NIE es obligatorio')
  }
  if (!data.email || !data.email.includes('@')) {
    errors.push('Email válido es obligatorio')
  }
  if (!data.telefono || data.telefono.trim().length < 9) {
    errors.push('Teléfono es obligatorio (mínimo 9 dígitos)')
  }
  if (!data.puesto || data.puesto.trim().length < 2) {
    errors.push('Puesto/cargo es obligatorio')
  }

  return { valid: errors.length === 0, errors }
}

export function validatePersonalSinContacto(data: any) {
  const errors: string[] = []

  if (!data.nombre || data.nombre.trim().length < 2) {
    errors.push('Nombre es obligatorio')
  }
  if (!data.apellidos || data.apellidos.trim().length < 2) {
    errors.push('Apellidos son obligatorios')
  }
  if (!data.area || data.area.trim().length < 2) {
    errors.push('Área/puesto es obligatorio')
  }

  return { valid: errors.length === 0, errors }
}

export function validateDirectiva(data: any) {
  const errors: string[] = []

  if (!data.nombre || data.nombre.trim().length < 2) {
    errors.push('Nombre es obligatorio')
  }
  if (!data.apellidos || data.apellidos.trim().length < 2) {
    errors.push('Apellidos son obligatorios')
  }
  if (!data.email || !data.email.includes('@')) {
    errors.push('Email válido es obligatorio')
  }
  if (!data.telefono || data.telefono.trim().length < 9) {
    errors.push('Teléfono es obligatorio')
  }
  if (!data.cargo || data.cargo.trim().length < 2) {
    errors.push('Cargo es obligatorio')
  }

  return { valid: errors.length === 0, errors }
}

export function validateFamilia(data: any) {
  const errors: string[] = []

  if (!data.nombre || data.nombre.trim().length < 2) {
    errors.push('Nombre del tutor es obligatorio')
  }
  if (!data.apellidos || data.apellidos.trim().length < 2) {
    errors.push('Apellidos del tutor son obligatorios')
  }
  if (!data.telefono || data.telefono.trim().length < 9) {
    errors.push('Teléfono es obligatorio')
  }

  // Validar hijos
  if (!data.children || data.children.length === 0) {
    errors.push('Debe añadir al menos un menor')
  } else {
    data.children.forEach((child: any, index: number) => {
      if (!child.nombre || child.nombre.trim().length < 2) {
        errors.push(`Hijo ${index + 1}: Nombre es obligatorio`)
      }
      if (!child.fecha_nacimiento) {
        errors.push(`Hijo ${index + 1}: Fecha de nacimiento es obligatoria`)
      }
    })
  }

  return { valid: errors.length === 0, errors }
}

// Calcular deadline (30 días desde ahora)
export function calculateDeadline() {
  const deadline = new Date()
  deadline.setDate(deadline.getDate() + 30)
  return deadline.toISOString()
}

// Verificar si un token está válido
export function isTokenValid(token: any) {
  if (!token) return false
  if (token.status === 'used' || token.status === 'expired') return false
  if (token.deadline_at && new Date(token.deadline_at) < new Date()) return false
  return true
}
