import { createClient } from "@/lib/supabase/server";

export default async function CoursesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: courses } = await supabase
    .from("courses")
    .select("*, enrollments(count)")
    .eq("teacher_id", user?.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Courses</h1>

      {courses && courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-900">
                  {course.name}
                </h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                  {course.code}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {course.description || "No description"}
              </p>
              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-sm text-gray-500">
                  {course.enrollments?.[0]?.count || 0} students
                </span>
                <span className="text-sm text-gray-500">
                  {course.credits || 3} credits
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">You are not teaching any courses yet.</p>
        </div>
      )}
    </div>
  );
}
