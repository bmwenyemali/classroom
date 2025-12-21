import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BookOpenIcon } from "@heroicons/react/24/outline";

export default async function StudentClassesPage() {
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

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(
      `
      *,
      course:courses(id, code, name, description, credits, teacher:profiles!courses_teacher_id_fkey(full_name, email))
    `
    )
    .eq("student_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
        My Classes
      </h1>

      {enrollments && enrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment: any) => (
            <div
              key={enrollment.id}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                    {enrollment.course?.code}
                  </h3>
                  <p className="text-gray-700 font-medium">
                    {enrollment.course?.name}
                  </p>
                </div>
                <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                  <BookOpenIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                {enrollment.course?.description || "No description available."}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800">
                  {enrollment.course?.credits} Credits
                </span>
                <p className="text-xs text-gray-600 font-medium">
                  {enrollment.course?.teacher?.full_name ||
                    "No teacher assigned"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center hover:shadow-xl transition-all duration-300">
          <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">
            You are not enrolled in any classes yet.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Contact your professor to be enrolled in a course.
          </p>
        </div>
      )}
    </div>
  );
}
