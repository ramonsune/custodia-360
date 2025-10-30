import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { datosFormulario, tipoBackup = 'manual', entidadId } = await request.json()

    // Validar datos requeridos
    if (!datosFormulario || !entidadId) {
      return NextResponse.json(
        { error: 'Datos de formulario y entidad ID son requeridos' },
        { status: 400 }
      )
    }

    // Crear backup en Supabase
    const backupData = {
      entidad_id: entidadId,
      tipo_backup: tipoBackup,
      datos_formulario: datosFormulario,
      fecha_backup: new Date().toISOString(),
      estado: 'completado',
      metadata: {
        version: '1.0',
        origen: 'formulario_contratacion',
        timestamp: Date.now()
      }
    }

    const { data, error } = await supabase
      .from('backups_contratacion')
      .insert(backupData)
      .select()

    if (error) {
      console.error('Error creando backup:', error)
      return NextResponse.json(
        { error: 'Error al crear backup en la base de datos' },
        { status: 500 }
      )
    }

    // Backup en almacenamiento de archivos (simulado)
    const archivoBackup = {
      nombre: `backup_contratacion_${entidadId}_${Date.now()}.json`,
      contenido: JSON.stringify(datosFormulario, null, 2),
      fechaCreacion: new Date().toISOString()
    }

    console.log('Backup creado exitosamente:', {
      id: data[0].id,
      archivo: archivoBackup.nombre,
      entidad: entidadId
    })

    return NextResponse.json({
      success: true,
      message: 'Backup creado exitosamente',
      backupId: data[0].id,
      archivo: archivoBackup.nombre,
      fecha: backupData.fecha_backup
    })

  } catch (error) {
    console.error('Error en backup de contratación:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const entidadId = searchParams.get('entidadId')
    const limite = parseInt(searchParams.get('limite') || '10')

    if (!entidadId) {
      return NextResponse.json(
        { error: 'Entidad ID es requerido' },
        { status: 400 }
      )
    }

    // Obtener historial de backups
    const { data, error } = await supabase
      .from('backups_contratacion')
      .select('*')
      .eq('entidad_id', entidadId)
      .order('fecha_backup', { ascending: false })
      .limit(limite)

    if (error) {
      console.error('Error obteniendo backups:', error)
      return NextResponse.json(
        { error: 'Error al obtener historial de backups' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      backups: data,
      total: data.length
    })

  } catch (error) {
    console.error('Error obteniendo backups:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const backupId = searchParams.get('backupId')

    if (!backupId) {
      return NextResponse.json(
        { error: 'Backup ID es requerido' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('backups_contratacion')
      .delete()
      .eq('id', backupId)

    if (error) {
      console.error('Error eliminando backup:', error)
      return NextResponse.json(
        { error: 'Error al eliminar backup' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Backup eliminado exitosamente'
    })

  } catch (error) {
    console.error('Error eliminando backup:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
