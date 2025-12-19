import { createClient } from '@/lib/supabase/server'
import { BookOpenIcon, UserGroupIcon, AcademicCapIcon, ChartBarIcon } from '@heroicons/react/24/outline'

export default async function ProfessorDashboard() {
  const supabase = await createClient()

  const { data: courses } = await supabase.from('courses').select('*')
  const { data: enrollments } = await supabase.from('enrollments').select('*')
  const { data: grades } = await supabase.from('grades').select('*')
  const { data: students } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'student')

  const avgGrade = grades?.length 
    ? (grades.reduce((sum, g) => sum + g.score, 0) / grades.length).toFixed(1)
    : 'N/A'

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Professor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Courses</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{courses?.length || 0}</p>
            </div>
            <BookOpenIcon className="h-12 w-12 text-blue-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Students</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{students?.length || 0}</p>
            </div>
            <UserGroupIcon className="h-12 w-12 text-green-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Enrollments</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{enrollments?.length || 0}</p>
            </div>
            <AcademicCapIcon className="h-12 w-12 text-purple-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">System Average</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{avgGrade}</p>
            </div>
            <ChartBarIcon className="h-12 w-12 text-orange-600 opacity-20" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Administrative Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/dashboard/all-classes" className="p-4 border rounded-lg hover:bg-gray-50 transition">
              <h3 className="font-semibold text-gray-900">All Classes</h3>
              <p className="text-sm text-gray-600 mt-1">View all courses in the system</p>
            </a>
            <a href="/dashboard/all-grades" className="p-4 border rounded-lg hover:bg-gray-50 transition">
              <h3 className="font-semibold text-gray-900">All Grades</h3>
              <p className="text-sm text-gray-600 mt-1">Comprehensive grade reports</p>
            </a>
            <a href="/dashboard/analytics" className="p-4 border rounded-lg hover:bg-gray-50 transition">
              <h3 className="font-semibold text-gray-900">Analytics</h3>
              <p className="text-sm text-gray-600 mt-1">Performance metrics and insights</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
