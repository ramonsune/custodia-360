import { NextRequest, NextResponse } from 'next/server'

const MAPAS_RIESGOS = {
  'club-deportivo': {
    nombre: 'Clubes Deportivos',
    riesgos: [
      'Vestuarios y duchas sin supervisión adecuada',
      'Instalaciones con zonas poco visibles',
      'Relación de poder entrenador-deportista',
      'Contacto físico normalizado durante entrenamientos',
      'Viajes y concentraciones fuera de instalaciones',
      'Comunicaciones privadas por redes sociales'
    ],
    medidas: [
      'Protocolos de acompañamiento en vestuarios',
      'Regla de visibilidad: nunca un adulto a solas con un menor',
      'Códigos de conducta específicos para entrenadores',
      'Canales seguros de comunicación',
      'Documentar todas las comunicaciones y actividades'
    ]
  },
  'educacion': {
    nombre: 'Centros Educativos',
    riesgos: [
      'Baños, pasillos y zonas de recreo con supervisión limitada',
      'Aulas cerradas durante tutorías individuales',
      'Relación de autoridad profesor-alumno',
      'Excursiones sin protocolos claros',
      'Acoso escolar entre iguales no detectado'
    ],
    medidas: [
      'Supervisión en todos los espacios del centro',
      'Regla de puertas abiertas en tutorías',
      'Códigos de conducta para personal docente',
      'Canales confidenciales para alumnos',
      'Protocolo de consentimiento para excursiones'
    ]
  },
  'general': {
    nombre: 'Entornos Generales',
    riesgos: [
      'Espacios sin supervisión adecuada',
      'Zonas aisladas donde adulto puede quedarse a solas con menor',
      'Falta de protocolos de acceso y circulación',
      'Relaciones de confianza sin límites claros',
      'Actividades individuales sin supervisión'
    ],
    medidas: [
      'Regla de visibilidad general',
      'Códigos de conducta claros',
      'Canales confidenciales para menores',
      'Formación del personal',
      'Certificado Negativo de Delitos Sexuales obligatorio'
    ]
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sector = searchParams.get('sector') || 'general'
    const entityId = searchParams.get('entityId')

    const mapa = MAPAS_RIESGOS[sector as keyof typeof MAPAS_RIESGOS] || MAPAS_RIESGOS['general']

    // Generar HTML del mapa
    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Mapa de Riesgos - ${mapa.nombre}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 40px;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
    }
    h1 {
      color: #1e40af;
      border-bottom: 3px solid #1e40af;
      padding-bottom: 10px;
    }
    h2 {
      color: #dc2626;
      margin-top: 30px;
    }
    .riesgo, .medida {
      background: #f3f4f6;
      padding: 12px;
      margin: 8px 0;
      border-left: 4px solid #dc2626;
      border-radius: 4px;
    }
    .medida {
      border-left-color: #059669;
      background: #f0fdf4;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      font-size: 12px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <h1>Mapa de Riesgos de Violencia Infantil</h1>
  <h2>Sector: ${mapa.nombre}</h2>

  <p style="background: #eff6ff; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0;">
    <strong>Descripción:</strong> Este mapa identifica los riesgos específicos de violencia contra menores
    en el ámbito de ${mapa.nombre}, según la Ley Orgánica 8/2021 (LOPIVI).
  </p>

  <h2 style="color: #dc2626;">⚠️ Riesgos Identificados</h2>
  ${mapa.riesgos.map((r, i) => `
    <div class="riesgo">
      <strong>${i + 1}.</strong> ${r}
    </div>
  `).join('')}

  <h2 style="color: #059669;">✓ Medidas Preventivas</h2>
  ${mapa.medidas.map((m, i) => `
    <div class="medida">
      <strong>${i + 1}.</strong> ${m}
    </div>
  `).join('')}

  <div class="footer">
    <strong>Documento generado por Custodia360</strong><br />
    Fecha: ${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}<br />
    <br />
    Este mapa de riesgos ha sido elaborado conforme a la Ley Orgánica 8/2021 (LOPIVI)<br />
    para la protección integral de los menores frente a la violencia.<br />
    <br />
    <a href="https://www.custodia360.es">www.custodia360.es</a> | info@custodia360.es
  </div>
</body>
</html>
    `

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="mapa-riesgos-${sector}.html"`
      }
    })
  } catch (error: any) {
    console.error('Error en riskmap/download:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
