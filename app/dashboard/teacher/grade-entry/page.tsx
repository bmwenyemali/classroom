import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getStudents } from "@/lib/actions/users";
import { getCourses } from "@/lib/actions/courses";
import { getGrades } from "@/lib/actions/grades";
import GradeEntryPageClient from "./GradeEntryPageClient";

export default async function TeacherGradeEntryPage() {
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

  const [students, courses, grades] = await Promise.all([
    getStudents(),
    getCourses(),
    getGrades(),
  ]);

  return (
    <GradeEntryPageClient
      students={students}
      courses={courses}
      grades={grades}
    />
  );
}
