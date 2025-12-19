import { createClient } from '@/lib/supabase/server'

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const { data: grades } = await supabase.from('grades').select('*')
  const { data: courses } = await supabase.from('courses').select('*')
  const { data: students } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'student')

  // Calculate statistics
  const totalGrades = grades?.length || 0
  const avgGrade = grades?.length 
    ? (grades.reduce((sum, g) => sum + g.score, 0) / grades.length).toFixed(1)
    : '0'

  const gradeRanges = {
    A: grades?.filter(g => g.score >= 90).length || 0,
    B: grades?.filter(g => g.score >= 80 && g.score < 90).length || 0,
    C: grades?.filter(g => g.score >= 70 && g.score < 80).length || 0,
    D: grades?.filter(g => g.score >= 60 && g.score < 70).length || 0,
    F: grades?.filter(g => g.score < 60).length || 0,
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Courses</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{courses?.length || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{students?.length || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Average Grade</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">{avgGrade}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Grade Distribution</h2>
        <div className="space-y-4">
          {Object.entries(gradeRanges).map(([grade, count]) => {
            const percentage = totalGrades > 0 ? ((count / totalGrades) * 100).toFixed(1) : '0'
            return (
              <div key={grade}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {grade} {grade === 'A' && '(90-100)'} {grade === 'B' && '(80-89)'} 
                    {grade === 'C' && '(70-79)'} {grade === 'D' && '(60-69)'} {grade === 'F' && '(< 60)'}
                  </span>
                  <span className="text-sm text-gray-500">{count} ({percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      grade === 'A' ? 'bg-green-600' :
                      grade === 'B' ? 'bg-blue-600' :
                      grade === 'C' ? 'bg-yellow-600' :
                      grade === 'D' ? 'bg-orange-600' :
                      'bg-red-600'
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
