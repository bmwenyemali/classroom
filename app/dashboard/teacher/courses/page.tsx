import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TeacherCoursesClient from "./TeacherCoursesClient";

export default async function TeacherCoursesPage() {
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

  // Get courses assigned to this teacher only
  const { data: courses } = await supabase
    .from("courses")
    .select(
      `
      *,
      enrollments:enrollments(count),
      teacher:profiles!courses_teacher_id_fkey(id, full_name, email)
    `
    )
    .eq("teacher_id", user.id)
    .order("created_at", { ascending: false });

  return <TeacherCoursesClient courses={courses || []} />;
}
