-- Migration: Restructure schema for new role-based workflow
-- 1. Add semester to courses (for filtering)
-- 2. Remove teacher_id from grades (redundant - use course -> teacher relationship)

-- Add semester column to courses
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS semester TEXT;

-- Drop the RLS policy that depends on teacher_id
DROP POLICY IF EXISTS "Teachers can manage grades for their courses" ON grades;

-- Drop teacher_id from grades (it's redundant)
ALTER TABLE grades 
DROP COLUMN IF EXISTS teacher_id;

-- Recreate the RLS policy using course.teacher_id instead
CREATE POLICY "Teachers can manage grades for their courses" ON grades
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM courses
    WHERE courses.id = grades.course_id
    AND courses.teacher_id = auth.uid()
  )
);

-- Update verification query
SELECT 
  'Courses with semester column' as check_item,
  COUNT(*) as count
FROM information_schema.columns
WHERE table_name = 'courses' AND column_name = 'semester'

UNION ALL

SELECT 
  'Grades WITHOUT teacher_id column',
  COUNT(*)
FROM information_schema.columns
WHERE table_name = 'grades' AND column_name = 'teacher_id';
