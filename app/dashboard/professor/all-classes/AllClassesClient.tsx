"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpenIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import AssignTeacherModal from "@/components/AssignTeacherModal";

export default function ProfessorAllClassesClient({
  courses,
  teachers,
}: {
  courses: any[];
  teachers: any[];
}) {
  const router = useRouter();
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const handleAssignTeacher = (course: any) => {
    setSelectedCourse(course);
    setShowAssignModal(true);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Classes</h1>
        <p className="text-gray-600 mt-1">
          Manage all courses and assign teachers
        </p>
      </div>

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
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                  {course.credits || 3} credits
                </span>
              </div>

              {course.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <UserIcon className="h-4 w-4" />
                  <span>
                    Teacher:{" "}
                    <span className="font-medium text-gray-900">
                      {course.teacher?.full_name || "Unassigned"}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <UserGroupIcon className="h-4 w-4" />
                  <span>
                    {course.enrollments?.[0]?.count || 0} students enrolled
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleAssignTeacher(course)}
                className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
              >
                {course.teacher ? "Reassign Teacher" : "Assign Teacher"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <BookOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No classes yet
          </h3>
          <p className="text-gray-600">
            Classes will appear here once teachers create them
          </p>
        </div>
      )}

      {showAssignModal && selectedCourse && (
        <AssignTeacherModal
          course={selectedCourse}
          teachers={teachers}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedCourse(null);
          }}
          onSuccess={() => {
            router.refresh();
            setShowAssignModal(false);
            setSelectedCourse(null);
          }}
        />
      )}
    </div>
  );
}
