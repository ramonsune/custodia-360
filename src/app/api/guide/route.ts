import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * GET /api/guide?role=ENTIDAD|DELEGADO|SUPLENTE
 * Returns guide and sections for the specified role
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')

    // Validate role
    if (!role || !['ENTIDAD', 'DELEGADO', 'SUPLENTE'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role parameter. Must be ENTIDAD, DELEGADO, or SUPLENTE' },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch guide by role
    const { data: guides, error: guideError } = await supabase
      .from('guides')
      .select('*')
      .eq('role', role)
      .single()

    if (guideError) {
      console.error('Error fetching guide:', guideError)
      return NextResponse.json(
        { success: false, error: 'Guide not found for this role' },
        { status: 404 }
      )
    }

    // Fetch sections for this guide
    const { data: sections, error: sectionsError } = await supabase
      .from('guide_sections')
      .select('*')
      .eq('guide_id', guides.id)
      .order('order_index', { ascending: true })

    if (sectionsError) {
      console.error('Error fetching sections:', sectionsError)
      return NextResponse.json(
        { success: false, error: 'Error fetching guide sections' },
        { status: 500 }
      )
    }

    // Return combined data
    return NextResponse.json({
      success: true,
      guide: {
        ...guides,
        sections: sections || []
      }
    })

  } catch (error) {
    console.error('Error in /api/guide:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
