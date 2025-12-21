import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TeacherCourseDetailClient from "./TeacherCourseDetailClient";

export default async function TeacherCourseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "teacher" && profile?.role !== "tenured_professor") {
    redirect("/dashboard");
  }

  // Get course details (must be assigned to this teacher)
  const { data: course } = await supabase
    .from("courses")
    .select(
      `
      *,
      teacher:profiles!courses_teacher_id_fkey(id, full_name, email),
      enrollments:enrollments(
        id,
        created_at,
        student:profiles!enrollments_student_id_fkey(id, full_name, email)
      )
    `
    )
    .eq("id", params.id)
    .eq("teacher_id", user.id)
    .single();

  if (!course) {
    redirect("/dashboard/teacher/courses");
  }

  // Get all grades for this course
  const { data: grades } = await supabase
    .from("grades")
    .select(
      `
      *,
      student:profiles!grades_student_id_fkey(id, full_name, email)
    `
    )
    .eq("course_id", params.id)
    .order("created_at", { ascending: false });

  return (
    <TeacherCourseDetailClient course={course} initialGrades={grades || []} />
  );
}
