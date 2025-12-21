"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  AcademicCapIcon,
  UserGroupIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import ProfessorCourseForm from "@/components/ProfessorCourseForm";
import { deleteCourse } from "@/lib/actions/courses";

export default function ProfessorCoursesClient({
  courses: initialCourses,
  teachers,
}: {
  courses: any[];
  teachers: any[];
}) {
  const router = useRouter();
  const [courses, setCourses] = useState(initialCourses);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [semesterFilter, setSemesterFilter] = useState("");

  const semesters = Array.from(
    new Set(courses.map((c) => c.semester).filter(Boolean))
  );

  const filteredCourses = semesterFilter
    ? courses.filter((c) => c.semester === semesterFilter)
    : courses;

  const handleDelete = async (id: string, courseName: string) => {
    if (
      !confirm(
        `Delete course "${courseName}"? This will remove all enrollments and grades.`
      )
    )
      return;

    setDeleting(id);
    try {
      await deleteCourse(id);
      setCourses(courses.filter((c) => c.id !== id));
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Course Management
            </h1>
            <p className="text-gray-600 mt-2">Create and manage all courses</p>
          </div>
          <button
            onClick={() => {
              setEditingCourse(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <PlusIcon className="h-5 w-5" />
            Create New Course
          </button>
        </div>

        {/* Semester Filter */}
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

        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <AcademicCapIcon className="h-20 w-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              {semesterFilter
                ? "No courses for this semester"
                : "No courses yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {semesterFilter
                ? "Try selecting a different semester"
                : "Create your first course to get started"}
            </p>
            {!semesterFilter && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition shadow-lg"
              >
                Create First Course
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
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

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <AcademicCapIcon className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="text-gray-700">
                        <span className="font-semibold">
                          {course.teacher?.full_name || "No teacher"}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <UserGroupIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-gray-700">
                        {course.enrollments?.[0]?.count || 0} students enrolled
                      </span>
                    </div>
                    {course.semester && (
                      <div className="inline-block">
                        <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                          {course.semester}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/professor/courses/${course.id}`)
                      }
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition text-sm font-medium"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        setEditingCourse(course);
                        setShowForm(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit course"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id, course.name)}
                      disabled={deleting === course.id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 transition"
                      title="Delete course"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <ProfessorCourseForm
            course={editingCourse}
            teachers={teachers}
            onClose={() => {
              setShowForm(false);
              setEditingCourse(null);
            }}
            onSuccess={() => {
              router.refresh();
              setShowForm(false);
              setEditingCourse(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
