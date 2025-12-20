-- DIAGNOSTIC: Check if accounts exist and see current data state
-- Run this FIRST to verify your accounts exist

-- Check if your user accounts exist in profiles table
SELECT 
  'User Accounts Found' as check_type,
  email,
  role,
  full_name
FROM profiles
WHERE email IN ('carinelutonde@gmail.com', 'projetakili@gmail.com', 'bienvenu.mubangu@gmail.com')
ORDER BY role;

-- Check current data counts
SELECT 'Current Data State' as info, 
  (SELECT COUNT(*) FROM courses) as courses,
  (SELECT COUNT(*) FROM enrollments) as enrollments,
  (SELECT COUNT(*) FROM grades) as grades,
  (SELECT COUNT(*) FROM events) as events,
  (SELECT COUNT(*) FROM profiles WHERE role = 'student') as students,
  (SELECT COUNT(*) FROM profiles WHERE role = 'teacher') as teachers,
  (SELECT COUNT(*) FROM profiles WHERE role = 'tenured_professor') as professors;

-- If counts are 0, you need to run 003_seed_with_real_accounts.sql
-- If accounts don't exist, check that you've actually signed up with these emails
