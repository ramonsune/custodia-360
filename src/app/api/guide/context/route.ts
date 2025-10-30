import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * GET /api/guide/context?role=DELEGADO&ui_context=incidentes.list
 * Returns the specific section linked to a UI context
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const uiContext = searchParams.get('ui_context')

    // Validate parameters
    if (!role || !['ENTIDAD', 'DELEGADO', 'SUPLENTE'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role parameter' },
        { status: 400 }
      )
    }

    if (!uiContext) {
      return NextResponse.json(
        { success: false, error: 'ui_context parameter is required' },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Find the anchor for this UI context
    const { data: anchors, error: anchorError } = await supabase
      .from('guide_anchors')
      .select(`
        *,
        guide_sections (
          *,
          guides (
            role
          )
        )
      `)
      .eq('ui_context', uiContext)
      .single()

    if (anchorError || !anchors) {
      console.log('No anchor found for ui_context:', uiContext)
      return NextResponse.json(
        { success: false, error: 'No contextual help found for this UI context' },
        { status: 404 }
      )
    }

    // Verify the section belongs to the correct role
    const section = anchors.guide_sections
    if (!section || section.guides?.role !== role) {
      return NextResponse.json(
        { success: false, error: 'Section not found for this role' },
        { status: 404 }
      )
    }

    // Return the section
    return NextResponse.json({
      success: true,
      section: {
        id: section.id,
        section_key: section.section_key,
        section_title: section.section_title,
        content_md: section.content_md,
        anchor: anchors.anchor
      }
    })

  } catch (error) {
    console.error('Error in /api/guide/context:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
