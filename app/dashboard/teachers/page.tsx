import { createClient } from '@/lib/supabase/server'
import { EnvelopeIcon } from '@heroicons/react/24/outline'

export default async function TeachersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get enrolled courses with teacher info
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('courses(*, profiles(full_name, email))')
    .eq('student_id', user?.id)

  // Extract unique teachers
  const teachers = new Map()
  enrollments?.forEach((enrollment: any) => {
    const teacherId = enrollment.courses?.teacher_id
    if (teacherId && !teachers.has(teacherId)) {
      teachers.set(teacherId, {
        ...enrollment.courses?.profiles,
        courses: []
      })
    }
    if (teacherId) {
      teachers.get(teacherId)?.courses.push(enrollment.courses)
    }
  })

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Teachers</h1>

      {teachers.size > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from(teachers.values()).map((teacher: any, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {teacher.full_name || 'Unknown Teacher'}
              </h3>
              <div className="flex items-center text-gray-600 mb-4">
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                <a href={`mailto:${teacher.email}`} className="hover:text-blue-600">
                  {teacher.email}
                </a>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Courses:</p>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {teacher.courses?.map((course: any, idx: number) => (
                    <li key={idx}>{course.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">No teachers found.</p>
        </div>
      )}
    </div>
  )
}
