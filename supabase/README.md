# Supabase migrations

Run these in order in the Supabase **SQL Editor** (or via Supabase CLI).

| File | Purpose |
|------|---------|
| `migrations/001_organizations_workflow.sql` | `status`, `created_by`, timestamps on `organizations` |
| `migrations/002_profiles.sql` | `profiles` table for user roles (Phase 7) |

When creating `profiles`, choose **RLS off** for now. Phase 7 adds policies.

## Verify Phase 6

In SQL Editor:

```sql
-- Every existing org should be approved (public map)
SELECT status, count(*) FROM public.organizations GROUP BY status;

-- Profiles table exists
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles';
```

You should see your organizations under `status = 'approved'`.

## After Phase 7 login

Set your account as admin:

```sql
UPDATE public.profiles SET role = 'admin' WHERE id = '<your-auth-user-uuid>';
```
