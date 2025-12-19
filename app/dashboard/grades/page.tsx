import { createClient } from '@/lib/supabase/server'

export default async function GradesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: grades } = await supabase
    .from('grades')
    .select('*, courses(name, code)')
    .eq('student_id', user?.id)
    .order('created_at', { ascending: false })

  // Group grades by course
  const gradesByCourse = grades?.reduce((acc: any, grade) => {
    const courseId = grade.course_id
    if (!acc[courseId]) {
      acc[courseId] = {
        course: grade.courses,
        grades: [],
        average: 0
      }
    }
    acc[courseId].grades.push(grade)
    return acc
  }, {})

  // Calculate averages
  if (gradesByCourse) {
    Object.keys(gradesByCourse).forEach(courseId => {
      const courseGrades = gradesByCourse[courseId].grades
      const avg = courseGrades.reduce((sum: number, g: any) => sum + g.score, 0) / courseGrades.length
      gradesByCourse[courseId].average = avg.toFixed(1)
    })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Grades</h1>

      {gradesByCourse && Object.keys(gradesByCourse).length > 0 ? (
        <div className="space-y-6">
          {Object.values(gradesByCourse).map((courseData: any, index) => (
            <div key={index} className="bg-white rounded-lg shadow">
              <div className="p-6 border-b bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {courseData.course?.name || 'Unknown Course'}
                    </h2>
                    <p className="text-gray-600">{courseData.course?.code || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Average</p>
                    <p className="text-3xl font-bold text-blue-600">{courseData.average}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 text-sm border-b">
                      <th className="pb-3">Assignment</th>
                      <th className="pb-3">Score</th>
                      <th className="pb-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseData.grades.map((grade: any) => (
                      <tr key={grade.id} className="border-b last:border-0">
                        <td className="py-3">{grade.assignment_name}</td>
                        <td className="py-3">
                          <span className={`font-semibold ${
                            grade.score >= 90 ? 'text-green-600' :
                            grade.score >= 80 ? 'text-blue-600' :
                            grade.score >= 70 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {grade.score}
                          </span>
                        </td>
                        <td className="py-3 text-gray-500">
                          {new Date(grade.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">No grades available yet.</p>
        </div>
      )}
    </div>
  )
}
