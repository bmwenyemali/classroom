import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BookOpenIcon, UserGroupIcon } from "@heroicons/react/24/outline";

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

  const { data: courses } = await supabase
    .from("courses")
    .select(
      `
      *,
      teacher:profiles!courses_teacher_id_fkey(id, full_name, email),
      enrollments(count)
    `
    )
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Classes</h1>

      {courses && courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: any) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {course.code}
                  </h3>
                  <p className="text-gray-600 font-medium">{course.name}</p>
                </div>
                <BookOpenIcon className="h-6 w-6 text-blue-600" />
              </div>

              <p className="text-sm text-gray-600 mb-4">
                {course.description || "No description available."}
              </p>

              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {course.credits} Credits
                  </span>
                  <div className="flex items-center text-sm text-gray-600">
                    <UserGroupIcon className="h-4 w-4 mr-1" />
                    <span>{course.enrollments?.[0]?.count || 0} students</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Teacher: {course.teacher?.full_name || "Not assigned"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">No courses available yet.</p>
        </div>
      )}
    </div>
  );
}
