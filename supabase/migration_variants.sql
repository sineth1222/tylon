-- ============================================================
-- Migration: Add variants JSONB column to products table
-- Run this in Supabase SQL Editor if upgrading from old schema
-- ============================================================

-- Add variants column
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]';

-- Backfill: convert existing colors + sizes + images → variants
-- (Run this once, skip if starting fresh)
UPDATE public.products
SET variants = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'colorName', c->>'name',
      'colorHex',  c->>'hex',
      'images',    images,
      'sizes',     (
        SELECT jsonb_agg(jsonb_build_object('size', s, 'stock', 10))
        FROM unnest(sizes) s
      )
    )
  )
  FROM jsonb_array_elements(colors) c
)
WHERE jsonb_array_length(colors) > 0
  AND variants = '[]'::jsonb;

-- For products with no colours, create a single "Default" variant
UPDATE public.products
SET variants = jsonb_build_array(
  jsonb_build_object(
    'colorName', 'Default',
    'colorHex',  '#1A1A1A',
    'images',    images,
    'sizes',     (
      SELECT jsonb_agg(jsonb_build_object('size', s, 'stock', 10))
      FROM unnest(sizes) s
    )
  )
)
WHERE (variants IS NULL OR variants = '[]'::jsonb)
  AND array_length(sizes, 1) > 0;

-- Index for variants queries
CREATE INDEX IF NOT EXISTS idx_products_variants ON public.products USING GIN (variants);
