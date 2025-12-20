import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCourses, deleteCourse } from "@/lib/actions/courses";
import CoursesPageClient from "./CoursesPageClient";

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

  const courses = await getCourses();

  return <CoursesPageClient courses={courses} />;
}
