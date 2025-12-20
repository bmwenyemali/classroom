import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getStudentGradeStats } from "@/lib/actions/grades";
import {
  ChartBarIcon,
  AcademicCapIcon,
  TrophyIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default async function StudentGradesPage() {
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

  const stats = await getStudentGradeStats(user.id);

  const getLetterGrade = (percentage: number) => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-100 text-green-800";
    if (percentage >= 80) return "bg-blue-100 text-blue-800";
    if (percentage >= 70) return "bg-yellow-100 text-yellow-800";
    if (percentage >= 60) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Grades</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">GPA</p>
              <p className="text-4xl font-bold">{stats.gpa.toFixed(2)}</p>
              <p className="text-blue-100 text-sm mt-2">out of 4.0</p>
            </div>
            <TrophyIcon className="h-16 w-16 text-blue-200 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">
                Average Score
              </p>
              <p className="text-4xl font-bold">{stats.averageScore}%</p>
              <p className="text-green-100 text-sm mt-2">
                Grade: {getLetterGrade(stats.averageScore)}
              </p>
            </div>
            <ChartBarIcon className="h-16 w-16 text-green-200 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-1">
                Total Grades
              </p>
              <p className="text-4xl font-bold">{stats.totalGrades}</p>
              <p className="text-purple-100 text-sm mt-2">
                across {stats.courseAverages.length} courses
              </p>
            </div>
            <AcademicCapIcon className="h-16 w-16 text-purple-200 opacity-50" />
          </div>
        </div>
      </div>

      {/* Course Averages */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Course Performance
          </h2>
        </div>
        <div className="p-6">
          {stats.courseAverages.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No course grades yet
            </p>
          ) : (
            <div className="space-y-4">
              {stats.courseAverages.map((course: any) => (
                <div
                  key={course.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {course.code}
                      </h3>
                      <p className="text-sm text-gray-600">{course.name}</p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`inline-block px-4 py-2 rounded-lg font-bold ${getGradeColor(
                          course.average
                        )}`}
                      >
                        {course.average.toFixed(1)}%
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {course.gradeCount} grade
                        {course.gradeCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        course.average >= 90
                          ? "bg-green-500"
                          : course.average >= 80
                          ? "bg-blue-500"
                          : course.average >= 70
                          ? "bg-yellow-500"
                          : course.average >= 60
                          ? "bg-orange-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${Math.min(course.average, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Grades */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <ClockIcon className="h-5 w-5 text-gray-500" />
          <h2 className="text-xl font-bold text-gray-900">Recent Grades</h2>
        </div>
        <div className="overflow-x-auto">
          {stats.recentGrades.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No grades yet</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentGrades.map((grade: any) => {
                  const percentage = (grade.score / grade.max_score) * 100;
                  return (
                    <tr key={grade.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {grade.course?.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {grade.assignment_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {grade.grade_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {grade.score}/{grade.max_score}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                        {percentage.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-lg font-bold ${getGradeColor(
                            percentage
                          )}`}
                        >
                          {getLetterGrade(percentage)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
