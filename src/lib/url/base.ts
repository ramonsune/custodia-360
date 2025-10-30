/**
 * Utilidades para construcción de URLs absolutas
 * DOMINIO CANÓNICO: www.custodia360.es
 */

/**
 * Obtiene la URL base de la aplicación desde variables de entorno
 * @returns URL base sin trailing slash
 */
export function appBaseUrl(): string {
  return (
    process.env.APP_BASE_URL ||
    process.env.NEXT_PUBLIC_APP_BASE_URL ||
    "https://www.custodia360.es"
  );
}

/**
 * Construye una URL absoluta canónica
 * @param path Ruta relativa (ej: "/i/token123" o "i/token123")
 * @returns URL absoluta completa (ej: "https://www.custodia360.es/i/token123")
 */
export function absoluteUrl(path: string): string {
  const base = appBaseUrl().replace(/\/+$/, ""); // remover trailing slashes
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
