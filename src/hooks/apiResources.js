import supabase, { isSupabaseConfigured } from "./supabase"

export async function getData() {
  if (!isSupabaseConfigured || !supabase) {
    return []
  }

  const { data, error } = await supabase.from("organizations").select("*")

  if (error) {
    console.error("Supabase error:", error)
    throw new Error(error.message || "Data could not be loaded")
  }

  return Array.isArray(data) ? data : []
}
