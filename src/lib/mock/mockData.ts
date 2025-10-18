// Mock data para desarrollo local sin Supabase
// Este archivo simula la base de datos en memoria

export interface MockEntity {
  id: string
  nombre: string
  sector_code: string
  created_at: string
}

export interface MockInviteToken {
  entity_id: string
  token: string
  active: boolean
  created_at: string
}

// Entidades mock
const mockEntities: Map<string, MockEntity> = new Map([
  ['demo_entity_001', {
    id: 'demo_entity_001',
    nombre: 'Club Deportivo Demo',
    sector_code: 'deportivo',
    created_at: new Date().toISOString()
  }]
])

// Tokens de invitación mock
const mockTokens: Map<string, MockInviteToken> = new Map([
  ['demo-token-123', {
    entity_id: 'demo_entity_001',
    token: 'demo-token-123',
    active: true,
    created_at: new Date().toISOString()
  }]
])

export const mockDB = {
  // Obtener entidad por ID
  getEntity: (entityId: string): MockEntity | null => {
    return mockEntities.get(entityId) || null
  },

  // Obtener token por entityId y token
  getTokenByEntityAndToken: (entityId: string, token: string): MockInviteToken | null => {
    const tokenData = mockTokens.get(token)
    if (tokenData && tokenData.entity_id === entityId && tokenData.active) {
      return tokenData
    }
    return null
  },

  // Obtener o crear token para una entidad
  ensureInviteToken: (entityId: string): string => {
    // Buscar si ya existe un token activo para esta entidad
    for (const [token, data] of mockTokens.entries()) {
      if (data.entity_id === entityId && data.active) {
        return token
      }
    }

    // Si no existe, crear uno nuevo
    const newToken = `token-${entityId}-${Date.now()}`
    mockTokens.set(newToken, {
      entity_id: entityId,
      token: newToken,
      active: true,
      created_at: new Date().toISOString()
    })

    return newToken
  },

  // Verificar si estamos en modo desarrollo (sin Supabase)
  isDevMode: (): boolean => {
    return !process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY
  }
}
