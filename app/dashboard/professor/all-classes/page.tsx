import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AllClassesClient from "./AllClassesClient";

export default async function ProfessorAllClassesPage() {
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

  if (profile?.role !== "tenured_professor") {
    redirect("/dashboard");
  }

  const [coursesResult, teachersResult] = await Promise.all([
    supabase
      .from("courses")
      .select(
        `
        *,
        teacher:profiles!courses_teacher_id_fkey(id, full_name, email),
        enrollments(count)
      `
      )
      .order("created_at", { ascending: false }),
    supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("role", ["teacher", "tenured_professor"])
      .order("full_name", { ascending: true }),
  ]);

  const courses = coursesResult.data || [];
  const teachers = teachersResult.data || [];

  return <AllClassesClient courses={courses} teachers={teachers} />;
}
