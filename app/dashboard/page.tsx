import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile to determine role and redirect to appropriate dashboard
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role || user.user_metadata?.role || 'student'

  if (role === 'student') {
    redirect('/dashboard/student')
  } else if (role === 'teacher') {
    redirect('/dashboard/teacher')
  } else if (role === 'tenured_professor') {
    redirect('/dashboard/professor')
  }

  // Fallback
  redirect('/dashboard/student')
}
