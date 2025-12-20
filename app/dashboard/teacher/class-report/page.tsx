import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCourses } from "@/lib/actions/courses";
import ClassReportClient from "./ClassReportClient";

export default async function ClassReportPage() {
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

  return <ClassReportClient courses={courses} />;
}
