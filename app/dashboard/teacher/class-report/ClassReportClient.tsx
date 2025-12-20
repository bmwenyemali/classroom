"use client";

import { useState, useEffect } from "react";
import { getClassReport } from "@/lib/actions/reports";
import {
  ChartBarIcon,
  TrophyIcon,
  XCircleIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

export default function ClassReportClient({ courses }: { courses: any[] }) {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCourseChange = async (courseId: string) => {
    setSelectedCourse(courseId);
    if (!courseId) {
      setReport(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getClassReport(courseId);
      setReport(data);
    } catch (err: any) {
      setError(err.message || "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Class Reports</h1>
        <p className="text-gray-600 mt-1">
          View detailed performance reports for your classes
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Course
        </label>
        <select
          value={selectedCourse}
          onChange={(e) => handleCourseChange(e.target.value)}
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">-- Select a course --</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.code} - {course.name}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading report...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {report && !loading && (
        <div className="space-y-6">
          {/* Class Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">
                  Class Average
                </h3>
                <ChartBarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {report.classStats.average}%
              </p>
              <p className="text-sm text-gray-600 mt-1">
                GPA: {report.classStats.gpa}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">
                  Total Students
                </h3>
                <AcademicCapIcon className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {report.course.totalStudents}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Passing</h3>
                <TrophyIcon className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">
                {report.classStats.passingCount}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {report.classStats.passRate}% pass rate
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Failing</h3>
                <XCircleIcon className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-3xl font-bold text-red-600">
                {report.classStats.failingCount}
              </p>
            </div>
          </div>

          {/* Top and Bottom Performers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {report.topPerformer && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                  <TrophyIcon className="h-6 w-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-900">
                    Top Performer
                  </h3>
                </div>
                <p className="text-xl font-bold text-gray-900 mb-1">
                  {report.topPerformer.student.full_name}
                </p>
                <div className="flex gap-4 text-sm text-gray-700">
                  <span>Average: {report.topPerformer.averageScore}%</span>
                  <span>GPA: {report.topPerformer.gpa}</span>
                  <span className="font-medium text-green-700">
                    {report.topPerformer.status}
                  </span>
                </div>
              </div>
            )}

            {report.lowestPerformer && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                  <XCircleIcon className="h-6 w-6 text-orange-600" />
                  <h3 className="text-lg font-semibold text-orange-900">
                    Needs Attention
                  </h3>
                </div>
                <p className="text-xl font-bold text-gray-900 mb-1">
                  {report.lowestPerformer.student.full_name}
                </p>
                <div className="flex gap-4 text-sm text-gray-700">
                  <span>Average: {report.lowestPerformer.averageScore}%</span>
                  <span>GPA: {report.lowestPerformer.gpa}</span>
                  <span
                    className={`font-medium ${
                      report.lowestPerformer.isPassing
                        ? "text-orange-700"
                        : "text-red-700"
                    }`}
                  >
                    {report.lowestPerformer.status}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Student List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Student Performance
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Grades
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Average
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      GPA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {report.students.map((student: any, index: number) => (
                    <tr
                      key={student.student.id}
                      className={
                        index === 0
                          ? "bg-green-50"
                          : index === report.students.length - 1
                          ? "bg-orange-50"
                          : ""
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {student.student.full_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.student.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.totalGrades}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {student.averageScore}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.gpa}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            student.status === "Excellent"
                              ? "bg-green-100 text-green-800"
                              : student.status === "Good"
                              ? "bg-blue-100 text-blue-800"
                              : student.status === "Average"
                              ? "bg-yellow-100 text-yellow-800"
                              : student.status === "Below Average"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!selectedCourse && !loading && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <ChartBarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Select a Course
          </h3>
          <p className="text-gray-600">
            Choose a course from the dropdown above to view its performance
            report
          </p>
        </div>
      )}
    </div>
  );
}
