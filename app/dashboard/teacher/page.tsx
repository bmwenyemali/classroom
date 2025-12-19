import { createClient } from '@/lib/supabase/server'
import { BookOpenIcon, UserGroupIcon, AcademicCapIcon, ClockIcon } from '@heroicons/react/24/outline'

export default async function TeacherDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('teacher_id', user?.id)

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('*')
    .in('course_id', courses?.map(c => c.id) || [])

  const { data: grades } = await supabase
    .from('grades')
    .select('*')
    .eq('teacher_id', user?.id)

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Teacher Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">My Courses</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{courses?.length || 0}</p>
            </div>
            <BookOpenIcon className="h-12 w-12 text-blue-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Students</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{enrollments?.length || 0}</p>
            </div>
            <UserGroupIcon className="h-12 w-12 text-green-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Grades Entered</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{grades?.length || 0}</p>
            </div>
            <AcademicCapIcon className="h-12 w-12 text-purple-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">This Semester</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{courses?.length || 0}</p>
            </div>
            <ClockIcon className="h-12 w-12 text-orange-600 opacity-20" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/dashboard/courses" className="p-4 border rounded-lg hover:bg-gray-50 transition">
              <h3 className="font-semibold text-gray-900">Manage Courses</h3>
              <p className="text-sm text-gray-600 mt-1">View and edit your courses</p>
            </a>
            <a href="/dashboard/grade-entry" className="p-4 border rounded-lg hover:bg-gray-50 transition">
              <h3 className="font-semibold text-gray-900">Enter Grades</h3>
              <p className="text-sm text-gray-600 mt-1">Add or update student grades</p>
            </a>
            <a href="/dashboard/students" className="p-4 border rounded-lg hover:bg-gray-50 transition">
              <h3 className="font-semibold text-gray-900">View Students</h3>
              <p className="text-sm text-gray-600 mt-1">See enrolled students</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
