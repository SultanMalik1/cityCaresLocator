-- Phase 7: Row Level Security for organizations and profiles

-- ---------------------------------------------------------------------------
-- Helper: true when the signed-in user is an admin
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- organizations
-- ---------------------------------------------------------------------------
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read approved organizations" ON public.organizations;
DROP POLICY IF EXISTS "Contributors read own organizations" ON public.organizations;
DROP POLICY IF EXISTS "Admins read all organizations" ON public.organizations;
DROP POLICY IF EXISTS "Contributors insert pending organizations" ON public.organizations;
DROP POLICY IF EXISTS "Admins update organizations" ON public.organizations;

CREATE POLICY "Public read approved organizations"
  ON public.organizations
  FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Contributors read own organizations"
  ON public.organizations
  FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Admins read all organizations"
  ON public.organizations
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Contributors insert pending organizations"
  ON public.organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    status = 'pending'
    AND created_by = auth.uid()
  );

CREATE POLICY "Admins update organizations"
  ON public.organizations
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins update profiles" ON public.profiles;

CREATE POLICY "Users read own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins read all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins update profiles"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
