"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getEnrollments(courseId?: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  let query = supabase
    .from("enrollments")
    .select(
      `
      *,
      course:courses(id, code, name, semester),
      student:profiles!enrollments_student_id_fkey(id, full_name, email)
    `
    )
    .order("enrolled_at", { ascending: false });

  if (courseId) {
    query = query.eq("course_id", courseId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function getStudentEnrollments(studentId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("enrollments")
    .select(
      `
      *,
      course:courses(
        id, 
        code, 
        name, 
        semester, 
        credits,
        teacher:profiles!courses_teacher_id_fkey(id, full_name, email)
      )
    `
    )
    .eq("student_id", studentId)
    .order("enrolled_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function enrollStudent(courseId: string, studentId: string) {
  const supabase = await createClient();

  // Check if already enrolled
  const { data: existing } = await supabase
    .from("enrollments")
    .select("id")
    .eq("course_id", courseId)
    .eq("student_id", studentId)
    .single();

  if (existing) {
    throw new Error("Student already enrolled in this course");
  }

  const { data, error } = await supabase
    .from("enrollments")
    .insert([
      {
        course_id: courseId,
        student_id: studentId,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/dashboard/teacher/students");
  revalidatePath("/dashboard/student/classes");
  revalidatePath(`/dashboard/teacher/courses/${courseId}`);

  return data;
}

export async function unenrollStudent(enrollmentId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("enrollments")
    .delete()
    .eq("id", enrollmentId);

  if (error) throw error;

  revalidatePath("/dashboard/teacher/students");
  revalidatePath("/dashboard/student/classes");
}

export async function bulkEnrollStudents(
  courseId: string,
  studentIds: string[]
) {
  const supabase = await createClient();

  const enrollments = studentIds.map((studentId) => ({
    course_id: courseId,
    student_id: studentId,
  }));

  const { data, error } = await supabase
    .from("enrollments")
    .insert(enrollments)
    .select();

  if (error) throw error;

  revalidatePath("/dashboard/teacher/students");
  revalidatePath(`/dashboard/teacher/courses/${courseId}`);

  return data;
}
