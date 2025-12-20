"use server";

import { createClient } from "@/lib/supabase/server";

export async function getSystemAnalytics() {
  const supabase = await createClient();

  // Total counts
  const [
    { count: totalStudents },
    { count: totalTeachers },
    { count: totalCourses },
    { count: totalEnrollments },
    { count: totalGrades },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "student"),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .in("role", ["teacher", "tenured_professor"]),
    supabase.from("courses").select("*", { count: "exact", head: true }),
    supabase.from("enrollments").select("*", { count: "exact", head: true }),
    supabase.from("grades").select("*", { count: "exact", head: true }),
  ]);

  return {
    totalStudents: totalStudents || 0,
    totalTeachers: totalTeachers || 0,
    totalCourses: totalCourses || 0,
    totalEnrollments: totalEnrollments || 0,
    totalGrades: totalGrades || 0,
  };
}

export async function getGradeDistribution() {
  const supabase = await createClient();

  const { data: grades } = await supabase
    .from("grades")
    .select("score, max_score");

  if (!grades) return [];

  const distribution = {
    "A (90-100%)": 0,
    "B (80-89%)": 0,
    "C (70-79%)": 0,
    "D (60-69%)": 0,
    "F (0-59%)": 0,
  };

  grades.forEach((grade) => {
    const percentage = (grade.score / grade.max_score) * 100;
    if (percentage >= 90) distribution["A (90-100%)"]++;
    else if (percentage >= 80) distribution["B (80-89%)"]++;
    else if (percentage >= 70) distribution["C (70-79%)"]++;
    else if (percentage >= 60) distribution["D (60-69%)"]++;
    else distribution["F (0-59%)"]++;
  });

  return Object.entries(distribution).map(([grade, count]) => ({
    grade,
    count,
  }));
}

export async function getTopStudents(limit: number = 10) {
  const supabase = await createClient();

  const { data: grades } = await supabase.from("grades").select(`
      student_id,
      score,
      max_score,
      student:profiles!grades_student_id_fkey(id, full_name, email)
    `);

  if (!grades) return [];

  // Calculate average for each student
  const studentAverages = grades.reduce((acc: any, grade) => {
    const studentId = grade.student_id;
    if (!acc[studentId]) {
      acc[studentId] = {
        student: grade.student,
        total: 0,
        count: 0,
        scores: [],
      };
    }
    const percentage = (grade.score / grade.max_score) * 100;
    acc[studentId].total += percentage;
    acc[studentId].count += 1;
    acc[studentId].scores.push(percentage);
    return acc;
  }, {});

  const topStudents = Object.values(studentAverages)
    .map((s: any) => ({
      ...s.student,
      average: parseFloat((s.total / s.count).toFixed(2)),
      gradeCount: s.count,
      highest: Math.max(...s.scores),
      lowest: Math.min(...s.scores),
    }))
    .sort((a: any, b: any) => b.average - a.average)
    .slice(0, limit);

  return topStudents;
}

export async function getCoursePerformance() {
  const supabase = await createClient();

  const { data: grades } = await supabase.from("grades").select(`
      course_id,
      score,
      max_score,
      course:courses(id, code, name)
    `);

  if (!grades) return [];

  // Calculate average for each course
  const courseAverages = grades.reduce((acc: any, grade) => {
    const courseId = grade.course_id;
    if (!acc[courseId]) {
      acc[courseId] = {
        course: grade.course,
        total: 0,
        count: 0,
        scores: [],
      };
    }
    const percentage = (grade.score / grade.max_score) * 100;
    acc[courseId].total += percentage;
    acc[courseId].count += 1;
    acc[courseId].scores.push(percentage);
    return acc;
  }, {});

  return Object.values(courseAverages)
    .map((c: any) => ({
      ...c.course,
      average: parseFloat((c.total / c.count).toFixed(2)),
      studentCount: c.count,
      highest: Math.max(...c.scores),
      lowest: Math.min(...c.scores),
    }))
    .sort((a: any, b: any) => b.average - a.average);
}

export async function getTeacherPerformance() {
  const supabase = await createClient();

  const { data: courses } = await supabase.from("courses").select(`
      teacher_id,
      id,
      teacher:profiles!courses_teacher_id_fkey(id, full_name, email)
    `);

  if (!courses) return [];

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("course_id");

  const { data: grades } = await supabase
    .from("grades")
    .select("course_id, score, max_score");

  // Group by teacher
  const teacherStats = courses.reduce((acc: any, course) => {
    const teacherId = course.teacher_id;
    if (!acc[teacherId]) {
      acc[teacherId] = {
        teacher: course.teacher,
        courseCount: 0,
        enrollmentCount: 0,
        grades: [],
      };
    }
    acc[teacherId].courseCount += 1;

    // Count enrollments for this course
    const courseEnrollments =
      enrollments?.filter((e) => e.course_id === course.id).length || 0;
    acc[teacherId].enrollmentCount += courseEnrollments;

    // Get grades for this course
    const courseGrades = grades?.filter((g) => g.course_id === course.id) || [];
    acc[teacherId].grades.push(...courseGrades);

    return acc;
  }, {});

  return Object.values(teacherStats)
    .map((t: any) => {
      const avgGrade =
        t.grades.length > 0
          ? t.grades.reduce(
              (sum: number, g: any) => sum + (g.score / g.max_score) * 100,
              0
            ) / t.grades.length
          : 0;

      return {
        ...t.teacher,
        courseCount: t.courseCount,
        enrollmentCount: t.enrollmentCount,
        averageGrade: parseFloat(avgGrade.toFixed(2)),
        totalGrades: t.grades.length,
      };
    })
    .sort((a: any, b: any) => b.enrollmentCount - a.enrollmentCount);
}

export async function getEnrollmentTrends(months: number = 6) {
  const supabase = await createClient();

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("enrolled_at")
    .gte("enrolled_at", startDate.toISOString())
    .order("enrolled_at", { ascending: true });

  if (!enrollments) return [];

  // Group by month
  const monthlyData = enrollments.reduce((acc: any, enrollment) => {
    const date = new Date(enrollment.enrolled_at);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthKey, count: 0 };
    }
    acc[monthKey].count += 1;
    return acc;
  }, {});

  return Object.values(monthlyData).sort((a: any, b: any) =>
    a.month.localeCompare(b.month)
  );
}

export async function getRecentActivity(limit: number = 20) {
  const supabase = await createClient();

  const [
    { data: recentGrades },
    { data: recentEnrollments },
    { data: recentEvents },
  ] = await Promise.all([
    supabase
      .from("grades")
      .select(
        `
        created_at,
        assignment_name,
        score,
        max_score,
        student:profiles!grades_student_id_fkey(full_name),
        course:courses(code, name)
      `
      )
      .order("created_at", { ascending: false })
      .limit(limit),

    supabase
      .from("enrollments")
      .select(
        `
        enrolled_at,
        student:profiles!enrollments_student_id_fkey(full_name),
        course:courses(code, name)
      `
      )
      .order("enrolled_at", { ascending: false })
      .limit(limit),

    supabase
      .from("events")
      .select(
        `
        created_at,
        title,
        event_type,
        course:courses(code, name)
      `
      )
      .order("created_at", { ascending: false })
      .limit(limit),
  ]);

  const activities = [
    ...(recentGrades || []).map((g: any) => ({
      type: "grade",
      timestamp: g.created_at,
      description: `${g.student?.full_name} received ${g.score}/${g.max_score} on ${g.assignment_name} in ${g.course?.code}`,
    })),
    ...(recentEnrollments || []).map((e: any) => ({
      type: "enrollment",
      timestamp: e.enrolled_at,
      description: `${e.student?.full_name} enrolled in ${e.course?.code} - ${e.course?.name}`,
    })),
    ...(recentEvents || []).map((e: any) => ({
      type: "event",
      timestamp: e.created_at,
      description: `${e.event_type}: ${e.title}${
        e.course ? ` (${e.course.code})` : ""
      }`,
    })),
  ];

  return activities
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, limit);
}
