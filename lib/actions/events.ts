"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getEvents(startDate?: string, endDate?: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  let query = supabase
    .from("events")
    .select(
      `
      *,
      course:courses(id, code, name),
      created_by_user:profiles!events_created_by_fkey(id, full_name, email)
    `
    )
    .order("start_time", { ascending: true });

  if (startDate) {
    query = query.gte("start_time", startDate);
  }

  if (endDate) {
    query = query.lte("start_time", endDate);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function getUserEvents(userId: string) {
  const supabase = await createClient();

  // Get user's enrolled courses
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("course_id")
    .eq("student_id", userId);

  const courseIds = enrollments?.map((e) => e.course_id) || [];

  // Get events for those courses
  const { data, error } = await supabase
    .from("events")
    .select(
      `
      *,
      course:courses(id, code, name)
    `
    )
    .in("course_id", courseIds)
    .gte("start_time", new Date().toISOString())
    .order("start_time", { ascending: true })
    .limit(10);

  if (error) throw error;
  return data;
}

export async function createEvent(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const eventData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    event_type: formData.get("event_type") as string,
    course_id: (formData.get("course_id") as string) || null,
    start_time: formData.get("start_time") as string,
    end_time: formData.get("end_time") as string,
    location: formData.get("location") as string,
    created_by: user.id,
  };

  const { data, error } = await supabase
    .from("events")
    .insert([eventData])
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/dashboard/student/calendar");
  revalidatePath("/dashboard/teacher/calendar");

  return data;
}

export async function updateEvent(id: string, formData: FormData) {
  const supabase = await createClient();

  const eventData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    event_type: formData.get("event_type") as string,
    course_id: (formData.get("course_id") as string) || null,
    start_time: formData.get("start_time") as string,
    end_time: formData.get("end_time") as string,
    location: formData.get("location") as string,
  };

  const { data, error } = await supabase
    .from("events")
    .update(eventData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/dashboard/student/calendar");
  revalidatePath("/dashboard/teacher/calendar");

  return data;
}

export async function deleteEvent(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) throw error;

  revalidatePath("/dashboard/student/calendar");
  revalidatePath("/dashboard/teacher/calendar");
}
