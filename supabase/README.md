# Supabase migrations

Run in order in the Supabase **SQL Editor** (or Supabase CLI).

| File | Purpose |
|------|---------|
| `migrations/001_organizations_workflow.sql` | `status`, `created_by`, timestamps |
| `migrations/002_profiles.sql` | `profiles` table (RLS off until 003) |
| `migrations/003_rls.sql` | RLS policies + `is_admin()` |
| `migrations/004_auth_profile_trigger.sql` | Auto-create profile on sign-up |

When creating `profiles` in step 002, choose **RLS off** (003 turns it on with policies).

## Phase 7 — Auth setup (Dashboard)

1. **Authentication → Providers**
   - Enable **Google**
   - Enable **Email** (magic link / OTP)

2. **Authentication → URL Configuration**
   - **Site URL:** `http://localhost:5173` (dev) or `https://citycares.netlify.app` (prod)
   - **Redirect URLs:**
     - `http://localhost:5173/app`
     - `https://citycares.netlify.app/app`

3. Run **`003_rls.sql`** and **`004_auth_profile_trigger.sql`** if you have not already.

4. Sign in once (Google or magic link), then promote your user to admin:

```sql
-- Replace with your auth user id from Authentication → Users
UPDATE public.profiles
SET role = 'admin'
WHERE id = 'YOUR-USER-UUID';
```

If no profile row exists yet:

```sql
INSERT INTO public.profiles (id, role)
VALUES ('YOUR-USER-UUID', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

## Verify

```sql
SELECT status, count(*) FROM public.organizations GROUP BY status;
SELECT id, role FROM public.profiles;
```

## App routes (Phase 7)

| Route | Who |
|-------|-----|
| `/login` | Sign in (Google = contributor, email = admin) |
| `/app/submit` | Signed-in contributors add pending orgs |
| `/app/admin` | Admins approve / reject pending orgs |
