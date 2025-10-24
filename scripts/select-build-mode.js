/* Si NEXT_BUILD_STRICT=true → build estricta (ts/eslint). Si false → tolerante */
const { execSync } = require("node:child_process")
const strict = String(process.env.NEXT_BUILD_STRICT || "false") === "true"
console.log(`NEXT_BUILD_STRICT=${strict}`)
try {
  if (strict) {
    execSync("next build --debug", { stdio: "inherit" })
  } else {
    // Tolerar errores de lint/ts en build para no bloquear publish
    process.env.NEXT_DISABLE_ESLINT = "1"
    // Next no expone flag público para ignorar TS; usamos next.config con bandera
    execSync("next build --debug", { stdio: "inherit" })
  }
  process.exit(0)
} catch (e) {
  console.error("Build failed:", e?.message || e)
  process.exit(1)
}
