-- ============================================
-- FIX: Update Profile Policy
-- ============================================
-- DROP the old policy and recreate it with WITH CHECK
-- ============================================

-- Drop the incorrect policy
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Recreate with both USING and WITH CHECK
CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ============================================
-- EXPLANATION:
-- USING clause: Checks if the user can UPDATE this row (can they see it?)
-- WITH CHECK clause: Validates the updated data (are they still updating their own profile?)
-- 
-- For UPDATE operations, you need BOTH clauses to ensure:
-- 1. User can only update their own profile (USING)
-- 2. User cannot change the ID to someone else's (WITH CHECK)
-- ============================================
