import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { searchParams } = new URL(req.url);
    const entityId = searchParams.get('entityId');

    if (!entityId) {
      return NextResponse.json(
        { error: "Missing entityId" },
        { status: 400 }
      );
    }

    // Obtener entidad para saber el sector
    const { data: entity } = await supabase
      .from('entidades')
      .select('sector')
      .eq('id', entityId)
      .single();

    const sector = entity?.sector || 'general';

    // Obtener tipos de incidentes (todos + específicos del sector)
    const { data: incidentTypes, error: typesError } = await supabase
      .from('incident_types')
      .select('*')
      .or(`sector.eq.general,sector.eq.${sector}`)
      .order('prioridad', { ascending: false })
      .order('titulo', { ascending: true });

    if (typesError) throw typesError;

    // Obtener contactos de la entidad
    const { data: contacts, error: contactsError } = await supabase
      .from('entity_contacts')
      .select('*')
      .eq('entity_id', entityId)
      .eq('activo', true)
      .order('tipo', { ascending: true })
      .order('nombre', { ascending: true });

    if (contactsError) throw contactsError;

    // Contactos genéricos de emergencia (España)
    const genericContacts = [
      {
        id: 'emergencias-112',
        nombre: 'Emergencias (112)',
        telefono: '112',
        tipo: 'emergencias',
      },
      {
        id: 'policia-091',
        nombre: 'Policía Nacional (091)',
        telefono: '091',
        tipo: 'policia',
      },
      {
        id: 'guardia-civil-062',
        nombre: 'Guardia Civil (062)',
        telefono: '062',
        tipo: 'guardia_civil',
      },
      {
        id: 'anar-900202010',
        nombre: 'Teléfono ANAR (900 20 20 10)',
        telefono: '900202010',
        tipo: 'ayuda_menor',
      },
      {
        id: 'fiscalia-menores',
        nombre: 'Fiscalía de Menores',
        telefono: '(Consultar provincia)',
        tipo: 'fiscalia',
      },
    ];

    // Agrupar contactos por tipo
    const contactsByType = [...(contacts || []), ...genericContacts].reduce((acc: any, contact: any) => {
      const tipo = contact.tipo || 'general';
      if (!acc[tipo]) acc[tipo] = [];
      acc[tipo].push(contact);
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      incidentTypes: incidentTypes || [],
      contacts: contacts || [],
      contactsByType,
      genericContacts,
      sector,
    });

  } catch (error: any) {
    console.error('Urgency setup error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
