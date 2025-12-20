"use client";

import { useState } from "react";
import { createGrade, updateGrade } from "@/lib/actions/grades";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface GradeFormModalProps {
  grade?: any;
  students?: any[];
  courses?: any[];
  defaultStudentId?: string;
  defaultCourseId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function GradeFormModal({
  grade,
  students,
  courses,
  defaultStudentId,
  defaultCourseId,
  onClose,
  onSuccess,
}: GradeFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);

      if (grade) {
        await updateGrade(grade.id, formData);
      } else {
        await createGrade(formData);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {grade ? "Edit Grade" : "Add New Grade"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            type="button"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {!grade && (
            <>
              <div>
                <label
                  htmlFor="student_id"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Student *
                </label>
                <select
                  id="student_id"
                  name="student_id"
                  defaultValue={defaultStudentId}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Student</option>
                  {students?.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.full_name} ({student.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="course_id"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Course *
                </label>
                <select
                  id="course_id"
                  name="course_id"
                  defaultValue={defaultCourseId}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Course</option>
                  {courses?.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.code} - {course.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <label
              htmlFor="assignment_name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Assignment Name *
            </label>
            <input
              type="text"
              id="assignment_name"
              name="assignment_name"
              defaultValue={grade?.assignment_name}
              required
              placeholder="e.g., Midterm Exam"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="score"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Score (out of 100) *
            </label>
            <input
              type="number"
              id="score"
              name="score"
              defaultValue={grade?.score}
              required
              step="0.01"
              min="0"
              max="100"
              placeholder="e.g., 85"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : grade ? "Update Grade" : "Add Grade"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
