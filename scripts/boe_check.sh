#!/usr/bin/env bash
set -euo pipefail

# --- CONFIGURACIÓN ---
DEFAULT_BOE_URL="https://www.boe.es/buscar/act.php?id=BOE-A-2021-9347&tn=tc"
BOE_URL="${BOE_URL:-$DEFAULT_BOE_URL}"
RESEND_API_KEY="${RESEND_API_KEY:-}"
REPORT_EMAIL="${REPORT_EMAIL:-soporte@custodia360.es}"
STATE_FILE=".same/boe_state.json"
LOG_FILE=".same/BOE_CHECK_LOG.md"

# --- VALIDACIÓN URL ---
if [[ -z "$BOE_URL" ]]; then
  echo "❌ BOE_URL vacío, usando la URL oficial LOPIVI"
  BOE_URL="$DEFAULT_BOE_URL"
fi
if ! [[ "$BOE_URL" =~ ^https?:// ]]; then
  echo "⚙️ Añadiendo https:// automáticamente"
  BOE_URL="https://${BOE_URL#https://}"
fi

echo "🔍 Verificando BOE: $BOE_URL"

TMP_HEADERS="$(mktemp)"
TMP_BODY_HASH="$(mktemp)"

# --- OBTENER ETag / Last-Modified ---
if curl -fsSLI "$BOE_URL" -o "$TMP_HEADERS"; then
  ETAG="$(grep -i '^ETag:' "$TMP_HEADERS" | sed 's/ETag:[[:space:]]*//I' | tr -d '\r"')"
  LASTMOD="$(grep -i '^Last-Modified:' "$TMP_HEADERS" | sed 's/Last-Modified:[[:space:]]*//I' | tr -d '\r')"
else
  echo "⚠️ No se pudo obtener cabeceras, usando hash del cuerpo..."
  ETAG=""
  LASTMOD=""
fi

# --- SI NO HAY CABECERAS, HASH DEL CONTENIDO ---
if [[ -z "$ETAG" && -z "$LASTMOD" ]]; then
  BODY_HASH="$(curl -fsSL "$BOE_URL" | shasum -a 256 | awk '{print $1}')"
else
  BODY_HASH=""
fi

# --- LEER ESTADO ANTERIOR ---
PREV_ETAG="$(jq -r '.etag // ""' "$STATE_FILE" 2>/dev/null || echo "")"
PREV_LASTMOD="$(jq -r '.last_modified // ""' "$STATE_FILE" 2>/dev/null || echo "")"
PREV_HASH="$(jq -r '.body_hash // ""' "$STATE_FILE" 2>/dev/null || echo "")"

CHANGED="false"
REASON=""

if [[ -n "$ETAG" && "$ETAG" != "$PREV_ETAG" ]]; then
  CHANGED="true"; REASON="ETag cambió: '$PREV_ETAG' → '$ETAG'"
elif [[ -n "$LASTMOD" && "$LASTMOD" != "$PREV_LASTMOD" ]]; then
  CHANGED="true"; REASON="Last-Modified cambió: '$PREV_LASTMOD' → '$LASTMOD'"
elif [[ -n "$BODY_HASH" && "$BODY_HASH" != "$PREV_HASH" ]]; then
  CHANGED="true"; REASON="Hash de contenido cambió"
fi

# --- GUARDAR ESTADO ---
mkdir -p .same
jq -n --arg etag "$ETAG" --arg lm "$LASTMOD" --arg h "$BODY_HASH" \
  '{etag:$etag,last_modified:$lm,body_hash:$h,checked_at:(now | todate)}' > "$STATE_FILE"

# --- LOG Y NOTIFICACIÓN ---
if [[ "$CHANGED" == "true" ]]; then
  echo "✅ CAMBIO DETECTADO — $REASON"
  echo "- $(date -Iseconds) — CAMBIO DETECTADO — $REASON" >> "$LOG_FILE"
  if [[ -n "$RESEND_API_KEY" ]]; then
    curl -fsS -X POST "https://api.resend.com/emails" \
      -H "Authorization: Bearer $RESEND_API_KEY" \
      -H "Content-Type: application/json" \
      -d "$(jq -n --arg to "$REPORT_EMAIL" --arg url "$BOE_URL" --arg reason "$REASON" \
          '{from:"Custodia360 <notificaciones@custodia360.es>", to:[$to],
            subject:"[BOE] Cambio detectado en LOPIVI",
            html:("<p>Se ha detectado un cambio en el BOE (LOPIVI).</p><p><b>Razón:</b> "+$reason+"</p><p><a href=\""+$url+"\">Abrir BOE</a></p>")}')"
  else
    echo "ℹ️ No hay RESEND_API_KEY, no se envía email."
  fi
else
  echo "🟢 Sin cambios detectados."
  echo "- $(date -Iseconds) — Sin cambios" >> "$LOG_FILE"
fi

exit 0
