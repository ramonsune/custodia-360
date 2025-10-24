/* Diagnóstico visible en logs de Netlify (no imprime secretos) */
const show = (k) => process.env[k] ? "SET" : "MISSING"
console.log("=== C360 Build Env (redacted) ===")
console.log("NODE_VERSION:", process.version)
;[
  "APP_BASE_URL",
  "SUPABASE_URL",
  "RESEND_API_KEY",
  "NOTIFY_EMAIL_FROM",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET"
].forEach(k => console.log(`${k}: ${show(k)}`))
console.log("=== End Env ===")
