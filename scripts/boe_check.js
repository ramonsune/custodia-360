#!/usr/bin/env node

/**
 * BOE LOPIVI Monitor - Custodia360
 * Verifica cambios en la Ley LOPIVI del BOE
 */

const https = require('https');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// Configuración
const DEFAULT_BOE_URL = 'https://www.boe.es/buscar/act.php?id=BOE-A-2021-9347&tn=tc';
const BOE_URL = process.env.BOE_URL || DEFAULT_BOE_URL;
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const REPORT_EMAIL = process.env.REPORT_EMAIL || 'soporte@custodia360.es';
const STATE_FILE = path.join(__dirname, '../.same/boe_state.json');
const LOG_FILE = path.join(__dirname, '../.same/BOE_CHECK_LOG.md');

console.log(`🔍 Verificando BOE: ${BOE_URL}`);

// Función para obtener headers HTTP
function getHeaders(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: 'HEAD',
      headers: {
        'User-Agent': 'Custodia360-BOE-Monitor/1.0'
      }
    };

    const req = https.request(options, (res) => {
      resolve({
        etag: res.headers.etag || '',
        lastModified: res.headers['last-modified'] || ''
      });
    });

    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    req.end();
  });
}

// Función para obtener hash del contenido
function getBodyHash(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Custodia360-BOE-Monitor/1.0'
      }
    };

    const req = https.request(options, (res) => {
      const hash = crypto.createHash('sha256');
      res.on('data', (chunk) => hash.update(chunk));
      res.on('end', () => resolve(hash.digest('hex')));
    });

    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    req.end();
  });
}

// Función para leer estado anterior
function readState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    }
  } catch (error) {
    console.warn('⚠️ No se pudo leer estado anterior:', error.message);
  }
  return { etag: '', last_modified: '', body_hash: '', checked_at: null };
}

// Función para guardar estado
function saveState(state) {
  const dir = path.dirname(STATE_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  state.checked_at = new Date().toISOString();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

// Función para escribir log
function writeLog(message) {
  const logDir = path.dirname(LOG_FILE);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  const timestamp = new Date().toISOString();
  const logEntry = `- ${timestamp} — ${message}\n`;
  fs.appendFileSync(LOG_FILE, logEntry);
}

// Función para enviar email con Resend
async function sendEmail(reason) {
  if (!RESEND_API_KEY) {
    console.log('ℹ️ No hay RESEND_API_KEY, no se envía email.');
    return;
  }

  const emailData = {
    from: 'Custodia360 <notificaciones@custodia360.es>',
    to: [REPORT_EMAIL],
    subject: '[BOE] Cambio detectado en LOPIVI',
    html: `<p>Se ha detectado un cambio en el BOE (LOPIVI).</p>
           <p><b>Razón:</b> ${reason}</p>
           <p><a href="${BOE_URL}">Abrir BOE</a></p>`
  };

  return new Promise((resolve, reject) => {
    const data = JSON.stringify(emailData);
    const options = {
      hostname: 'api.resend.com',
      port: 443,
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✉️ Email enviado correctamente');
          resolve(body);
        } else {
          console.warn(`⚠️ Error enviando email: ${res.statusCode} - ${body}`);
          resolve(null);
        }
      });
    });

    req.on('error', (error) => {
      console.warn('⚠️ Error enviando email:', error.message);
      resolve(null);
    });

    req.write(data);
    req.end();
  });
}

// Función principal
async function main() {
  try {
    const prevState = readState();
    let headers = { etag: '', lastModified: '' };
    let bodyHash = '';

    // Intentar obtener headers
    try {
      headers = await getHeaders(BOE_URL);
    } catch (error) {
      console.warn('⚠️ No se pudieron obtener headers:', error.message);
    }

    // Si no hay headers, obtener hash del contenido
    if (!headers.etag && !headers.lastModified) {
      console.log('📥 Obteniendo hash del contenido...');
      try {
        bodyHash = await getBodyHash(BOE_URL);
      } catch (error) {
        console.error('❌ Error obteniendo contenido:', error.message);
        process.exit(0); // Exit 0 para no marcar como fallo
      }
    }

    // Detectar cambios
    let changed = false;
    let reason = '';

    if (headers.etag && headers.etag !== prevState.etag) {
      changed = true;
      reason = `ETag cambió: '${prevState.etag}' → '${headers.etag}'`;
    } else if (headers.lastModified && headers.lastModified !== prevState.last_modified) {
      changed = true;
      reason = `Last-Modified cambió: '${prevState.last_modified}' → '${headers.lastModified}'`;
    } else if (bodyHash && bodyHash !== prevState.body_hash) {
      changed = true;
      reason = 'Hash de contenido cambió';
    }

    // Guardar nuevo estado
    const newState = {
      etag: headers.etag,
      last_modified: headers.lastModified,
      body_hash: bodyHash
    };
    saveState(newState);

    // Log y notificación
    if (changed) {
      console.log(`✅ CAMBIO DETECTADO — ${reason}`);
      writeLog(`CAMBIO DETECTADO — ${reason}`);
      await sendEmail(reason);
    } else {
      console.log('🟢 Sin cambios detectados.');
      writeLog('Sin cambios');
    }

    process.exit(0); // Siempre exit 0
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(0); // Exit 0 incluso en error para no bloquear scheduler
  }
}

main();
