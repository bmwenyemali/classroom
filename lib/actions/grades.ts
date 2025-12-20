"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getGrades(studentId?: string, courseId?: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  let query = supabase
    .from("grades")
    .select(
      `
      *,
      course:courses(id, code, name, credits),
      student:profiles!grades_student_id_fkey(id, full_name, email),
      created_by_user:profiles!grades_created_by_fkey(id, full_name, email)
    `
    )
    .order("created_at", { ascending: false });

  if (studentId) {
    query = query.eq("student_id", studentId);
  }

  if (courseId) {
    query = query.eq("course_id", courseId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function getStudentGradeStats(studentId: string) {
  const supabase = await createClient();

  const { data: grades, error } = await supabase
    .from("grades")
    .select(
      `
      *,
      course:courses(id, code, name, credits)
    `
    )
    .eq("student_id", studentId);

  if (error) throw error;

  // Calculate statistics
  const totalGrades = grades?.length || 0;
  const averageScore =
    grades?.reduce((sum, g) => sum + (g.score / g.max_score) * 100, 0) /
      totalGrades || 0;

  // GPA calculation (4.0 scale)
  const gpa =
    grades?.reduce((sum, g) => {
      const percentage = (g.score / g.max_score) * 100;
      let gradePoint = 0;
      if (percentage >= 90) gradePoint = 4.0;
      else if (percentage >= 80) gradePoint = 3.0;
      else if (percentage >= 70) gradePoint = 2.0;
      else if (percentage >= 60) gradePoint = 1.0;
      return sum + gradePoint;
    }, 0) / totalGrades || 0;

  // Group by course
  const courseGrades = grades?.reduce((acc: any, grade) => {
    const courseId = grade.course_id;
    if (!acc[courseId]) {
      acc[courseId] = {
        course: grade.course,
        grades: [],
        total: 0,
        count: 0,
      };
    }
    acc[courseId].grades.push(grade);
    acc[courseId].total += (grade.score / grade.max_score) * 100;
    acc[courseId].count += 1;
    return acc;
  }, {});

  const courseAverages = Object.values(courseGrades || {}).map((cg: any) => ({
    ...cg.course,
    average: cg.total / cg.count,
    gradeCount: cg.count,
  }));

  return {
    totalGrades,
    averageScore: parseFloat(averageScore.toFixed(2)),
    gpa: parseFloat(gpa.toFixed(2)),
    courseAverages,
    recentGrades: grades?.slice(0, 5) || [],
  };
}

export async function createGrade(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const gradeData = {
    student_id: formData.get("student_id") as string,
    course_id: formData.get("course_id") as string,
    assignment_name: formData.get("assignment_name") as string,
    score: parseFloat(formData.get("score") as string),
    max_score: parseFloat(formData.get("max_score") as string),
    grade_type: formData.get("grade_type") as string,
    created_by: user.id,
  };

  const { data, error } = await supabase
    .from("grades")
    .insert([gradeData])
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/dashboard/teacher/grade-entry");
  revalidatePath("/dashboard/student/grades");
  revalidatePath("/dashboard/professor/all-grades");

  return data;
}

export async function updateGrade(id: string, formData: FormData) {
  const supabase = await createClient();

  const gradeData = {
    assignment_name: formData.get("assignment_name") as string,
    score: parseFloat(formData.get("score") as string),
    max_score: parseFloat(formData.get("max_score") as string),
    grade_type: formData.get("grade_type") as string,
  };

  const { data, error } = await supabase
    .from("grades")
    .update(gradeData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/dashboard/teacher/grade-entry");
  revalidatePath("/dashboard/student/grades");
  revalidatePath("/dashboard/professor/all-grades");

  return data;
}

export async function deleteGrade(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("grades").delete().eq("id", id);

  if (error) throw error;

  revalidatePath("/dashboard/teacher/grade-entry");
  revalidatePath("/dashboard/student/grades");
  revalidatePath("/dashboard/professor/all-grades");
}

export async function bulkCreateGrades(
  grades: Array<{
    student_id: string;
    course_id: string;
    assignment_name: string;
    score: number;
    max_score: number;
    grade_type: string;
  }>
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const gradesWithCreator = grades.map((g) => ({
    ...g,
    created_by: user.id,
  }));

  const { data, error } = await supabase
    .from("grades")
    .insert(gradesWithCreator)
    .select();

  if (error) throw error;

  revalidatePath("/dashboard/teacher/grade-entry");
  revalidatePath("/dashboard/student/grades");
  revalidatePath("/dashboard/professor/all-grades");

  return data;
}
