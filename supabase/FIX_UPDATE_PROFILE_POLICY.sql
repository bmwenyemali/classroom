-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 1. Users can view their own profile (needed for dashboard)
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- 2. Users can update their own profile (needed for settings)
CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- 3. Professors can view all profiles (needed for user management)

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Professors can view all profiles" 
ON profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'tenured_professor'
  )
);

-- 4. Professors can update any profile (needed to change roles)
CREATE POLICY "Professors can update all profiles" 
ON profiles FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'tenured_professor'
  )
);

-- 5. Professors can delete any profile (needed for user management)
CREATE POLICY "Professors can delete profiles" 
ON profiles FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'tenured_professor'
  )
);