/**
 * URL Utilities - Custodia360
 * Evita hardcodear el dominio base
 */

export function appBaseUrl(): string {
  return (
    process.env.APP_BASE_URL ||
    process.env.NEXT_PUBLIC_APP_BASE_URL ||
    ""
  );
}

export function absoluteUrl(path: string): string {
  const base = appBaseUrl().replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
