import supabase, { isSupabaseConfigured } from "./supabase"
import { ORGANIZATION_STATUS } from "../constants/organizationStatus"

const ORGANIZATIONS_TABLE = "organizations"

function assertSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    return null
  }
  return supabase
}

function toError(error, fallback) {
  console.error("Supabase error:", error)
  return new Error(error?.message || fallback)
}

/** Public map: approved organizations only (Phase 6). */
export async function getOrganizations() {
  const client = assertSupabase()
  if (!client) return []

  const { data, error } = await client
    .from(ORGANIZATIONS_TABLE)
    .select("*")
    .eq("status", ORGANIZATION_STATUS.APPROVED)
    .order("name", { ascending: true })

  if (error) throw toError(error, "Organizations could not be loaded")

  return Array.isArray(data) ? data : []
}

/** Public detail: approved organization only, or null if missing / not approved. */
export async function getOrganizationById(id) {
  const client = assertSupabase()
  if (!client) return null

  if (id === undefined || id === null || id === "") return null

  const { data, error } = await client
    .from(ORGANIZATIONS_TABLE)
    .select("*")
    .eq("id", id)
    .eq("status", ORGANIZATION_STATUS.APPROVED)
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw toError(error, "Organization could not be loaded")
  }

  return data ?? null
}

/** Sync lookup from an in-memory list (e.g. context cache). */
export function findOrganizationById(organizations, id) {
  const list = Array.isArray(organizations) ? organizations : []
  if (id === undefined || id === null || id === "") return null
  return list.find((org) => String(org.id) === String(id)) ?? null
}

/** Contributor / admin: insert a pending organization (Phase 7). */
export async function createOrganization(organization) {
  const client = assertSupabase()
  if (!client) throw new Error("Supabase is not configured")

  const {
    data: { user },
    error: userError,
  } = await client.auth.getUser()

  if (userError) throw toError(userError, "Could not verify sign-in")
  if (!user) throw new Error("You must be signed in to submit an organization")

  const payload = {
    name: organization.name,
    cityname: organization.cityname ?? "New York",
    oneliner: organization.oneliner ?? null,
    fivebasics: organization.fivebasics ?? null,
    notes: organization.notes ?? null,
    address: organization.address ?? null,
    website: organization.website ?? null,
    position: organization.position ?? null,
    status: ORGANIZATION_STATUS.PENDING,
    created_by: user.id,
  }

  const { data, error } = await client
    .from(ORGANIZATIONS_TABLE)
    .insert(payload)
    .select()
    .single()

  if (error) throw toError(error, "Could not submit organization")

  return data
}

/** Admin: list organizations awaiting approval. */
export async function getPendingOrganizations() {
  const client = assertSupabase()
  if (!client) return []

  const { data, error } = await client
    .from(ORGANIZATIONS_TABLE)
    .select("*")
    .eq("status", ORGANIZATION_STATUS.PENDING)
    .order("created_at", { ascending: false })

  if (error) throw toError(error, "Could not load pending organizations")

  return Array.isArray(data) ? data : []
}

/** Admin: approve or reject an organization. */
export async function updateOrganizationStatus(id, status) {
  const client = assertSupabase()
  if (!client) throw new Error("Supabase is not configured")

  const { data, error } = await client
    .from(ORGANIZATIONS_TABLE)
    .update({ status })
    .eq("id", id)
    .select()
    .single()

  if (error) throw toError(error, "Could not update organization status")

  return data
}

/** @deprecated Use getOrganizations */
export async function getData() {
  return getOrganizations()
}
