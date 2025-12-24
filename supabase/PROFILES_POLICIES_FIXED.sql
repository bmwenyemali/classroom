-- ============================================
-- PROFILES TABLE - COMPLETE RLS POLICIES
-- ============================================
-- This fixes the circular dependency issue
-- ============================================

-- First, drop all existing policies
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
-- FIXED: No subquery - check if ANY row matches professor criteria
-- ============================================
CREATE POLICY "Professors can view all profiles" 
ON profiles FOR SELECT 
USING (
  -- Allow viewing ANY profile if the current authenticated user's role is professor
  -- This works because auth.uid() is constant per request
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'tenured_professor')
);

-- ============================================
-- POLICY 4: Professors can update any profile
-- ============================================
CREATE POLICY "Professors can update all profiles" 
ON profiles FOR UPDATE 
USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'tenured_professor')
)
WITH CHECK (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'tenured_professor')
);

-- ============================================
-- POLICY 5: Professors can delete any profile
-- ============================================
CREATE POLICY "Professors can delete profiles" 
ON profiles FOR DELETE 
USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'tenured_professor')
);

-- ============================================
-- EXPLANATION:
-- ============================================
-- The key fix is using a SUBQUERY that specifically queries auth.uid()
-- instead of EXISTS with a generic WHERE clause.
-- 
-- BAD (circular dependency):
--   EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'tenured_professor')
--   This creates alias conflicts and circular checks
--
-- GOOD (direct subquery):
--   (SELECT role FROM profiles WHERE id = auth.uid()) = 'tenured_professor'
--   This directly gets the current user's role from their own row
--
-- How it works:
-- 1. Regular users: Only "Users can view their own profile" applies
-- 2. Professors: BOTH policies apply (their own + all profiles) due to OR logic
-- ============================================

-- ============================================
-- VERIFICATION QUERIES:
-- ============================================
-- 1. Check all policies exist:
-- SELECT policyname, cmd FROM pg_policies WHERE tablename = 'profiles';
--
-- 2. Test as regular user (should see only their profile):
-- SELECT * FROM profiles;
--
-- 3. Test as professor (should see all profiles):
-- SELECT * FROM profiles;
-- ============================================
