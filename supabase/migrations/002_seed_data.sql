-- Generate random data for Classroom database
-- Run this in Supabase SQL Editor after running the initial migration

-- ============================================
-- 1. CREATE SAMPLE COURSES
-- ============================================

INSERT INTO courses (teacher_id, code, name, description, credits) 
SELECT 
  (SELECT id FROM profiles WHERE role = 'teacher' LIMIT 1),
  code,
  name,
  description,
  credits
FROM (
  VALUES
    ('CS101', 'Introduction to Computer Science', 'Learn the fundamentals of programming and computer science concepts', 3),
    ('CS201', 'Data Structures and Algorithms', 'Advanced programming concepts including arrays, linked lists, trees, and sorting algorithms', 4),
    ('MATH101', 'Calculus I', 'Introduction to differential and integral calculus', 4),
    ('MATH201', 'Linear Algebra', 'Study of vector spaces, matrices, and linear transformations', 3),
    ('ENG101', 'English Composition', 'Develop writing and critical thinking skills', 3),
    ('PHYS101', 'Physics I', 'Mechanics, heat, and sound with laboratory', 4),
    ('CHEM101', 'General Chemistry', 'Introduction to chemical principles and laboratory techniques', 4),
    ('BIO101', 'Introduction to Biology', 'Fundamentals of cellular and molecular biology', 4),
    ('HIST101', 'World History', 'Survey of major civilizations from ancient times to present', 3),
    ('PSYCH101', 'Introduction to Psychology', 'Overview of human behavior and mental processes', 3),
    ('ECON101', 'Principles of Economics', 'Introduction to microeconomic and macroeconomic theory', 3),
    ('ART101', 'Introduction to Art', 'Survey of art history and studio techniques', 3),
    ('CS301', 'Database Systems', 'Design and implementation of relational databases', 3),
    ('CS401', 'Software Engineering', 'Software development lifecycle and best practices', 4),
    ('STAT101', 'Statistics', 'Introduction to statistical methods and data analysis', 3)
) AS course_data(code, name, description, credits);

-- ============================================
-- 2. ENROLL ALL STUDENTS IN RANDOM COURSES
-- ============================================

-- Each student gets enrolled in 4-6 random courses
INSERT INTO enrollments (student_id, course_id)
SELECT DISTINCT
  s.id as student_id,
  c.id as course_id
FROM 
  profiles s
  CROSS JOIN LATERAL (
    SELECT id 
    FROM courses 
    ORDER BY RANDOM() 
    LIMIT floor(random() * 3 + 4)::int  -- 4 to 6 courses per student
  ) c
WHERE s.role = 'student'
ON CONFLICT (student_id, course_id) DO NOTHING;

-- ============================================
-- 3. GENERATE GRADES FOR ENROLLED STUDENTS
-- ============================================

-- Generate 5-8 grades per enrollment with various assignment types
INSERT INTO grades (student_id, course_id, assignment_name, score, teacher_id)
SELECT 
  e.student_id,
  e.course_id,
  assignment_name,
  -- Random score between 60-100
  floor(random() * 40 + 60)::numeric,
  c.teacher_id
FROM enrollments e
JOIN courses c ON e.course_id = c.id
CROSS JOIN LATERAL (
  SELECT * FROM (
    VALUES
      ('Midterm Exam'),
      ('Final Exam'),
      ('Quiz 1'),
      ('Quiz 2'),
      ('Homework 1'),
      ('Homework 2'),
      ('Class Participation'),
      ('Group Project')
  ) AS assignments(assignment_name)
  ORDER BY RANDOM()
  LIMIT floor(random() * 4 + 5)::int  -- 5 to 8 grades per enrollment
) AS random_assignments;

-- ============================================
-- 4. CREATE CALENDAR EVENTS
-- ============================================

-- Create exam events for each course
INSERT INTO events (user_id, title, description, date, time)
SELECT 
  c.teacher_id,
  c.code || ' - ' || event_name,
  'Exam for ' || c.name,
  -- Random date in next 60 days
  (NOW() + (random() * 60 || ' days')::interval)::date,
  '14:00'::time
FROM courses c
CROSS JOIN (
  VALUES
    ('Midterm Exam'),
    ('Final Exam')
) AS events(event_name);

-- Create assignment due dates
INSERT INTO events (user_id, title, description, date, time)
SELECT 
  c.teacher_id,
  c.code || ' - ' || event_name || ' Due',
  event_name || ' for ' || c.name,
  (NOW() + (random() * 90 || ' days')::interval)::date,
  '23:59'::time
FROM courses c
CROSS JOIN (
  VALUES
    ('Homework 1'),
    ('Homework 2'),
    ('Project Report')
) AS events(event_name);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check what was created
SELECT 'Courses Created' as item, COUNT(*)::text as count FROM courses
UNION ALL
SELECT 'Enrollments Created', COUNT(*)::text FROM enrollments
UNION ALL
SELECT 'Grades Created', COUNT(*)::text FROM grades
UNION ALL
SELECT 'Events Created', COUNT(*)::text FROM events;

-- Show sample data
SELECT 'Sample Course: ' || code || ' - ' || name as info FROM courses LIMIT 1;

SELECT 'Sample Grade: ' || g.assignment_name || ' - ' || g.score::text || '/100' as info
FROM grades g LIMIT 1;