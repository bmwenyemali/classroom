"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getCourses() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  let query = supabase
    .from("courses")
    .select(
      `
      *,
      teacher:profiles!courses_teacher_id_fkey(id, full_name, email)
    `
    )
    .order("created_at", { ascending: false });

  // Teachers only see their own courses
  if (profile?.role === "teacher") {
    query = query.eq("teacher_id", user.id);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function getCourse(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .select(
      `
      *,
      teacher:profiles!courses_teacher_id_fkey(id, full_name, email),
      enrollments(
        id,
        created_at,
        student:profiles!enrollments_student_id_fkey(id, full_name, email)
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createCourse(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Verify user is a professor
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "tenured_professor") {
    throw new Error("Only professors can create courses");
  }

  const courseData = {
    code: formData.get("code") as string,
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    teacher_id: formData.get("teacher_id") as string, // Professor assigns teacher
    semester: formData.get("semester") as string,
    credits: parseInt((formData.get("credits") as string) || "3"),
  };

  const { data, error } = await supabase
    .from("courses")
    .insert([courseData])
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/dashboard/teacher/courses");
  revalidatePath("/dashboard/professor/all-classes");

  return data;
}

export async function updateCourse(id: string, formData: FormData) {
  const supabase = await createClient();

  const courseData = {
    code: formData.get("code") as string,
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    credits: parseInt((formData.get("credits") as string) || "3"),
  };

  const { data, error } = await supabase
    .from("courses")
    .update(courseData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/dashboard/teacher/courses");
  revalidatePath("/dashboard/professor/all-classes");
  revalidatePath(`/dashboard/teacher/courses/${id}`);

  return data;
}

export async function deleteCourse(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("courses").delete().eq("id", id);

  if (error) throw error;

  revalidatePath("/dashboard/teacher/courses");
  revalidatePath("/dashboard/professor/all-classes");
}

export async function assignTeacherToCourse(
  courseId: string,
  teacherId: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Verify user is a professor
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "tenured_professor") {
    throw new Error("Only professors can assign teachers to courses");
  }

  const { data, error } = await supabase
    .from("courses")
    .update({ teacher_id: teacherId })
    .eq("id", courseId)
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/dashboard/professor/all-classes");
  revalidatePath("/dashboard/teacher/courses");

  return data;
}
