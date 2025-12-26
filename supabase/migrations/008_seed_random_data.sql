-- ============================================
-- SEED DATA: Random Data for All Tables
-- Creates realistic test data for the classroom app
-- ============================================

-- Note: Run this after initial user signup
-- This adds additional test data to existing tables

-- Add more students with home addresses in Kinshasa
DO $$
DECLARE
  student_addresses TEXT[] := ARRAY[
    'Avenue de la Liberté, Gombe, Kinshasa',
    'Boulevard du 30 Juin, Kint ambo, Kinshasa',
    'Avenue Kalembelembe, Bandalungwa, Kinshasa',
    'Rue de la Paix, Lemba, Kinshasa',
    'Avenue Lubumbashi, Masina, Kinshasa',
    'Rue de l''Université, Lemba, Kinshasa',
    'Avenue des Aviateurs, Ngaliema, Kinshasa',
    'Boulevard Lumumba, Limete, Kinshasa',
    'Avenue Kasa-Vubu, Kalamu, Kinshasa',
    'Rue de l''Équateur, Gombe, Kinshasa'
  ];
  
  student_lats NUMERIC[] := ARRAY[-4.3225, -4.3267, -4.3445, -4.3789, -4.3812, -4.3756, -4.3298, -4.3567, -4.3356, -4.3198];
  student_lngs NUMERIC[] := ARRAY[15.3088, 15.2956, 15.2789, 15.3312, 15.3678, 15.3289, 15.2845, 15.3456, 15.3234, 15.3067];
  
  student_names TEXT[] := ARRAY[
    'Marie Kabila',
    'Jean Tshisekedi',
    'Grace Mukendi',
    'Daniel Mwamba',
    'Sarah Kazadi',
    'Patrick Mulamba',
    'Esther Banza',
    'Joseph Nkulu',
    'Rachel Mbuyi',
    'David Kalala'
  ];
  
  i INTEGER;
BEGIN
  -- Note: This assumes you have auth.users entries for these emails
  -- In production, users would sign up themselves
  
  FOR i IN 1..10 LOOP
    -- Update existing profiles or insert if needed
    -- (Assuming profiles are created via auth trigger)
    -- This just updates with home addresses
    NULL; -- Profiles will be created by users signing up
  END LOOP;
END $$;

-- Add sample courses
INSERT INTO courses (name, code, description, teacher_id, credits)
SELECT 
  course_name,
  course_code,
  course_desc,
  (SELECT id FROM profiles WHERE role = 'teacher' LIMIT 1 OFFSET (random() * (SELECT COUNT(*)-1 FROM profiles WHERE role = 'teacher'))::int),
  credits_value
FROM (VALUES
  ('Introduction to Computer Science', 'CS101', 'Fundamentals of programming and computer systems', 3),
  ('Data Structures and Algorithms', 'CS201', 'Advanced programming concepts and algorithm design', 4),
  ('Database Management Systems', 'CS301', 'Relational databases, SQL, and database design', 3),
  ('Web Development', 'CS202', 'HTML, CSS, JavaScript, and modern web frameworks', 3),
  ('Mobile App Development', 'CS302', 'iOS and Android application development', 3),
  ('Mathematics for Computer Science', 'MATH101', 'Discrete mathematics, logic, and set theory', 4),
  ('Linear Algebra', 'MATH201', 'Vectors, matrices, and linear transformations', 3),
  ('Calculus I', 'MATH102', 'Limits, derivatives, and applications', 4),
  ('Physics I', 'PHYS101', 'Mechanics, thermodynamics, and waves', 4),
  ('Digital Logic Design', 'CS102', 'Boolean algebra, gates, and circuit design', 3),
  ('Operating Systems', 'CS303', 'Process management, memory, and file systems', 4),
  ('Computer Networks', 'CS304', 'Network protocols, TCP/IP, and internet architecture', 3),
  ('Artificial Intelligence', 'CS401', 'Machine learning, neural networks, and AI applications', 4),
  ('Software Engineering', 'CS305', 'Software development lifecycle and best practices', 3),
  ('Cybersecurity Fundamentals', 'CS306', 'Network security, cryptography, and ethical hacking', 3)
) AS courses(course_name, course_code, course_desc, credits_value)
ON CONFLICT (code) DO NOTHING;

-- Enroll students in random courses (each student in 4-6 courses)
DO $$
DECLARE
  student_rec RECORD;
  course_rec RECORD;
  num_courses INTEGER;
  enrolled_count INTEGER;
BEGIN
  FOR student_rec IN SELECT id FROM profiles WHERE role = 'student' LOOP
    num_courses := 4 + floor(random() * 3)::int; -- 4 to 6 courses
    enrolled_count := 0;
    
    FOR course_rec IN 
      SELECT id FROM courses ORDER BY random() LIMIT num_courses
    LOOP
      INSERT INTO enrollments (student_id, course_id)
      VALUES (student_rec.id, course_rec.id)
      ON CONFLICT (student_id, course_id) DO NOTHING;
      
      enrolled_count := enrolled_count + 1;
    END LOOP;
  END LOOP;
END $$;

-- Add random grades for enrolled students
DO $$
DECLARE
  enrollment_rec RECORD;
  assignment_names TEXT[] := ARRAY[
    'Homework 1', 'Homework 2', 'Homework 3',
    'Quiz 1', 'Quiz 2', 'Quiz 3',
    'Midterm Exam', 'Final Project', 'Final Exam',
    'Lab Report 1', 'Lab Report 2', 'Presentation'
  ];
  assignment_name TEXT;
  num_assignments INTEGER;
  i INTEGER;
  score_value NUMERIC;
BEGIN
  FOR enrollment_rec IN 
    SELECT e.student_id, e.course_id 
    FROM enrollments e 
    LIMIT 100 -- Limit to prevent too much data
  LOOP
    num_assignments := 3 + floor(random() * 6)::int; -- 3 to 8 assignments per course
    
    FOR i IN 1..num_assignments LOOP
      assignment_name := assignment_names[1 + floor(random() * array_length(assignment_names, 1))::int];
      score_value := 50 + (random() * 50); -- Scores between 50 and 100
      
      INSERT INTO grades (student_id, course_id, assignment_name, score, graded_at)
      VALUES (
        enrollment_rec.student_id,
        enrollment_rec.course_id,
        assignment_name || ' - Part ' || i,
        score_value,
        NOW() - (random() * interval '30 days')
      )
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;
END $$;

-- Add random events for users
DO $$
DECLARE
  user_rec RECORD;
  event_titles TEXT[] := ARRAY[
    'Study Session', 'Group Project Meeting', 'Office Hours',
    'Exam Review', 'Lab Work', 'Assignment Due',
    'Presentation', 'Workshop', 'Seminar', 'Conference'
  ];
  event_types TEXT[] := ARRAY['class', 'assignment', 'exam', 'event'];
  event_title TEXT;
  event_type TEXT;
  num_events INTEGER;
  i INTEGER;
  start_time TIMESTAMP;
  end_time TIMESTAMP;
BEGIN
  FOR user_rec IN SELECT id FROM profiles LIMIT 50 LOOP
    num_events := 2 + floor(random() * 5)::int; -- 2 to 6 events per user
    
    FOR i IN 1..num_events LOOP
      event_title := event_titles[1 + floor(random() * array_length(event_titles, 1))::int];
      event_type := event_types[1 + floor(random() * array_length(event_types, 1))::int];
      
      -- Random future date within next 30 days
      start_time := NOW() + (random() * interval '30 days');
      end_time := start_time + (interval '1 hour') + (random() * interval '2 hours');
      
      INSERT INTO events (user_id, title, description, start_time, end_time, event_type)
      VALUES (
        user_rec.id,
        event_title,
        'Scheduled ' || event_type || ' for ' || to_char(start_time, 'Month DD'),
        start_time,
        end_time,
        event_type
      );
    END LOOP;
  END LOOP;
END $$;

-- Add some past events too
DO $$
DECLARE
  user_rec RECORD;
  start_time TIMESTAMP;
  end_time TIMESTAMP;
BEGIN
  FOR user_rec IN SELECT id FROM profiles LIMIT 30 LOOP
    -- Add 2-3 past events
    FOR i IN 1..2 LOOP
      start_time := NOW() - (random() * interval '30 days');
      end_time := start_time + interval '2 hours';
      
      INSERT INTO events (user_id, title, description, start_time, end_time, event_type)
      VALUES (
        user_rec.id,
        'Completed Activity',
        'Past event from ' || to_char(start_time, 'Month DD'),
        start_time,
        end_time,
        'class'
      );
    END LOOP;
  END LOOP;
END $$;

-- Summary
DO $$
DECLARE
  course_count INTEGER;
  enrollment_count INTEGER;
  grade_count INTEGER;
  event_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO course_count FROM courses;
  SELECT COUNT(*) INTO enrollment_count FROM enrollments;
  SELECT COUNT(*) INTO grade_count FROM grades;
  SELECT COUNT(*) INTO event_count FROM events;
  
  RAISE NOTICE 'Seed data created:';
  RAISE NOTICE '- Courses: %', course_count;
  RAISE NOTICE '- Enrollments: %', enrollment_count;
  RAISE NOTICE '- Grades: %', grade_count;
  RAISE NOTICE '- Events: %', event_count;
END $$;
