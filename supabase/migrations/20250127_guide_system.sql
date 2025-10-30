-- Migration: Guide System for Custodia360
-- Creates tables for role-based guides with contextual help

-- Table: guides
CREATE TABLE IF NOT EXISTS guides (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  role text NOT NULL CHECK (role IN ('ENTIDAD', 'DELEGADO', 'SUPLENTE')),
  title text NOT NULL,
  version text NOT NULL DEFAULT 'v1.0',
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Table: guide_sections
CREATE TABLE IF NOT EXISTS guide_sections (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  guide_id uuid NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  order_index int NOT NULL,
  section_key text NOT NULL,
  section_title text NOT NULL,
  content_md text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Table: guide_anchors (for contextual help)
CREATE TABLE IF NOT EXISTS guide_anchors (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id uuid NOT NULL REFERENCES guide_sections(id) ON DELETE CASCADE,
  ui_context text NOT NULL,
  anchor text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_guides_role ON guides(role);
CREATE INDEX IF NOT EXISTS idx_guide_sections_guide_id ON guide_sections(guide_id);
CREATE INDEX IF NOT EXISTS idx_guide_sections_order ON guide_sections(guide_id, order_index);
CREATE INDEX IF NOT EXISTS idx_guide_anchors_ui_context ON guide_anchors(ui_context);

-- RLS Policies
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_anchors ENABLE ROW LEVEL SECURITY;

-- Public read access for guides (informational content)
CREATE POLICY "Allow public read access to guides"
  ON guides FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to guide_sections"
  ON guide_sections FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to guide_anchors"
  ON guide_anchors FOR SELECT
  USING (true);

-- Admin-only write access (managed through backend)
-- Note: In production, use service role key for admin operations

-- Comments for documentation
COMMENT ON TABLE guides IS 'Stores role-based guides for ENTIDAD, DELEGADO, and SUPLENTE';
COMMENT ON TABLE guide_sections IS 'Stores individual sections of each guide with markdown content';
COMMENT ON TABLE guide_anchors IS 'Maps UI contexts to guide sections for contextual help';
