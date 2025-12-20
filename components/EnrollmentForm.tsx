'use client'

import { useState } from 'react'
import { enrollStudent, bulkEnrollStudents } from '@/lib/actions/enrollments'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface EnrollmentFormProps {
  students: any[]
  courses: any[]
  defaultCourseId?: string
  onClose: () => void
  onSuccess: () => void
}

export default function EnrollmentForm({ 
  students, 
  courses, 
  defaultCourseId,
  onClose, 
  onSuccess 
}: EnrollmentFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bulkMode, setBulkMode] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      const courseId = formData.get('course_id') as string

      if (bulkMode) {
        if (selectedStudents.length === 0) {
          throw new Error('Please select at least one student')
        }
        await bulkEnrollStudents(courseId, selectedStudents)
      } else {
        const studentId = formData.get('student_id') as string
        await enrollStudent(courseId, studentId)
      }
      
      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const toggleStudent = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            Enroll Students
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

          <div>
            <label htmlFor="course_id" className="block text-sm font-medium text-gray-700 mb-2">
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

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setBulkMode(false)}
              className={`px-4 py-2 rounded-lg ${
                !bulkMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Single Student
            </button>
            <button
              type="button"
              onClick={() => setBulkMode(true)}
              className={`px-4 py-2 rounded-lg ${
                bulkMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Multiple Students
            </button>
          </div>

          {!bulkMode ? (
            <div>
              <label htmlFor="student_id" className="block text-sm font-medium text-gray-700 mb-2">
                Student *
              </label>
              <select
                id="student_id"
                name="student_id"
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
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Students * ({selectedStudents.length} selected)
              </label>
              <div className="border border-gray-300 rounded-lg max-h-64 overflow-y-auto">
                {students?.map((student) => (
                  <label
                    key={student.id}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => toggleStudent(student.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm">
                      {student.full_name} <span className="text-gray-500">({student.email})</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

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
              {loading ? 'Enrolling...' : `Enroll ${bulkMode ? 'Students' : 'Student'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
