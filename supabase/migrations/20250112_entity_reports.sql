-- ============================================================
-- MIGRATION: Entity Reports Storage
-- ============================================================
-- Tabla para metadatos de informes PDF de onboarding guardados por entidad
-- ============================================================

create table if not exists entity_reports (
  id bigint generated always as identity primary key,
  entity_id uuid not null,
  filename text not null,
  storage_path text not null,
  bytes bigint,
  checksum text,
  created_by uuid,
  created_at timestamptz default now()
);

create index if not exists idx_entity_reports_entity on entity_reports(entity_id);
create index if not exists idx_entity_reports_created on entity_reports(created_at desc);

-- ============================================================
-- NOTA: El bucket "entity-reports" debe crearse manualmente
-- en Supabase Storage como PRIVADO
-- ============================================================

comment on table entity_reports is 'Metadatos de informes PDF de onboarding guardados por entidad';
comment on column entity_reports.entity_id is 'ID de la entidad a la que pertenece el informe';
comment on column entity_reports.filename is 'Nombre del archivo para descarga';
comment on column entity_reports.storage_path is 'Ruta completa en Storage: entity-reports/{entityId}/onboarding-YYYYMMDD-HHmm.pdf';
comment on column entity_reports.bytes is 'Tamaño del archivo en bytes';
comment on column entity_reports.checksum is 'SHA256 del archivo (opcional)';
comment on column entity_reports.created_by is 'ID del usuario delegado que generó el informe';
