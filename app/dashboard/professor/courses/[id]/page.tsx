import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCourse } from "@/lib/actions/courses";
import { getStudents } from "@/lib/actions/users";
import ProfessorCourseDetailClient from "./CourseDetailClient";

export default async function ProfessorCourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { id } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "tenured_professor") {
    redirect("/dashboard");
  }

  const course = await getCourse(id);
  const students = await getStudents();

  // Get grades for this course
  const { data: grades } = await supabase
    .from("grades")
    .select(
      `
      *,
      student:profiles!grades_student_id_fkey(id, full_name, email)
    `
    )
    .eq("course_id", id)
    .order("created_at", { ascending: false });

  return (
    <ProfessorCourseDetailClient
      course={course}
      students={students}
      grades={grades || []}
    />
  );
}
