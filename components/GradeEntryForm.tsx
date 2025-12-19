"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GradeEntryForm({
  courses,
  teacherId,
}: {
  courses: any[];
  teacherId?: string;
}) {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [assignmentName, setAssignmentName] = useState("");
  const [score, setScore] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (selectedCourse) {
      fetchStudents();
    }
  }, [selectedCourse]);

  const fetchStudents = async () => {
    const { data } = await supabase
      .from("enrollments")
      .select("*, profiles(id, full_name)")
      .eq("course_id", selectedCourse);

    setStudents(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!teacherId) {
      setMessage("Teacher ID is required");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("grades").insert({
      student_id: selectedStudent,
      course_id: selectedCourse,
      teacher_id: teacherId,
      assignment_name: assignmentName,
      score: parseFloat(score),
    });

    if (error) {
      setMessage("Error adding grade");
    } else {
      setMessage("Grade added successfully!");
      setAssignmentName("");
      setScore("");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.includes("Error")
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <div>
        <label
          htmlFor="course"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Course
        </label>
        <select
          id="course"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name} ({course.code})
            </option>
          ))}
        </select>
      </div>

      {selectedCourse && (
        <>
          <div>
            <label
              htmlFor="student"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Student
            </label>
            <select
              id="student"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a student</option>
              {students.map((enrollment) => (
                <option key={enrollment.id} value={enrollment.profiles.id}>
                  {enrollment.profiles.full_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="assignment"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Assignment Name
            </label>
            <input
              id="assignment"
              type="text"
              value={assignmentName}
              onChange={(e) => setAssignmentName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label
              htmlFor="score"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Score (0-100)
            </label>
            <input
              id="score"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Adding grade..." : "Add Grade"}
          </button>
        </>
      )}
    </form>
  );
}
