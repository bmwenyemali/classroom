-- ALL-IN-ONE SETUP SCRIPT
-- Run this ONCE in Supabase SQL Editor to set up everything
-- This combines seed data + RLS policy fixes

-- ============================================
-- PART 1: SEED DATA (from 003_seed_with_real_accounts.sql)
-- ============================================

-- Create courses for teacher
INSERT INTO courses (teacher_id, code, name, description, credits) 
SELECT 
  (SELECT id FROM profiles WHERE email = 'carinelutonde@gmail.com'),
  code,
  name,
  description,
  credits
FROM (
  VALUES
    ('CS101', 'Introduction to Computer Science', 'Learn the fundamentals of programming and computer science concepts', 3),
    ('CS201', 'Data Structures and Algorithms', 'Advanced programming with data structures', 4),
    ('MATH101', 'Calculus I', 'Introduction to differential and integral calculus', 4),
    ('ENG101', 'English Composition', 'Develop writing and critical thinking skills', 3),
    ('PHYS101', 'Physics I', 'Mechanics, heat, and sound with laboratory', 4)
) AS course_data(code, name, description, credits)
ON CONFLICT (code) DO NOTHING;

-- Enroll student in courses
INSERT INTO enrollments (student_id, course_id)
SELECT 
  (SELECT id FROM profiles WHERE email = 'projetakili@gmail.com'),
  id
FROM courses
WHERE code IN ('CS101', 'CS201', 'MATH101', 'ENG101', 'PHYS101')
ON CONFLICT (student_id, course_id) DO NOTHING;

-- Add grades for CS101
INSERT INTO grades (student_id, course_id, assignment_name, score, teacher_id)
SELECT 
  (SELECT id FROM profiles WHERE email = 'projetakili@gmail.com'),
  c.id,
  assignment_name,
  score,
  (SELECT id FROM profiles WHERE email = 'carinelutonde@gmail.com')
FROM courses c
CROSS JOIN (
  VALUES
    ('Midterm Exam', 88),
    ('Final Exam', 92),
    ('Quiz 1', 85),
    ('Quiz 2', 90),
    ('Homework 1', 95),
    ('Class Participation', 100)
) AS assignments(assignment_name, score)
WHERE c.code = 'CS101';

-- Add grades for CS201
INSERT INTO grades (student_id, course_id, assignment_name, score, teacher_id)
SELECT 
  (SELECT id FROM profiles WHERE email = 'projetakili@gmail.com'),
  c.id,
  assignment_name,
  score,
  (SELECT id FROM profiles WHERE email = 'carinelutonde@gmail.com')
FROM courses c
CROSS JOIN (
  VALUES
    ('Midterm Exam', 78),
    ('Final Exam', 82),
    ('Quiz 1', 75),
    ('Project', 88)
) AS assignments(assignment_name, score)
WHERE c.code = 'CS201';

-- Add grades for MATH101
INSERT INTO grades (student_id, course_id, assignment_name, score, teacher_id)
SELECT 
  (SELECT id FROM profiles WHERE email = 'projetakili@gmail.com'),
  c.id,
  assignment_name,
  score,
  (SELECT id FROM profiles WHERE email = 'carinelutonde@gmail.com')
FROM courses c
CROSS JOIN (
  VALUES
    ('Midterm Exam', 92),
    ('Final Exam', 95),
    ('Quiz 1', 88),
    ('Quiz 2', 90),
    ('Homework 1', 100)
) AS assignments(assignment_name, score)
WHERE c.code = 'MATH101';

-- Add grades for ENG101
INSERT INTO grades (student_id, course_id, assignment_name, score, teacher_id)
SELECT 
  (SELECT id FROM profiles WHERE email = 'projetakili@gmail.com'),
  c.id,
  assignment_name,
  score,
  (SELECT id FROM profiles WHERE email = 'carinelutonde@gmail.com')
FROM courses c
CROSS JOIN (
  VALUES
    ('Essay 1', 85),
    ('Essay 2', 88),
    ('Final Paper', 92)
) AS assignments(assignment_name, score)
WHERE c.code = 'ENG101';

-- Add grades for PHYS101
INSERT INTO grades (student_id, course_id, assignment_name, score, teacher_id)
SELECT 
  (SELECT id FROM profiles WHERE email = 'projetakili@gmail.com'),
  c.id,
  assignment_name,
  score,
  (SELECT id FROM profiles WHERE email = 'carinelutonde@gmail.com')
FROM courses c
CROSS JOIN (
  VALUES
    ('Midterm Exam', 80),
    ('Final Exam', 85),
    ('Lab Report 1', 90),
    ('Lab Report 2', 88)
) AS assignments(assignment_name, score)
WHERE c.code = 'PHYS101';

-- Add calendar events
INSERT INTO events (user_id, title, description, date, time)
SELECT 
  (SELECT id FROM profiles WHERE email = 'carinelutonde@gmail.com'),
  c.code || ' - ' || event_name,
  'Exam for ' || c.name,
  (CURRENT_DATE + (random() * 30)::int)::date,
  '14:00'::time
FROM courses c
CROSS JOIN (
  VALUES
    ('Midterm Exam'),
    ('Final Exam')
) AS events(event_name)
WHERE c.code IN ('CS101', 'CS201', 'MATH101', 'ENG101', 'PHYS101');

INSERT INTO events (user_id, title, description, date, time)
SELECT 
  (SELECT id FROM profiles WHERE email = 'projetakili@gmail.com'),
  c.code || ' - ' || event_name,
  'Assignment for ' || c.name,
  (CURRENT_DATE + (random() * 30)::int)::date,
  '23:59'::time
FROM courses c
CROSS JOIN (
  VALUES
    ('Homework 1 Due'),
    ('Project Due')
) AS events(event_name)
WHERE c.code IN ('CS101', 'CS201', 'MATH101');

-- ============================================
-- PART 2: FIX RLS POLICIES (from 004_fix_rls_policies.sql)
-- ============================================

-- Allow teachers to view all student profiles
CREATE POLICY IF NOT EXISTS "Teachers can view students" ON profiles
  FOR SELECT USING (
    role = 'student' OR id = auth.uid()
  );

-- Allow teachers to view other teachers
CREATE POLICY IF NOT EXISTS "Teachers can view other teachers" ON profiles
  FOR SELECT USING (
    role IN ('teacher', 'tenured_professor')
  );

-- Allow teachers to create enrollments
CREATE POLICY IF NOT EXISTS "Teachers can enroll students in their courses" ON enrollments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE id = course_id AND teacher_id = auth.uid()
    )
  );

-- Allow teachers to delete enrollments
CREATE POLICY IF NOT EXISTS "Teachers can unenroll students from their courses" ON enrollments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE id = course_id AND teacher_id = auth.uid()
    )
  );

-- Allow professors to manage all enrollments
CREATE POLICY IF NOT EXISTS "Professors can manage all enrollments" ON enrollments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'tenured_professor'
    )
  );

-- ============================================
-- VERIFICATION
-- ============================================

SELECT 
  'Courses Created' as item, 
  COUNT(*)::text as count 
FROM courses 
WHERE teacher_id = (SELECT id FROM profiles WHERE email = 'carinelutonde@gmail.com')

UNION ALL

SELECT 
  'Student Enrollments', 
  COUNT(*)::text 
FROM enrollments 
WHERE student_id = (SELECT id FROM profiles WHERE email = 'projetakili@gmail.com')

UNION ALL

SELECT 
  'Grades Created', 
  COUNT(*)::text 
FROM grades 
WHERE student_id = (SELECT id FROM profiles WHERE email = 'projetakili@gmail.com')

UNION ALL

SELECT 
  'Events Created', 
  COUNT(*)::text 
FROM events

UNION ALL

SELECT 
  'RLS Policies for Enrollments', 
  COUNT(*)::text 
FROM pg_policies 
WHERE tablename = 'enrollments';
