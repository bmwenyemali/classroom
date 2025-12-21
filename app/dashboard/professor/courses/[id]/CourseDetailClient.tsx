"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  UserPlusIcon,
  UserMinusIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import EnrollmentForm from "@/components/EnrollmentForm";
import { unenrollStudent } from "@/lib/actions/enrollments";

export default function ProfessorCourseDetailClient({
  course,
  students,
  grades: initialGrades,
}: {
  course: any;
  students: any[];
  grades: any[];
}) {
  const router = useRouter();
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [unenrolling, setUnenrolling] = useState<string | null>(null);
  const [grades] = useState(initialGrades);

  const enrolledStudents = course.enrollments || [];

  const handleUnenroll = async (enrollmentId: string, studentName: string) => {
    if (!confirm(`Remove ${studentName} from this course?`)) return;

    setUnenrolling(enrollmentId);
    try {
      await unenrollStudent(enrollmentId);
      router.refresh();
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setUnenrolling(null);
    }
  };

  // Calculate student statistics
  const studentStats = enrolledStudents.map((enrollment: any) => {
    const studentGrades = grades.filter(
      (g) => g.student_id === enrollment.student.id
    );
    const avgScore =
      studentGrades.length > 0
        ? studentGrades.reduce((sum, g) => sum + g.score, 0) /
          studentGrades.length
        : 0;

    return {
      ...enrollment,
      gradeCount: studentGrades.length,
      avgScore: parseFloat(avgScore.toFixed(2)),
    };
  });

  const classAverage =
    studentStats.length > 0
      ? studentStats.reduce((sum: number, s: any) => sum + s.avgScore, 0) /
        studentStats.length
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="font-medium">Back to Courses</span>
        </button>

        {/* Course Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">{course.code}</h1>
                <p className="text-2xl text-blue-100 mb-4">{course.name}</p>
                {course.description && (
                  <p className="text-blue-50 max-w-2xl">{course.description}</p>
                )}
              </div>
              <div className="text-right">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold">{course.credits}</div>
                  <div className="text-sm text-blue-100">Credits</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <AcademicCapIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    Teacher
                  </div>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {course.teacher?.full_name || "No teacher"}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <UserGroupIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    Students
                  </div>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {enrolledStudents.length}
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <ChartBarIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    Class Avg
                  </div>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {classAverage.toFixed(1)}%
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">📅</span>
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    Semester
                  </div>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {course.semester || "Not set"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Students Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Enrolled Students
            </h2>
            <button
              onClick={() => setShowEnrollForm(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition shadow-lg"
            >
              <UserPlusIcon className="h-5 w-5" />
              Enroll Students
            </button>
          </div>

          {enrolledStudents.length === 0 ? (
            <div className="p-12 text-center">
              <UserGroupIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No students enrolled yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start by enrolling students in this course
              </p>
              <button
                onClick={() => setShowEnrollForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition shadow-lg"
              >
                Enroll First Student
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Grades
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Average
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Enrolled
                    </th>
                    <th className="px-8 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studentStats.map((stat: any) => (
                    <tr key={stat.id} className="hover:bg-gray-50 transition">
                      <td className="px-8 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {stat.student.full_name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {stat.student.full_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-600">
                        {stat.student.email}
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {stat.gradeCount} grade
                          {stat.gradeCount !== 1 ? "s" : ""}
                        </span>
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap">
                        {stat.gradeCount > 0 ? (
                          <span
                            className={`text-sm font-bold ${
                              stat.avgScore >= 90
                                ? "text-green-600"
                                : stat.avgScore >= 80
                                ? "text-blue-600"
                                : stat.avgScore >= 70
                                ? "text-yellow-600"
                                : stat.avgScore >= 60
                                ? "text-orange-600"
                                : "text-red-600"
                            }`}
                          >
                            {stat.avgScore}%
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">
                            No grades
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(stat.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() =>
                            handleUnenroll(stat.id, stat.student.full_name)
                          }
                          disabled={unenrolling === stat.id}
                          className="inline-flex items-center gap-2 text-red-600 hover:text-red-900 disabled:opacity-50 transition"
                        >
                          <UserMinusIcon className="h-5 w-5" />
                          <span>Remove</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showEnrollForm && (
          <EnrollmentForm
            students={students}
            courses={[course]}
            defaultCourseId={course.id}
            onClose={() => setShowEnrollForm(false)}
            onSuccess={() => {
              router.refresh();
              setShowEnrollForm(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
