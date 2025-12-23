-- ============================================
-- GET ALL EXISTING POLICIES
-- ============================================
-- Run this query first to see what policies exist
-- Then we can delete them all
-- ============================================

SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
