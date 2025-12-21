"use client";

import { useState, useMemo } from "react";
import { Course, Grade } from "@/lib/types";
import {
  AcademicCapIcon,
  UserGroupIcon,
  ChartBarIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

interface TeacherCourseDetailClientProps {
  course: Course & {
    enrollments: Array<{
      id: string;
      created_at: string;
      student: {
        id: string;
        full_name: string;
        email: string;
      };
    }>;
  };
  initialGrades: Grade[];
}

export default function TeacherCourseDetailClient({
  course,
  initialGrades,
}: TeacherCourseDetailClientProps) {
  const [selectedSemester, setSelectedSemester] = useState<string>("all");
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [assignmentName, setAssignmentName] = useState("");
  const [score, setScore] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter enrollments by semester if applicable
  const filteredEnrollments = useMemo(() => {
    if (selectedSemester === "all") return course.enrollments;
    // For semester filtering, we'd need to add created_at filtering logic
    // For now, just return all enrollments
    return course.enrollments;
  }, [course.enrollments, selectedSemester]);

  // Calculate student statistics
  const studentStats = useMemo(() => {
    return filteredEnrollments.map((enrollment) => {
      const studentGrades = initialGrades.filter(
        (g) => g.student_id === enrollment.student.id
      );
      const avgScore =
        studentGrades.length > 0
          ? studentGrades.reduce((sum, g) => sum + g.score, 0) /
            studentGrades.length
          : null;

      return {
        ...enrollment,
        gradeCount: studentGrades.length,
        avgScore,
      };
    });
  }, [filteredEnrollments, initialGrades]);

  // Calculate class average
  const classAverage = useMemo(() => {
    const allScores = initialGrades.map((g) => g.score);
    if (allScores.length === 0) return null;
    return allScores.reduce((sum, score) => sum + score, 0) / allScores.length;
  }, [initialGrades]);

  const handleAddGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !assignmentName || !score) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/grades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: selectedStudent,
          course_id: course.id,
          assignment_name: assignmentName,
          score: parseFloat(score),
        }),
      });

      if (response.ok) {
        setShowGradeModal(false);
        setSelectedStudent("");
        setAssignmentName("");
        setScore("");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error adding grade:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const semesters = [
    "all",
    "Fall 2024",
    "Spring 2025",
    "Summer 2025",
    "Fall 2025",
    "Spring 2026",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <h1 className="text-4xl font-bold mb-2">{course.code}</h1>
          <p className="text-xl opacity-90">{course.name}</p>
          <div className="mt-4 flex items-center gap-6 text-sm">
            <span className="flex items-center gap-2">
              <AcademicCapIcon className="w-5 h-5" />
              {course.credits} Credits
            </span>
            {course.semester && (
              <span className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                {course.semester}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <UserGroupIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold">{filteredEnrollments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <ChartBarIcon className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Class Average</p>
              <p className="text-2xl font-bold">
                {classAverage ? `${classAverage.toFixed(1)}%` : "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <AcademicCapIcon className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Grades</p>
              <p className="text-2xl font-bold">{initialGrades.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="max-w-7xl mx-auto mb-6 flex justify-between items-center">
        <div className="flex gap-4">
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {semesters.map((sem) => (
              <option key={sem} value={sem}>
                {sem === "all" ? "All Semesters" : sem}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowGradeModal(true)}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
        >
          Add Grade
        </button>
      </div>

      {/* Students Table */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Student Name</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-center">Grades Count</th>
                  <th className="px-6 py-4 text-center">Average Score</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {studentStats.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No students enrolled in this course
                    </td>
                  </tr>
                ) : (
                  studentStats.map((stat) => (
                    <tr
                      key={stat.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium">
                        {stat.student.full_name}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {stat.student.email}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {stat.gradeCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold">
                        {stat.avgScore ? `${stat.avgScore.toFixed(1)}%` : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedStudent(stat.student.id);
                            setShowGradeModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Add Grade
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Grade Modal */}
      {showGradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold">Add Grade</h2>
            </div>
            <form onSubmit={handleAddGrade} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Student</option>
                  {filteredEnrollments.map((enrollment) => (
                    <option
                      key={enrollment.student.id}
                      value={enrollment.student.id}
                    >
                      {enrollment.student.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Name
                </label>
                <input
                  type="text"
                  value={assignmentName}
                  onChange={(e) => setAssignmentName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Midterm Exam"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Score (%)
                </label>
                <input
                  type="number"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  required
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 85.5"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowGradeModal(false);
                    setSelectedStudent("");
                    setAssignmentName("");
                    setScore("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? "Adding..." : "Add Grade"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
