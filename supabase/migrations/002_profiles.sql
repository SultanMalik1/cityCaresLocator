-- Phase 6: profiles table for user roles (RLS policies added in Phase 7)
-- Links each Supabase Auth user to a role: contributor or admin.

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'contributor',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT profiles_role_check CHECK (role IN ('contributor', 'admin'))
);

-- ---------------------------------------------------------------------------
-- Auto-update updated_at
-- ---------------------------------------------------------------------------
DROP TRIGGER IF EXISTS profiles_set_updated_at ON public.profiles;

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- RLS policies are added in Phase 7. Keep off until then.
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- After your first login (Phase 7), set yourself as admin, e.g.:
--   UPDATE public.profiles SET role = 'admin' WHERE id = '<your-auth-user-uuid>';
-- ---------------------------------------------------------------------------
