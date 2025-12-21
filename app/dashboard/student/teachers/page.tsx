import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UserGroupIcon } from "@heroicons/react/24/outline";

export default async function StudentTeachersPage() {
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

  if (profile?.role !== "student") {
    redirect("/dashboard");
  }

  // Get all teachers from courses the student is enrolled in
  const { data: teachers } = await supabase
    .from("enrollments")
    .select(
      `
      course:courses(
        teacher:profiles!courses_teacher_id_fkey(id, full_name, email, phone)
      )
    `
    )
    .eq("student_id", user.id);

  // Extract unique teachers
  const uniqueTeachers = Array.from(
    new Map(
      teachers
        ?.map((e: any) => e.course?.teacher)
        .filter(Boolean)
        .map((t: any) => [t.id, t])
    ).values()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
        My Teachers
      </h1>

      {uniqueTeachers && uniqueTeachers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uniqueTeachers.map((teacher: any) => (
            <div
              key={teacher.id}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full p-3 mr-4">
                  <UserGroupIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {teacher.full_name || "No name"}
                  </h3>
                  <p className="text-sm text-gray-500">Teacher</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-2">Email:</span>
                  <a
                    href={`mailto:${teacher.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {teacher.email}
                  </a>
                </div>
                {teacher.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">Phone:</span>
                    <span>{teacher.phone}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center hover:shadow-xl transition-all duration-300">
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">
            You don't have any teachers yet.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Enroll in a course to see your teachers.
          </p>
        </div>
      )}
    </div>
  );
}
