-- Generate random data for Classroom database
-- Run this in Supabase SQL Editor after running the initial migration

-- ============================================
-- 1. CREATE SAMPLE COURSES
-- ============================================

INSERT INTO courses (teacher_id, code, name, description, semester, credits) 
SELECT 
  (SELECT id FROM profiles WHERE role = 'teacher' LIMIT 1),
  code,
  name,
  description,
  semester,
  credits
FROM (
  VALUES
    ('CS101', 'Introduction to Computer Science', 'Learn the fundamentals of programming and computer science concepts', 'Fall 2024', 3),
    ('CS201', 'Data Structures and Algorithms', 'Advanced programming concepts including arrays, linked lists, trees, and sorting algorithms', 'Fall 2024', 4),
    ('MATH101', 'Calculus I', 'Introduction to differential and integral calculus', 'Fall 2024', 4),
    ('MATH201', 'Linear Algebra', 'Study of vector spaces, matrices, and linear transformations', 'Spring 2025', 3),
    ('ENG101', 'English Composition', 'Develop writing and critical thinking skills', 'Fall 2024', 3),
    ('PHYS101', 'Physics I', 'Mechanics, heat, and sound with laboratory', 'Fall 2024', 4),
    ('CHEM101', 'General Chemistry', 'Introduction to chemical principles and laboratory techniques', 'Spring 2025', 4),
    ('BIO101', 'Introduction to Biology', 'Fundamentals of cellular and molecular biology', 'Fall 2024', 4),
    ('HIST101', 'World History', 'Survey of major civilizations from ancient times to present', 'Fall 2024', 3),
    ('PSYCH101', 'Introduction to Psychology', 'Overview of human behavior and mental processes', 'Spring 2025', 3),
    ('ECON101', 'Principles of Economics', 'Introduction to microeconomic and macroeconomic theory', 'Fall 2024', 3),
    ('ART101', 'Introduction to Art', 'Survey of art history and studio techniques', 'Spring 2025', 3),
    ('CS301', 'Database Systems', 'Design and implementation of relational databases', 'Spring 2025', 3),
    ('CS401', 'Software Engineering', 'Software development lifecycle and best practices', 'Spring 2025', 4),
    ('STAT101', 'Statistics', 'Introduction to statistical methods and data analysis', 'Fall 2024', 3)
) AS course_data(code, name, description, semester, credits);

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
INSERT INTO grades (student_id, course_id, assignment_name, score, max_score, grade_type, created_by)
SELECT 
  e.student_id,
  e.course_id,
  assignment_name,
  -- Random score between 60-100
  floor(random() * 40 + 60)::numeric,
  max_score,
  grade_type,
  c.teacher_id
FROM enrollments e
JOIN courses c ON e.course_id = c.id
CROSS JOIN LATERAL (
  SELECT * FROM (
    VALUES
      ('Midterm Exam', 100, 'exam'),
      ('Final Exam', 100, 'exam'),
      ('Quiz 1', 50, 'quiz'),
      ('Quiz 2', 50, 'quiz'),
      ('Homework 1', 20, 'homework'),
      ('Homework 2', 20, 'homework'),
      ('Class Participation', 100, 'participation'),
      ('Group Project', 100, 'project')
  ) AS assignments(assignment_name, max_score, grade_type)
  ORDER BY RANDOM()
  LIMIT floor(random() * 4 + 5)::int  -- 5 to 8 grades per enrollment
) AS random_assignments;

-- ============================================
-- 4. CREATE CALENDAR EVENTS
-- ============================================

-- Create exam events for each course
INSERT INTO events (title, description, event_type, course_id, start_time, end_time, location, created_by)
SELECT 
  c.code || ' - ' || event_name,
  'Exam for ' || c.name,
  'exam',
  c.id,
  -- Random date in next 60 days
  NOW() + (random() * 60 || ' days')::interval,
  NOW() + (random() * 60 || ' days')::interval + '2 hours'::interval,
  'Room ' || floor(random() * 300 + 100)::text,
  c.teacher_id
FROM courses c
CROSS JOIN (
  VALUES
    ('Midterm Exam'),
    ('Final Exam')
) AS events(event_name);

-- Create assignment due dates
INSERT INTO events (title, description, event_type, course_id, start_time, end_time, location, created_by)
SELECT 
  c.code || ' - ' || event_name || ' Due',
  event_name || ' for ' || c.name,
  'assignment',
  c.id,
  NOW() + (random() * 90 || ' days')::interval,
  NOW() + (random() * 90 || ' days')::interval + '1 hour'::interval,
  'Online Submission',
  c.teacher_id
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
SELECT 'Courses Created' as item, COUNT(*) as count FROM courses
UNION ALL
SELECT 'Enrollments Created', COUNT(*) FROM enrollments
UNION ALL
SELECT 'Grades Created', COUNT(*) FROM grades
UNION ALL
SELECT 'Events Created', COUNT(*) FROM events;

-- Show sample data
SELECT 'Sample Course:' as info, code, name FROM courses LIMIT 1
UNION ALL
SELECT 'Sample Grade:', g.assignment_name, g.score::text || '/' || g.max_score::text
FROM grades g LIMIT 1;
