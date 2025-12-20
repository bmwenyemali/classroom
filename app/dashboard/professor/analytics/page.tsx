import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  ChartBarIcon,
  AcademicCapIcon,
  UserGroupIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";

export default async function ProfessorAnalyticsPage() {
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

  // Get statistics
  const [
    { count: totalStudents },
    { count: totalTeachers },
    { count: totalCourses },
    { count: totalGrades },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "student"),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "teacher"),
    supabase.from("courses").select("*", { count: "exact", head: true }),
    supabase.from("grades").select("*", { count: "exact", head: true }),
  ]);

  const { data: grades } = await supabase.from("grades").select("score");

  const averageGrade =
    grades && grades.length > 0
      ? grades.reduce((sum, g) => sum + g.score, 0) / grades.length
      : 0;

  const stats = [
    {
      name: "Total Students",
      value: totalStudents || 0,
      icon: UserGroupIcon,
      color: "bg-blue-500",
    },
    {
      name: "Total Teachers",
      value: totalTeachers || 0,
      icon: AcademicCapIcon,
      color: "bg-green-500",
    },
    {
      name: "Total Courses",
      value: totalCourses || 0,
      icon: BookOpenIcon,
      color: "bg-purple-500",
    },
    {
      name: "Total Grades",
      value: totalGrades || 0,
      icon: ChartBarIcon,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        System Analytics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Overall Performance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-2">Average Grade</p>
            <p className="text-4xl font-bold text-blue-600">
              {averageGrade.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Letter Grade</p>
            <p className="text-4xl font-bold text-green-600">
              {averageGrade >= 90
                ? "A"
                : averageGrade >= 80
                ? "B"
                : averageGrade >= 70
                ? "C"
                : averageGrade >= 60
                ? "D"
                : "F"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
