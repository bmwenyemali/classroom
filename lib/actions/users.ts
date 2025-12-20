"use server";

import { createClient } from "@/lib/supabase/server";

export async function getStudents(searchTerm?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("profiles")
    .select("*")
    .eq("role", "student")
    .order("full_name", { ascending: true });

  if (searchTerm) {
    query = query.or(
      `full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`
    );
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function getTeachers() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .in("role", ["teacher", "tenured_professor"])
    .order("full_name", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getUserProfile(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, formData: FormData) {
  const supabase = await createClient();

  const profileData = {
    full_name: formData.get("full_name") as string,
    phone: formData.get("phone") as string,
  };

  const { data, error } = await supabase
    .from("profiles")
    .update(profileData)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
