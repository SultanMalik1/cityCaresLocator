import supabase from "./supabase";

export async function getData() {
  console.log('Fetching data from Supabase...');
  const { data, error } = await supabase.from("organizations").select("*");

  if (error) {
    console.error('Supabase error:', error);
    throw new Error("Data could not be loaded");
  }

  console.log('Data fetched successfully:', data);
  return data;
}
