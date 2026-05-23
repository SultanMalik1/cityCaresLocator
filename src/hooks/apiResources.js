import supabase, { isSupabaseConfigured } from "./supabase"

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

/** All organizations for the public map (Phase 5). */
export async function getOrganizations() {
  const client = assertSupabase()
  if (!client) return []

  const { data, error } = await client
    .from(ORGANIZATIONS_TABLE)
    .select("*")
    .order("name", { ascending: true })

  if (error) throw toError(error, "Organizations could not be loaded")

  return Array.isArray(data) ? data : []
}

/** Single organization by primary key. Returns null when not found. */
export async function getOrganizationById(id) {
  const client = assertSupabase()
  if (!client) return null

  if (id === undefined || id === null || id === "") return null

  const { data, error } = await client
    .from(ORGANIZATIONS_TABLE)
    .select("*")
    .eq("id", id)
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

/** @deprecated Use getOrganizations */
export async function getData() {
  return getOrganizations()
}
