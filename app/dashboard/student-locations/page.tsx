import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import StudentLocationsClient from "./StudentLocationsClient";

export default async function StudentLocationsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get user profile to check role
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Only teachers and professors can access
  if (!profile || !["teacher", "professor"].includes(profile.role)) {
    redirect("/dashboard");
  }

  // Get students
  let studentsQuery = supabase
    .from("profiles")
    .select("*")
    .eq("role", "student")
    .not("home_address", "is", null);

  // If teacher, only show their students
  if (profile.role === "teacher") {
    // Get courses taught by this teacher
    const { data: courses } = await supabase
      .from("courses")
      .select("id")
      .eq("teacher_id", user.id);

    const courseIds = courses?.map((c) => c.id) || [];

    if (courseIds.length > 0) {
      // Get students enrolled in these courses
      const { data: enrollments } = await supabase
        .from("enrollments")
        .select("student_id")
        .in("course_id", courseIds);

      const studentIds = [
        ...new Set(enrollments?.map((e) => e.student_id) || []),
      ];

      if (studentIds.length > 0) {
        studentsQuery = studentsQuery.in("id", studentIds);
      } else {
        // Teacher has no students
        studentsQuery = studentsQuery.limit(0);
      }
    } else {
      // Teacher has no courses
      studentsQuery = studentsQuery.limit(0);
    }
  }

  const { data: students } = await studentsQuery;

  return (
    <StudentLocationsClient
      students={students || []}
      userRole={profile.role}
      userLocation={
        profile.home_latitude && profile.home_longitude
          ? [profile.home_longitude, profile.home_latitude]
          : null
      }
    />
  );
}
