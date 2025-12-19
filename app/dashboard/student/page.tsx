import { createClient } from '@/lib/supabase/server'
import { BookOpenIcon, AcademicCapIcon, UserGroupIcon, CalendarIcon } from '@heroicons/react/24/outline'

export default async function StudentDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch student data
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('*, courses(*)')
    .eq('student_id', user?.id)

  const { data: grades } = await supabase
    .from('grades')
    .select('*')
    .eq('student_id', user?.id)

  const classCount = enrollments?.length || 0
  const avgGrade = grades?.length 
    ? (grades.reduce((sum, g) => sum + g.score, 0) / grades.length).toFixed(1)
    : 'N/A'

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Student Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Enrolled Classes</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{classCount}</p>
            </div>
            <BookOpenIcon className="h-12 w-12 text-blue-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Average Grade</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{avgGrade}</p>
            </div>
            <AcademicCapIcon className="h-12 w-12 text-green-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Grades</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{grades?.length || 0}</p>
            </div>
            <UserGroupIcon className="h-12 w-12 text-purple-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Upcoming Events</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">0</p>
            </div>
            <CalendarIcon className="h-12 w-12 text-orange-600 opacity-20" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <p className="text-gray-500">No recent activity to display.</p>
        </div>
      </div>
    </div>
  )
}
