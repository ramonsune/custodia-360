/**
 * CAPA ÚNICA DE GESTIÓN DE SESIÓN - CUSTODIA360
 *
 * Centraliza todo el manejo de autenticación y sesiones
 * Normaliza claves de localStorage/sessionStorage
 * Estandariza tipo de entidad
 */

export const STORAGE_KEYS = {
  token: 'c360:session_token',
  role: 'c360:role',            // 'ADMIN'|'ENTIDAD'|'DELEGADO'|'SUPLENTE'
  entityId: 'c360:entity_id',
  entityName: 'c360:entity_name',
  expiresAt: 'c360:expires_at', // ISO string
  isDemo: 'c360:is_demo',       // 'true'|'false'
  userId: 'c360:user_id',
  userName: 'c360:user_name',
  userEmail: 'c360:user_email'
} as const;

export type SessionRole = 'ADMIN' | 'ENTIDAD' | 'DELEGADO' | 'SUPLENTE';

export interface NormalizedEntity {
  id: string;
  name: string;
}

export interface SessionData {
  token: string;
  role: SessionRole;
  entityId: string;
  entityName: string;
  isDemo: boolean;
  expiresAt: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
}

/**
 * Normaliza el campo entidad que puede venir como string u objeto
 */
export function normalizeEntity(input: any): NormalizedEntity {
  if (!input) return { id: '', name: '' };

  // Si es string, usar como id y name
  if (typeof input === 'string') {
    return { id: input, name: input };
  }

  // Si es objeto, extraer campos posibles
  const id = input.id ?? input.entityId ?? input.entidad_id ?? '';
  const name = input.name ?? input.nombre ?? input.entityName ?? input.entidad ?? '';

  return {
    id: String(id || ''),
    name: String(name || '')
  };
}

/**
 * Guarda sesión en localStorage y sessionStorage (espejo)
 */
export function saveSession({
  token,
  role,
  entity,
  isDemo = false,
  ttlHours = 24,
  userId = '',
  userName = '',
  userEmail = ''
}: {
  token?: string;
  role?: string;
  entity?: any;
  isDemo?: boolean;
  ttlHours?: number;
  userId?: string;
  userName?: string;
  userEmail?: string;
}): void {
  const { id, name } = normalizeEntity(entity);
  const expires = new Date(Date.now() + ttlHours * 3600 * 1000).toISOString();

  // Normalizar rol a mayúsculas
  const normalizedRole = String(role || '').toUpperCase();

  // Guardar en localStorage
  localStorage.setItem(STORAGE_KEYS.token, token || '');
  localStorage.setItem(STORAGE_KEYS.role, normalizedRole);
  localStorage.setItem(STORAGE_KEYS.entityId, id);
  localStorage.setItem(STORAGE_KEYS.entityName, name);
  localStorage.setItem(STORAGE_KEYS.expiresAt, expires);
  localStorage.setItem(STORAGE_KEYS.isDemo, isDemo ? 'true' : 'false');
  localStorage.setItem(STORAGE_KEYS.userId, userId);
  localStorage.setItem(STORAGE_KEYS.userName, userName);
  localStorage.setItem(STORAGE_KEYS.userEmail, userEmail);

  // Espejo en sessionStorage
  Object.values(STORAGE_KEYS).forEach(key => {
    const value = localStorage.getItem(key) || '';
    sessionStorage.setItem(key, value);
  });

  console.log('✅ Sesión guardada:', { role: normalizedRole, entity: name, isDemo });
}

/**
 * Obtiene sesión actual de localStorage o sessionStorage
 */
export function getSession(): SessionData {
  const g = (k: string) => localStorage.getItem(k) || sessionStorage.getItem(k) || '';

  return {
    token: g(STORAGE_KEYS.token),
    role: g(STORAGE_KEYS.role) as SessionRole,
    entityId: g(STORAGE_KEYS.entityId),
    entityName: g(STORAGE_KEYS.entityName),
    isDemo: g(STORAGE_KEYS.isDemo) === 'true',
    expiresAt: g(STORAGE_KEYS.expiresAt),
    userId: g(STORAGE_KEYS.userId),
    userName: g(STORAGE_KEYS.userName),
    userEmail: g(STORAGE_KEYS.userEmail)
  };
}

/**
 * Verifica si la sesión ha expirado
 */
export function isExpired(): boolean {
  const { expiresAt } = getSession();
  if (!expiresAt) return true;

  try {
    return Date.now() > Date.parse(expiresAt);
  } catch {
    return true;
  }
}

/**
 * Limpia toda la sesión de localStorage y sessionStorage
 */
export function clearSession(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });

  // Limpiar claves legacy por si acaso
  const legacyKeys = [
    'userAuth',
    'userSession',
    'custodia360_session',
    'formacion_lopivi_session'
  ];

  legacyKeys.forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });

  console.log('✅ Sesión limpiada completamente');
}

/**
 * Requiere que el usuario tenga uno de los roles permitidos
 * Si no cumple, limpia sesión y redirige a login
 */
export function requireClientRole(allowed: SessionRole[]): boolean {
  const s = getSession();

  // Verificar que existe token y rol
  if (!s.token || !s.role) {
    console.warn('⚠️ Sin token o rol');
    clearSession();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return false;
  }

  // Verificar expiración
  if (isExpired()) {
    console.warn('⚠️ Sesión expirada');
    clearSession();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return false;
  }

  // Verificar rol permitido
  if (!allowed.includes(s.role)) {
    console.warn('⚠️ Rol no autorizado:', s.role, 'permitidos:', allowed);
    clearSession();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return false;
  }

  return true;
}

/**
 * Hook para verificar autenticación en componentes
 */
export function useAuth(allowedRoles: SessionRole[]) {
  if (typeof window === 'undefined') return null;

  const session = getSession();

  if (!session.token || isExpired() || !allowedRoles.includes(session.role)) {
    return null;
  }

  return session;
}

/**
 * Migrar sesión antigua a nuevo formato
 */
export function migrateOldSession(): boolean {
  try {
    // Intentar leer sesión antigua
    const oldSession = localStorage.getItem('userSession') ||
                      localStorage.getItem('userAuth');

    if (!oldSession) return false;

    const data = JSON.parse(oldSession);

    // Mapear tipo antiguo a rol nuevo
    let role: SessionRole = 'DELEGADO';
    if (data.tipo === 'contratante') role = 'ENTIDAD';
    else if (data.tipo === 'admin_custodia') role = 'ADMIN';
    else if (data.tipo === 'principal') role = 'DELEGADO';
    else if (data.tipo === 'suplente') role = 'SUPLENTE';

    // Guardar en nuevo formato
    saveSession({
      token: data.id || 'migrated',
      role: role,
      entity: data.entidad,
      isDemo: data.isDemo || false,
      userId: data.id,
      userName: data.nombre,
      userEmail: data.email
    });

    console.log('✅ Sesión migrada de formato antiguo a nuevo');
    return true;
  } catch (error) {
    console.error('❌ Error migrando sesión:', error);
    return false;
  }
}
