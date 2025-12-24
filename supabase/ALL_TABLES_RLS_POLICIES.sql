-- ============================================
-- COURSES TABLE - RLS POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view courses" ON courses;
DROP POLICY IF EXISTS "Professors can create courses" ON courses;
DROP POLICY IF EXISTS "Professors can update courses" ON courses;
DROP POLICY IF EXISTS "Professors can delete courses" ON courses;
DROP POLICY IF EXISTS "Teachers can view their own courses" ON courses;
DROP POLICY IF EXISTS "Professors can manage all courses" ON courses;
DROP POLICY IF EXISTS "Teachers can manage their own courses" ON courses;

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- POLICY 1: Everyone can view all courses
CREATE POLICY "Anyone can view courses"
ON courses FOR SELECT
USING (true);

-- POLICY 2: Professors can create courses
CREATE POLICY "Professors can create courses"
ON courses FOR INSERT
WITH CHECK (public.get_my_role() = 'tenured_professor');

-- POLICY 3: Professors can update any course
CREATE POLICY "Professors can update courses"
ON courses FOR UPDATE
USING (public.get_my_role() = 'tenured_professor')
WITH CHECK (public.get_my_role() = 'tenured_professor');

-- POLICY 4: Professors can delete any course
CREATE POLICY "Professors can delete courses"
ON courses FOR DELETE
USING (public.get_my_role() = 'tenured_professor');

-- POLICY 5: Teachers can update their assigned courses (optional - if needed)
CREATE POLICY "Teachers can update their courses"
ON courses FOR UPDATE
USING (teacher_id = auth.uid())
WITH CHECK (teacher_id = auth.uid());

-- ============================================
-- ENROLLMENTS TABLE - RLS POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Students can view their own enrollments" ON enrollments;
DROP POLICY IF EXISTS "Professors can manage all enrollments" ON enrollments;
DROP POLICY IF EXISTS "Teachers can view enrollments in their courses" ON enrollments;
DROP POLICY IF EXISTS "Professors can view all enrollments" ON enrollments;
DROP POLICY IF EXISTS "Teachers can enroll students in their courses" ON enrollments;
DROP POLICY IF EXISTS "Teachers can unenroll students from their courses" ON enrollments;
DROP POLICY IF EXISTS "Teachers can view enrollments for their courses" ON enrollments;

-- Enable RLS
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- POLICY 1: Students can view their own enrollments
CREATE POLICY "Students can view their enrollments"
ON enrollments FOR SELECT
USING (student_id = auth.uid());

-- POLICY 2: Professors can view all enrollments
CREATE POLICY "Professors can view all enrollments"
ON enrollments FOR SELECT
USING (public.get_my_role() = 'tenured_professor');

-- POLICY 3: Teachers can view enrollments in their courses
CREATE POLICY "Teachers can view course enrollments"
ON enrollments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM courses
    WHERE courses.id = enrollments.course_id
    AND courses.teacher_id = auth.uid()
  )
);

-- POLICY 4: Professors can create enrollments
CREATE POLICY "Professors can create enrollments"
ON enrollments FOR INSERT
WITH CHECK (public.get_my_role() = 'tenured_professor');

-- POLICY 5: Professors can delete enrollments
CREATE POLICY "Professors can delete enrollments"
ON enrollments FOR DELETE
USING (public.get_my_role() = 'tenured_professor');

-- ============================================
-- GRADES TABLE - RLS POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Students can view their own grades" ON grades;
DROP POLICY IF EXISTS "Teachers can manage grades for their courses" ON grades;
DROP POLICY IF EXISTS "Professors can manage all grades" ON grades;
DROP POLICY IF EXISTS "Professors can view all grades" ON grades;

-- Enable RLS
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;

-- POLICY 1: Students can view their own grades
CREATE POLICY "Students can view their grades"
ON grades FOR SELECT
USING (student_id = auth.uid());

-- POLICY 2: Professors can view all grades
CREATE POLICY "Professors can view all grades"
ON grades FOR SELECT
USING (public.get_my_role() = 'tenured_professor');

-- POLICY 3: Teachers can view grades for their courses
CREATE POLICY "Teachers can view course grades"
ON grades FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM courses
    WHERE courses.id = grades.course_id
    AND courses.teacher_id = auth.uid()
  )
);

-- POLICY 4: Professors can create grades
CREATE POLICY "Professors can create grades"
ON grades FOR INSERT
WITH CHECK (public.get_my_role() = 'tenured_professor');

-- POLICY 5: Teachers can create grades for their courses
CREATE POLICY "Teachers can create grades"
ON grades FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM courses
    WHERE courses.id = grades.course_id
    AND courses.teacher_id = auth.uid()
  )
);

-- POLICY 6: Professors can update any grade
CREATE POLICY "Professors can update grades"
ON grades FOR UPDATE
USING (public.get_my_role() = 'tenured_professor')
WITH CHECK (public.get_my_role() = 'tenured_professor');

-- POLICY 7: Teachers can update grades for their courses
CREATE POLICY "Teachers can update course grades"
ON grades FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM courses
    WHERE courses.id = grades.course_id
    AND courses.teacher_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM courses
    WHERE courses.id = grades.course_id
    AND courses.teacher_id = auth.uid()
  )
);

-- POLICY 8: Professors can delete grades
CREATE POLICY "Professors can delete grades"
ON grades FOR DELETE
USING (public.get_my_role() = 'tenured_professor');

-- POLICY 9: Teachers can delete grades for their courses
CREATE POLICY "Teachers can delete course grades"
ON grades FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM courses
    WHERE courses.id = grades.course_id
    AND courses.teacher_id = auth.uid()
  )
);

-- ============================================
-- EVENTS TABLE - RLS POLICIES
-- ============================================
-- NOTE: Events table only has user_id (personal events)
-- No course_id column exists in the current schema
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Students can view events" ON events;
DROP POLICY IF EXISTS "Teachers can manage events for their courses" ON events;
DROP POLICY IF EXISTS "Professors can manage all events" ON events;
DROP POLICY IF EXISTS "Users can manage their own events" ON events;
DROP POLICY IF EXISTS "Users can view their events" ON events;
DROP POLICY IF EXISTS "Students can view course events" ON events;
DROP POLICY IF EXISTS "Teachers can view course events" ON events;
DROP POLICY IF EXISTS "Professors can view all events" ON events;
DROP POLICY IF EXISTS "Users can create events" ON events;
DROP POLICY IF EXISTS "Teachers can create course events" ON events;
DROP POLICY IF EXISTS "Professors can create events" ON events;
DROP POLICY IF EXISTS "Users can update their events" ON events;
DROP POLICY IF EXISTS "Teachers can update course events" ON events;
DROP POLICY IF EXISTS "Professors can update events" ON events;
DROP POLICY IF EXISTS "Users can delete their events" ON events;
DROP POLICY IF EXISTS "Teachers can delete course events" ON events;
DROP POLICY IF EXISTS "Professors can delete events" ON events;

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- POLICY 1: Users can view their own events
CREATE POLICY "Users can view their events"
ON events FOR SELECT
USING (user_id = auth.uid());

-- POLICY 2: Professors can view all events
CREATE POLICY "Professors can view all events"
ON events FOR SELECT
USING (public.get_my_role() = 'tenured_professor');

-- POLICY 3: Users can create their own events
CREATE POLICY "Users can create their events"
ON events FOR INSERT
WITH CHECK (user_id = auth.uid());

-- POLICY 4: Professors can create events for any user
CREATE POLICY "Professors can create events"
ON events FOR INSERT
WITH CHECK (public.get_my_role() = 'tenured_professor');

-- POLICY 5: Users can update their own events
CREATE POLICY "Users can update their events"
ON events FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- POLICY 6: Professors can update any event
CREATE POLICY "Professors can update events"
ON events FOR UPDATE
USING (public.get_my_role() = 'tenured_professor')
WITH CHECK (public.get_my_role() = 'tenured_professor');

-- POLICY 7: Users can delete their own events
CREATE POLICY "Users can delete their events"
ON events FOR DELETE
USING (user_id = auth.uid());

-- POLICY 8: Professors can delete any event
CREATE POLICY "Professors can delete events"
ON events FOR DELETE
USING (public.get_my_role() = 'tenured_professor');

-- ============================================
-- VERIFICATION
-- ============================================
-- Run these queries to verify all policies:

-- 1. Check courses policies:
-- SELECT policyname, cmd FROM pg_policies WHERE tablename = 'courses' ORDER BY policyname;

-- 2. Check enrollments policies:
-- SELECT policyname, cmd FROM pg_policies WHERE tablename = 'enrollments' ORDER BY policyname;

-- 3. Check grades policies:
-- SELECT policyname, cmd FROM pg_policies WHERE tablename = 'grades' ORDER BY policyname;

-- 4. Check events policies:
-- SELECT policyname, cmd FROM pg_policies WHERE tablename = 'events' ORDER BY policyname;
-- ============================================
