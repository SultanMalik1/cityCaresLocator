import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://zlvaaposzmbabknvxpyk.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsdmFhcG9zem1iYWJrbnZ4cHlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ2ODE2ODEsImV4cCI6MjAyMDI1NzY4MX0.uy92wGJermYJxbW7DWao6qHbCKf4NSq6a7Z94QN_eMs";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
