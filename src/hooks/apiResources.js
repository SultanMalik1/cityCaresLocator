import supabase from "./supabase";

export async function getData() {
  const { data, error } = await supabase.from("organizations").select("*");

  if (error) {
    console.log(error);
    throw new Error("Data could not be loaded");
  }
  return data;
}
