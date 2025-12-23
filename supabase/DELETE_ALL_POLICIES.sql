-- ============================================
-- DELETE ALL RLS POLICIES
-- ============================================
-- WARNING: This will remove all Row Level Security policies
-- Run this to start fresh and learn step by step
-- ============================================

-- Drop all policies from profiles table
DROP POLICY IF EXISTS "Teachers can view other teachers" ON profiles;
DROP POLICY IF EXISTS "Teachers can view students" ON profiles;

-- Drop all policies from courses table
DROP POLICY IF EXISTS "Professors can manage all courses" ON courses;
DROP POLICY IF EXISTS "Teachers can manage their own courses" ON courses;

-- Drop all policies from enrollments table
DROP POLICY IF EXISTS "Professors can view all enrollments" ON enrollments;
DROP POLICY IF EXISTS "Teachers can enroll students in their courses" ON enrollments;
DROP POLICY IF EXISTS "Teachers can unenroll students from their courses" ON enrollments;
DROP POLICY IF EXISTS "Teachers can view enrollments for their courses" ON enrollments;

-- Drop all policies from grades table
DROP POLICY IF EXISTS "Professors can view all grades" ON grades;

-- Drop all policies from events table
DROP POLICY IF EXISTS "Users can manage their own events" ON events;

-- ============================================
-- VERIFICATION
-- ============================================
-- Run this to check if all policies are deleted:
-- SELECT schemaname, tablename, policyname 
-- FROM pg_policies 
-- WHERE schemaname = 'public';
-- Should return 0 rows
-- ============================================
