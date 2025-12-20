-- Seed data for specific user accounts
-- Run this in Supabase SQL Editor
-- Accounts: Teacher (carinelutonde@gmail.com), Student (projetakili@gmail.com), Professor (bienvenu.mubangu@gmail.com)

-- ============================================
-- 1. CLEAN UP OLD TEST DATA (OPTIONAL)
-- ============================================

-- Uncomment these lines if you want to start fresh:
-- DELETE FROM grades;
-- DELETE FROM enrollments;
-- DELETE FROM courses;
-- DELETE FROM events;

-- ============================================
-- 2. CREATE COURSES FOR TEACHER ACCOUNT
-- ============================================

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

-- ============================================
-- 3. ENROLL STUDENT IN ALL COURSES
-- ============================================

INSERT INTO enrollments (student_id, course_id)
SELECT 
  (SELECT id FROM profiles WHERE email = 'projetakili@gmail.com'),
  id
FROM courses
WHERE code IN ('CS101', 'CS201', 'MATH101', 'ENG101', 'PHYS101')
ON CONFLICT (student_id, course_id) DO NOTHING;

-- ============================================
-- 4. ADD GRADES FOR STUDENT
-- ============================================

-- CS101 Grades
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

-- CS201 Grades
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

-- MATH101 Grades
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

-- ENG101 Grades
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

-- PHYS101 Grades
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

-- ============================================
-- 5. CREATE CALENDAR EVENTS
-- ============================================

-- Add exam events for teacher
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

-- Add events for student (visible in their calendar)
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
-- VERIFICATION
-- ============================================

-- Check what was created
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
FROM events;

-- Show sample data
SELECT 
  'Teacher Courses: ' || STRING_AGG(code, ', ') as info
FROM courses 
WHERE teacher_id = (SELECT id FROM profiles WHERE email = 'carinelutonde@gmail.com');

SELECT 
  'Student Average Grade: ' || ROUND(AVG(score), 2)::text || '%' as info
FROM grades 
WHERE student_id = (SELECT id FROM profiles WHERE email = 'projetakili@gmail.com');
