"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  AcademicCapIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import CourseForm from "@/components/CourseForm";
import { deleteCourse } from "@/lib/actions/courses";

export default function CoursesPageClient({
  courses: initialCourses,
}: {
  courses: any[];
}) {
  const router = useRouter();
  const [courses, setCourses] = useState(initialCourses);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string, courseName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${courseName}"? This will also delete all enrollments and grades for this course.`
      )
    ) {
      return;
    }

    setDeleting(id);
    try {
      await deleteCourse(id);
      setCourses(courses.filter((c) => c.id !== id));
    } catch (error: any) {
      alert("Error deleting course: " + error.message);
    } finally {
      setDeleting(null);
    }
  };

  const handleSuccess = () => {
    router.refresh();
    setShowForm(false);
    setEditingCourse(null);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-1">
            Manage your courses and view enrollments
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCourse(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          <PlusIcon className="h-5 w-5" />
          Create New Course
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <AcademicCapIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No courses yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first course to get started!
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {course.code}
                  </h3>
                  <p className="text-gray-600 mt-1">{course.name}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingCourse(course);
                      setShowForm(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    title="Edit course"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(course.id, course.name)}
                    disabled={deleting === course.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                    title="Delete course"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {course.description && (
                <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
              )}

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <UsersIcon className="h-4 w-4" />
                  <span>{course.enrollments?.length || 0} students</span>
                </div>
                <div className="flex gap-2">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                    {course.credits || 3} credits
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <CourseForm
          course={editingCourse}
          onClose={() => {
            setShowForm(false);
            setEditingCourse(null);
          }}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
