-- ============================================================
-- SEED DE DATOS DE PRUEBA - Panel Delegado Unificado
-- ============================================================
-- IMPORTANTE: Reemplaza 'TU_ENTITY_ID' con el ID real de tu entidad
-- Para obtener tu entity_id, ejecuta:
-- SELECT id, nombre FROM entidades ORDER BY created_at DESC LIMIT 5;
-- ============================================================

-- NOTA: Cambia esta variable antes de ejecutar
DO $$
DECLARE
  v_entity_id UUID := 'demo_entity_001'; -- ⚠️ CAMBIA ESTE ID
  v_user_id UUID := 'delegado_user_001'; -- ⚠️ CAMBIA ESTE ID (user_id del delegado)
BEGIN

  -- ============================================================
  -- 1. CONTACTOS DE EMERGENCIA
  -- ============================================================

  RAISE NOTICE '📞 Creando contactos de emergencia...';

  INSERT INTO entity_contacts (entity_id, nombre, telefono, tipo) VALUES
    (v_entity_id, 'Emergencias 112', '112', 'emergencias'),
    (v_entity_id, 'Policía Nacional', '091', 'policia'),
    (v_entity_id, 'Guardia Civil', '062', 'guardia_civil'),
    (v_entity_id, 'Teléfono ANAR', '900202010', 'ayuda_menor'),
    (v_entity_id, 'Director: Juan Pérez', '600123456', 'direccion'),
    (v_entity_id, 'Delegado Suplente: María López', '600654321', 'delegado'),
    (v_entity_id, 'Servicios Sociales Locales', '987654321', 'servicios_sociales')
  ON CONFLICT DO NOTHING;

  RAISE NOTICE '✅ Contactos de emergencia creados';


  -- ============================================================
  -- 2. ESTADO DE IMPLEMENTACIÓN LOPIVI
  -- ============================================================

  RAISE NOTICE '📋 Inicializando checklist de implementación...';

  -- Inicializar todos los items como pendientes
  INSERT INTO implementation_status (entity_id, item_slug, estado, nota)
  SELECT
    v_entity_id,
    slug,
    'pendiente',
    'Item pendiente de revisión'
  FROM implementation_items
  ON CONFLICT (entity_id, item_slug) DO NOTHING;

  -- Marcar algunos como completados (simulación)
  UPDATE implementation_status
  SET
    estado = 'completado',
    completado_por = v_user_id,
    completado_at = NOW() - INTERVAL '5 days',
    nota = 'Completado durante la implementación inicial',
    updated_at = NOW()
  WHERE entity_id = v_entity_id
    AND item_slug IN ('formacion_delegado', 'plan_proteccion', 'codigo_conducta');

  -- Marcar algunos como en progreso
  UPDATE implementation_status
  SET
    estado = 'en_progreso',
    nota = 'Actualmente en proceso de implementación',
    updated_at = NOW()
  WHERE entity_id = v_entity_id
    AND item_slug IN ('protocolo_actuacion', 'canal_denuncias');

  RAISE NOTICE '✅ Estado de implementación inicializado';


  -- ============================================================
  -- 3. PLANTILLAS PDF (Ejemplos)
  -- ============================================================

  RAISE NOTICE '📄 Creando plantillas PDF de ejemplo...';

  INSERT INTO pdf_templates (slug, nombre, descripcion, sector, categoria, contenido, plantilla_html) VALUES
    (
      'plan-proteccion',
      'Plan de Protección Infantil',
      'Documento marco para la protección de menores',
      'general',
      'plan',
      '{"secciones": ["Introducción", "Objetivos", "Responsabilidades", "Procedimientos"]}',
      '<html><body><h1>Plan de Protección - {{entidad}}</h1><p>Delegado: {{delegado}}</p><p>Fecha: {{fecha}}</p></body></html>'
    ),
    (
      'protocolo-actuacion',
      'Protocolo de Actuación',
      'Procedimientos ante situaciones de riesgo',
      'general',
      'protocolo',
      '{"secciones": ["Detección", "Notificación", "Intervención", "Seguimiento"]}',
      '<html><body><h1>Protocolo de Actuación - {{entidad}}</h1></body></html>'
    ),
    (
      'codigo-conducta',
      'Código de Conducta',
      'Normas de comportamiento para todo el personal',
      'general',
      'codigo',
      '{"secciones": ["Principios", "Normas", "Consecuencias"]}',
      '<html><body><h1>Código de Conducta - {{entidad}}</h1></body></html>'
    ),
    (
      'info-familias',
      'Información para Familias',
      'Documento informativo sobre medidas de protección',
      'general',
      'comunicacion',
      '{"secciones": ["Medidas de seguridad", "Contactos", "Derechos"]}',
      '<html><body><h1>Información LOPIVI - {{entidad}}</h1></body></html>'
    )
  ON CONFLICT (slug) DO NOTHING;

  RAISE NOTICE '✅ Plantillas PDF creadas';


  -- ============================================================
  -- 4. LOG DE ACCIONES (Ejemplos de actividad)
  -- ============================================================

  RAISE NOTICE '📊 Creando logs de actividad de ejemplo...';

  INSERT INTO action_logs (entity_id, user_id, action, descripcion, metadata, created_at) VALUES
    (
      v_entity_id,
      v_user_id,
      'actualizar_implementacion',
      'Código de Conducta: completado',
      '{"itemSlug": "codigo_conducta", "estado": "completado"}',
      NOW() - INTERVAL '5 days'
    ),
    (
      v_entity_id,
      v_user_id,
      'actualizar_implementacion',
      'Plan de Protección: completado',
      '{"itemSlug": "plan_proteccion", "estado": "completado"}',
      NOW() - INTERVAL '4 days'
    ),
    (
      v_entity_id,
      v_user_id,
      'generar_documento',
      'Generado: Plan de Protección Infantil',
      '{"templateSlug": "plan-proteccion"}',
      NOW() - INTERVAL '3 days'
    ),
    (
      v_entity_id,
      v_user_id,
      'envio_email',
      'Enviado a 15 destinatarios (rol)',
      '{"scope": "rol", "rol": "personal_contacto", "templateSlug": "rec-30d-contacto"}',
      NOW() - INTERVAL '2 days'
    );

  RAISE NOTICE '✅ Logs de actividad creados';


  -- ============================================================
  -- RESUMEN
  -- ============================================================

  RAISE NOTICE '';
  RAISE NOTICE '====================================';
  RAISE NOTICE '✅ DATOS DE PRUEBA CREADOS';
  RAISE NOTICE '====================================';
  RAISE NOTICE '📞 Contactos: 7 contactos de emergencia';
  RAISE NOTICE '📋 Implementación: 13 items inicializados (3 completados, 2 en progreso)';
  RAISE NOTICE '📄 Plantillas PDF: 4 plantillas disponibles';
  RAISE NOTICE '📊 Logs: 4 acciones registradas';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Ahora puedes acceder al panel delegado en:';
  RAISE NOTICE '   https://www.custodia360.es/panel/delegado';
  RAISE NOTICE '';

END $$;


-- ============================================================
-- VERIFICAR DATOS CREADOS
-- ============================================================

SELECT '📊 RESUMEN DE DATOS CREADOS:' as titulo;

-- Contar contactos
SELECT
  'Contactos de emergencia' as item,
  COUNT(*) as cantidad
FROM entity_contacts
UNION ALL

-- Contar implementation status
SELECT
  'Items de implementación' as item,
  COUNT(*) as cantidad
FROM implementation_status
UNION ALL

-- Contar por estado
SELECT
  'Items completados' as item,
  COUNT(*) as cantidad
FROM implementation_status
WHERE estado = 'completado'
UNION ALL

SELECT
  'Items en progreso' as item,
  COUNT(*) as cantidad
FROM implementation_status
WHERE estado = 'en_progreso'
UNION ALL

SELECT
  'Items pendientes' as item,
  COUNT(*) as cantidad
FROM implementation_status
WHERE estado = 'pendiente'
UNION ALL

-- Contar plantillas
SELECT
  'Plantillas PDF' as item,
  COUNT(*) as cantidad
FROM pdf_templates
UNION ALL

-- Contar logs
SELECT
  'Acciones registradas' as item,
  COUNT(*) as cantidad
FROM action_logs;


-- ============================================================
-- MOSTRAR ENTITY IDs DISPONIBLES
-- ============================================================

SELECT '📋 ENTIDADES DISPONIBLES:' as titulo;

SELECT
  id as entity_id,
  nombre,
  sector,
  plan_estado
FROM entidades
ORDER BY created_at DESC
LIMIT 10;


-- ============================================================
-- INSTRUCCIONES FINALES
-- ============================================================

SELECT '⚠️ RECORDATORIO:' as titulo;
SELECT 'Si usaste IDs de demo (demo_entity_001), actualiza el script con tus IDs reales' as mensaje;
SELECT 'Obtén tus IDs de la tabla de arriba y vuelve a ejecutar el script' as accion;
