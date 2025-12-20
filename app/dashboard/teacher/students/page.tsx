import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getStudents } from "@/lib/actions/users";
import { getCourses } from "@/lib/actions/courses";
import { getEnrollments } from "@/lib/actions/enrollments";
import StudentsPageClient from "./StudentsPageClient";

export default async function TeacherStudentsPage() {
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

  const [students, courses, enrollments] = await Promise.all([
    getStudents(),
    getCourses(),
    getEnrollments(),
  ]);

  return (
    <StudentsPageClient
      students={students}
      courses={courses}
      enrollments={enrollments}
    />
  );
}
