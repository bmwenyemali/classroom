"use server";

import { createClient } from "@/lib/supabase/server";

export async function getClassReport(courseId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Get course with enrollments and grades
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select(
      `
      *,
      teacher:profiles!courses_teacher_id_fkey(id, full_name, email),
      enrollments(
        id,
        student:profiles!enrollments_student_id_fkey(id, full_name, email),
        grades(id, assignment_name, score)
      )
    `
    )
    .eq("id", courseId)
    .single();

  if (courseError) throw courseError;

  // Calculate statistics for each student
  const studentStats = (course.enrollments || []).map((enrollment: any) => {
    const grades = enrollment.grades || [];
    const totalScore = grades.reduce((sum: number, g: any) => sum + g.score, 0);
    const averageScore = grades.length > 0 ? totalScore / grades.length : 0;

    // Calculate GPA (4.0 scale)
    const gpa =
      grades.length > 0
        ? grades.reduce((sum: number, g: any) => {
            const percentage = g.score;
            let gradePoint = 0;
            if (percentage >= 90) gradePoint = 4.0;
            else if (percentage >= 80) gradePoint = 3.0;
            else if (percentage >= 70) gradePoint = 2.0;
            else if (percentage >= 60) gradePoint = 1.0;
            return sum + gradePoint;
          }, 0) / grades.length
        : 0;

    // Determine status
    const status =
      averageScore >= 90
        ? "Excellent"
        : averageScore >= 80
        ? "Good"
        : averageScore >= 70
        ? "Average"
        : averageScore >= 60
        ? "Below Average"
        : "Failing";

    return {
      student: enrollment.student,
      totalGrades: grades.length,
      averageScore: parseFloat(averageScore.toFixed(2)),
      gpa: parseFloat(gpa.toFixed(2)),
      status,
      isPassing: averageScore >= 60,
    };
  });

  // Sort by average score descending
  studentStats.sort((a: any, b: any) => b.averageScore - a.averageScore);

  // Calculate class statistics
  const classAverage =
    studentStats.length > 0
      ? studentStats.reduce((sum: number, s: any) => sum + s.averageScore, 0) /
        studentStats.length
      : 0;

  const classGPA =
    studentStats.length > 0
      ? studentStats.reduce((sum: number, s: any) => sum + s.gpa, 0) /
        studentStats.length
      : 0;

  const passingCount = studentStats.filter((s: any) => s.isPassing).length;
  const failingCount = studentStats.filter((s: any) => !s.isPassing).length;

  return {
    course: {
      id: course.id,
      code: course.code,
      name: course.name,
      teacher: course.teacher,
      totalStudents: studentStats.length,
    },
    classStats: {
      average: parseFloat(classAverage.toFixed(2)),
      gpa: parseFloat(classGPA.toFixed(2)),
      passingCount,
      failingCount,
      passRate:
        studentStats.length > 0
          ? parseFloat(((passingCount / studentStats.length) * 100).toFixed(2))
          : 0,
    },
    students: studentStats,
    topPerformer: studentStats[0] || null,
    lowestPerformer: studentStats[studentStats.length - 1] || null,
  };
}

export async function getAllClassReports() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // Only professors can see all class reports
  if (profile?.role !== "tenured_professor") {
    throw new Error("Unauthorized");
  }

  const { data: courses, error } = await supabase
    .from("courses")
    .select(
      `
      *,
      teacher:profiles!courses_teacher_id_fkey(id, full_name, email),
      enrollments(
        id,
        grades(score)
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Calculate basic stats for each course
  const courseReports = (courses || []).map((course: any) => {
    const allGrades = course.enrollments.flatMap(
      (e: any) => e.grades.map((g: any) => g.score) || []
    );

    const averageScore =
      allGrades.length > 0
        ? allGrades.reduce((sum: number, score: number) => sum + score, 0) /
          allGrades.length
        : 0;

    const passingGrades = allGrades.filter(
      (score: number) => score >= 60
    ).length;
    const passRate =
      allGrades.length > 0
        ? parseFloat(((passingGrades / allGrades.length) * 100).toFixed(2))
        : 0;

    return {
      id: course.id,
      code: course.code,
      name: course.name,
      teacher: course.teacher,
      totalStudents: course.enrollments.length,
      totalGrades: allGrades.length,
      averageScore: parseFloat(averageScore.toFixed(2)),
      passRate,
    };
  });

  return courseReports;
}
