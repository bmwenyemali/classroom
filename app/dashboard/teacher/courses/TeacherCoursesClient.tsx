"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AcademicCapIcon,
  UserGroupIcon,
  FunnelIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

export default function TeacherCoursesClient({
  courses: initialCourses,
}: {
  courses: any[];
}) {
  const router = useRouter();
  const [semesterFilter, setSemesterFilter] = useState("");

  const semesters = Array.from(
    new Set(initialCourses.map((c) => c.semester).filter(Boolean))
  );

  const filteredCourses = semesterFilter
    ? initialCourses.filter((c) => c.semester === semesterFilter)
    : initialCourses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Courses
          </h1>
          <p className="text-gray-600 mt-2">
            View your assigned courses and manage students
          </p>
        </div>

        {/* Semester Filter */}
        {semesters.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="flex items-center gap-4">
              <FunnelIcon className="h-5 w-5 text-gray-500" />
              <select
                value={semesterFilter}
                onChange={(e) => setSemesterFilter(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Semesters</option>
                {semesters.map((semester) => (
                  <option key={semester} value={semester}>
                    {semester}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-600">
                {filteredCourses.length} course
                {filteredCourses.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        )}

        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <AcademicCapIcon className="h-20 w-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              {semesterFilter
                ? "No courses for this semester"
                : "No courses assigned yet"}
            </h3>
            <p className="text-gray-600">
              {semesterFilter
                ? "Try selecting a different semester"
                : "You will see courses here once a professor assigns them to you"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden cursor-pointer"
                onClick={() =>
                  router.push(`/dashboard/teacher/courses/${course.id}`)
                }
              >
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-2xl font-bold text-white">
                      {course.code}
                    </h3>
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                      {course.credits} credits
                    </span>
                  </div>
                  <p className="text-blue-50 font-medium line-clamp-1">
                    {course.name}
                  </p>
                </div>

                <div className="p-6">
                  {course.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <UserGroupIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-gray-700">
                        {course.enrollments?.length || 0} students enrolled
                      </span>
                    </div>
                    {course.semester && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <CalendarIcon className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="text-gray-700 font-medium">
                          {course.semester}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition text-sm font-medium">
                      View Course Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
