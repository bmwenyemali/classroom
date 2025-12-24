-- ============================================
-- SOLUTION: Create a helper function to check user role
-- ============================================
-- This function bypasses RLS to check if current user is a professor
-- ============================================

-- Create a function that returns the current user's role
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_my_role() TO authenticated;

-- ============================================
-- Now recreate all policies using this function
-- ============================================

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Professors can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Professors can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Professors can delete profiles" ON profiles;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICY 1: Users can view their own profile
-- ============================================
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- ============================================
-- POLICY 2: Users can update their own profile
-- ============================================
CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ============================================
-- POLICY 3: Professors can view all profiles
-- FIXED: Uses helper function that bypasses RLS
-- ============================================
CREATE POLICY "Professors can view all profiles" 
ON profiles FOR SELECT 
USING (public.get_my_role() = 'tenured_professor');

-- ============================================
-- POLICY 4: Professors can update any profile
-- ============================================
CREATE POLICY "Professors can update all profiles" 
ON profiles FOR UPDATE 
USING (public.get_my_role() = 'tenured_professor')
WITH CHECK (public.get_my_role() = 'tenured_professor');

-- ============================================
-- POLICY 5: Professors can delete any profile
-- ============================================
CREATE POLICY "Professors can delete profiles" 
ON profiles FOR DELETE 
USING (public.get_my_role() = 'tenured_professor');

-- ============================================
-- EXPLANATION:
-- ============================================
-- The public.get_my_role() function is created with SECURITY DEFINER,
-- which means it runs with the privileges of the function creator
-- (bypassing RLS) and can directly read from the profiles table.
--
-- This eliminates the circular dependency because:
-- 1. User requests data from profiles
-- 2. RLS policy calls public.get_my_role()
-- 3. Function bypasses RLS and gets user's role
-- 4. Policy allows/denies based on the returned role
--
-- No circular dependency because the function doesn't trigger RLS!
-- ============================================

-- ============================================
-- VERIFICATION:
-- ============================================
-- 1. Test the function:
-- SELECT public.get_my_role();
-- Should return: 'tenured_professor', 'teacher', or 'student'
--
-- 2. Test as professor (should see all profiles):
-- SELECT * FROM profiles;
--
-- 3. Test as student (should see only own profile):
-- SELECT * FROM profiles;
-- ============================================
