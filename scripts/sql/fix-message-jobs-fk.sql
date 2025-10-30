-- ===== FIX: Corregir FK de message_jobs.entity_id =====
-- La FK existe pero apunta a tabla incorrecta (entidades en vez de entities)

-- 1. Eliminar FK incorrecta si existe
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'message_jobs_entity_id_fkey'
      AND table_name = 'message_jobs'
      AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.message_jobs DROP CONSTRAINT message_jobs_entity_id_fkey;
    RAISE NOTICE 'FK incorrecta eliminada';
  END IF;
END$$;

-- 2. Crear FK correcta apuntando a entities(id)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage ccu
      ON ccu.constraint_name = tc.constraint_name
    WHERE tc.table_name = 'message_jobs'
      AND tc.constraint_type = 'FOREIGN KEY'
      AND kcu.column_name = 'entity_id'
      AND ccu.table_name = 'entities'
  ) THEN
    ALTER TABLE public.message_jobs
      ADD CONSTRAINT message_jobs_entity_id_fkey
      FOREIGN KEY (entity_id)
      REFERENCES public.entities(id)
      ON DELETE SET NULL;
    RAISE NOTICE 'FK correcta creada → entities(id)';
  ELSE
    RAISE NOTICE 'FK ya apunta correctamente a entities(id)';
  END IF;
END$$;

-- FIN fix-message-jobs-fk.sql
