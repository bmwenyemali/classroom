"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import GradeFormModal from "@/components/GradeFormModal";
import { deleteGrade } from "@/lib/actions/grades";

export default function GradeEntryPageClient({
  students,
  courses,
  grades: initialGrades,
}: {
  students: any[];
  courses: any[];
  grades: any[];
}) {
  const router = useRouter();
  const [grades, setGrades] = useState(initialGrades);
  const [showForm, setShowForm] = useState(false);
  const [editingGrade, setEditingGrade] = useState<any>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filterCourse, setFilterCourse] = useState("");
  const [filterStudent, setFilterStudent] = useState("");

  const filteredGrades = grades.filter((grade) => {
    if (filterCourse && grade.course_id !== filterCourse) return false;
    if (filterStudent && grade.student_id !== filterStudent) return false;
    return true;
  });

  const handleDelete = async (
    id: string,
    studentName: string,
    assignmentName: string
  ) => {
    if (!confirm(`Delete grade for ${studentName} - ${assignmentName}?`))
      return;

    setDeleting(id);
    try {
      await deleteGrade(id);
      setGrades(grades.filter((g) => g.id !== id));
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Grade Entry</h1>
          <p className="text-gray-600 mt-1">Enter and manage student grades</p>
        </div>
        <button
          onClick={() => {
            setEditingGrade(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          <PlusIcon className="h-5 w-5" />
          Add Grade
        </button>
      </div>

      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Course
            </label>
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Student
            </label>
            <select
              value={filterStudent}
              onChange={(e) => setFilterStudent(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Students</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.full_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredGrades.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <AcademicCapIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No grades yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start entering grades for your students
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Add First Grade
          </button>
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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGrades.map((grade) => {
                const percentage = (
                  (grade.score / grade.max_score) *
                  100
                ).toFixed(1);
                let gradeColor = "text-gray-900";
                if (parseFloat(percentage) >= 90) gradeColor = "text-green-600";
                else if (parseFloat(percentage) >= 80)
                  gradeColor = "text-blue-600";
                else if (parseFloat(percentage) >= 70)
                  gradeColor = "text-yellow-600";
                else if (parseFloat(percentage) >= 60)
                  gradeColor = "text-orange-600";
                else gradeColor = "text-red-600";

                return (
                  <tr key={grade.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {grade.student?.full_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-semibold ${gradeColor}`}>
                        {percentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => {
                            setEditingGrade(grade);
                            setShowForm(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit grade"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(
                              grade.id,
                              grade.student?.full_name,
                              grade.assignment_name
                            )
                          }
                          disabled={deleting === grade.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                          title="Delete grade"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <GradeFormModal
          grade={editingGrade}
          students={students}
          courses={courses}
          onClose={() => {
            setShowForm(false);
            setEditingGrade(null);
          }}
          onSuccess={() => {
            router.refresh();
            setShowForm(false);
            setEditingGrade(null);
          }}
        />
      )}
    </div>
  );
}
