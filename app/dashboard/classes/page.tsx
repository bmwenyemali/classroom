import { createClient } from '@/lib/supabase/server'

export default async function ClassesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('*, courses(*)')
    .eq('student_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Classes</h1>

      {enrollments && enrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => (
            <div key={enrollment.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {enrollment.courses?.name || 'Untitled Course'}
              </h3>
              <p className="text-gray-600 mb-4">
                {enrollment.courses?.code || 'N/A'}
              </p>
              <p className="text-sm text-gray-500">
                {enrollment.courses?.description || 'No description available.'}
              </p>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Enrolled: {new Date(enrollment.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">You are not enrolled in any classes yet.</p>
        </div>
      )}
    </div>
  )
}
