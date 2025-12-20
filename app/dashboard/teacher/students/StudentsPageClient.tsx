"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PlusIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import EnrollmentForm from "@/components/EnrollmentForm";
import { unenrollStudent } from "@/lib/actions/enrollments";

export default function StudentsPageClient({
  students: initialStudents,
  courses,
  enrollments: initialEnrollments,
}: {
  students: any[];
  courses: any[];
  enrollments: any[];
}) {
  const router = useRouter();
  const [students] = useState(initialStudents);
  const [enrollments, setEnrollments] = useState(initialEnrollments);
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [unenrolling, setUnenrolling] = useState<string | null>(null);

  const filteredStudents = students.filter(
    (student) =>
      student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUnenroll = async (
    enrollmentId: string,
    studentName: string,
    courseName: string
  ) => {
    if (!confirm(`Remove ${studentName} from ${courseName}?`)) return;

    setUnenrolling(enrollmentId);
    try {
      await unenrollStudent(enrollmentId);
      setEnrollments(enrollments.filter((e) => e.id !== enrollmentId));
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setUnenrolling(null);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Students & Enrollments
          </h1>
          <p className="text-gray-600 mt-1">
            Manage student enrollments in your courses
          </p>
        </div>
        <button
          onClick={() => setShowEnrollForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          <PlusIcon className="h-5 w-5" />
          Enroll Students
        </button>
      </div>

      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No students found
          </h3>
          <p className="text-gray-600">Try adjusting your search</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrolled Courses
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => {
                const studentEnrollments = enrollments.filter(
                  (e) => e.student_id === student.id
                );

                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {student.full_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {student.email}
                    </td>
                    <td className="px-6 py-4">
                      {studentEnrollments.length === 0 ? (
                        <span className="text-gray-400 text-sm">
                          Not enrolled in any courses
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {studentEnrollments.map((enrollment) => (
                            <div
                              key={enrollment.id}
                              className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs"
                            >
                              <span>{enrollment.course?.code}</span>
                              <button
                                onClick={() =>
                                  handleUnenroll(
                                    enrollment.id,
                                    student.full_name,
                                    enrollment.course?.name
                                  )
                                }
                                disabled={unenrolling === enrollment.id}
                                className="text-blue-900 hover:text-red-600 disabled:opacity-50"
                                title="Remove enrollment"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <span className="text-gray-500">
                        {studentEnrollments.length} courses
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showEnrollForm && (
        <EnrollmentForm
          students={students}
          courses={courses}
          onClose={() => setShowEnrollForm(false)}
          onSuccess={() => {
            router.refresh();
            setShowEnrollForm(false);
          }}
        />
      )}
    </div>
  );
}
