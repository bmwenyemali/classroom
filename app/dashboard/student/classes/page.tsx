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
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Classes</h1>

      {enrollments && enrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment: any) => (
            <div
              key={enrollment.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {enrollment.course?.code}
                  </h3>
                  <p className="text-gray-600 font-medium">
                    {enrollment.course?.name}
                  </p>
                </div>
                <BookOpenIcon className="h-6 w-6 text-blue-600" />
              </div>

              <p className="text-sm text-gray-600 mb-4">
                {enrollment.course?.description || "No description available."}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {enrollment.course?.credits} Credits
                </span>
                <p className="text-xs text-gray-500">
                  {enrollment.course?.teacher?.full_name ||
                    "No teacher assigned"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">
            You are not enrolled in any classes yet.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Contact your teacher to be enrolled in a course.
          </p>
        </div>
      )}
    </div>
  );
}
