import { createClient } from '@/lib/supabase/server'
import GradeEntryForm from '@/components/GradeEntryForm'

export default async function GradeEntryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get teacher's courses
  const { data: courses } = await supabase
    .from('courses')
    .select('id, name, code')
    .eq('teacher_id', user?.id)

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Grade Entry</h1>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <GradeEntryForm courses={courses || []} teacherId={user?.id} />
      </div>
    </div>
  )
}
