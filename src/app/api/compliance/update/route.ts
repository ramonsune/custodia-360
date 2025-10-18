import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { entityId, field, value } = body

    if (!entityId || !field) {
      return NextResponse.json({ error: 'entityId y field requeridos' }, { status: 400 })
    }

    // Campos permitidos
    const allowedFields = ['channel_done', 'channel_verified', 'riskmap_done', 'penales_done']
    if (!allowedFields.includes(field)) {
      return NextResponse.json({ error: 'Campo no válido' }, { status: 400 })
    }

    // En producción, actualizar en Supabase
    // UPDATE entity_compliance SET ${field} = ${value}, updated_at = now()
    // WHERE entity_id = ${entityId}

    // Para demo, guardar en localStorage del servidor (simulado)
    const complianceKey = `compliance_${entityId}`

    // Simular actualización
    const compliance = {
      channel_done: false,
      channel_verified: false,
      riskmap_done: false,
      penales_done: false,
      blocked: false,
      start_at: new Date().toISOString(),
      deadline_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      days_remaining: 30
    }

    // Cargar estado actual si existe
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(complianceKey)
      if (stored) {
        Object.assign(compliance, JSON.parse(stored))
      }
    }

    // Actualizar campo
    compliance[field as keyof typeof compliance] = value

    // Verificar si todo está completo para desbloquear
    if (
      compliance.channel_done &&
      compliance.riskmap_done &&
      compliance.penales_done
    ) {
      compliance.blocked = false
    }

    console.log(`✅ [COMPLIANCE] Actualizado ${field} = ${value} para entidad ${entityId}`)

    return NextResponse.json({
      success: true,
      compliance,
      _localData: { key: complianceKey, data: compliance }
    })
  } catch (error: any) {
    console.error('Error en compliance/update:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
