-- Phase 6: organization approval workflow (run in Supabase SQL Editor or via CLI)
-- Adds status + audit columns to existing organizations table.

-- ---------------------------------------------------------------------------
-- 1. New columns on organizations
-- ---------------------------------------------------------------------------
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS status text,
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS created_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz;

ALTER TABLE public.organizations
  ALTER COLUMN created_at SET DEFAULT now();

ALTER TABLE public.organizations
  ALTER COLUMN updated_at SET DEFAULT now();

-- ---------------------------------------------------------------------------
-- 2. Backfill existing rows (status is NULL right after ADD COLUMN)
-- ---------------------------------------------------------------------------
UPDATE public.organizations
SET
  status = 'approved',
  created_at = COALESCE(created_at, now()),
  updated_at = COALESCE(updated_at, now())
WHERE status IS NULL;

-- New submissions default to pending (Phase 7)
ALTER TABLE public.organizations
  ALTER COLUMN status SET DEFAULT 'pending';

ALTER TABLE public.organizations
  ALTER COLUMN status SET NOT NULL;

-- ---------------------------------------------------------------------------
-- 3. Allowed status values
-- ---------------------------------------------------------------------------
ALTER TABLE public.organizations
  DROP CONSTRAINT IF EXISTS organizations_status_check;

ALTER TABLE public.organizations
  ADD CONSTRAINT organizations_status_check
  CHECK (status IN ('pending', 'approved', 'rejected'));

-- ---------------------------------------------------------------------------
-- 4. Auto-update updated_at on changes
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS organizations_set_updated_at ON public.organizations;

CREATE TRIGGER organizations_set_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 5. Index for public map queries (approved only)
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS organizations_status_idx
  ON public.organizations (status);
