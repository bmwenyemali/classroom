-- Fix RLS policies to allow teachers to manage enrollments and view students
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. DROP EXISTING POLICIES (if any conflicts)
-- ============================================

DROP POLICY IF EXISTS "Teachers can view students" ON profiles;
DROP POLICY IF EXISTS "Teachers can view other teachers" ON profiles;
DROP POLICY IF EXISTS "Teachers can enroll students in their courses" ON enrollments;
DROP POLICY IF EXISTS "Teachers can unenroll students from their courses" ON enrollments;
DROP POLICY IF EXISTS "Professors can manage all enrollments" ON enrollments;

-- ============================================
-- 2. CREATE NEW POLICIES
-- ============================================

-- Allow teachers to view all student profiles (to enroll them)
CREATE POLICY "Teachers can view students" ON profiles
  FOR SELECT USING (
    role = 'student' OR id = auth.uid()
  );

-- Allow teachers to view other teachers (for display purposes)
CREATE POLICY "Teachers can view other teachers" ON profiles
  FOR SELECT USING (
    role IN ('teacher', 'tenured_professor')
  );

-- ============================================
-- 3. FIX ENROLLMENTS POLICIES - Teachers need to INSERT/DELETE
-- ============================================

-- Allow teachers to create enrollments for their courses
CREATE POLICY "Teachers can enroll students in their courses" ON enrollments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE id = course_id AND teacher_id = auth.uid()
    )
  );

-- Allow teachers to delete enrollments from their courses
CREATE POLICY "Teachers can unenroll students from their courses" ON enrollments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE id = course_id AND teacher_id = auth.uid()
    )
  );

-- Allow professors to manage all enrollments
CREATE POLICY "Professors can manage all enrollments" ON enrollments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'tenured_professor'
    )
  );

-- ============================================
-- 4. FIX GRADES POLICIES - Ensure teachers can create grades
-- ============================================

-- Already exists but let's ensure it covers INSERT
-- Teachers can manage grades for their courses is FOR ALL so it's fine

-- ============================================
-- 5. VERIFICATION
-- ============================================

-- Check policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename IN ('profiles', 'enrollments', 'grades', 'courses')
ORDER BY tablename, policyname;
