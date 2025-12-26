-- ============================================
-- LIBRARIES AND BOOKS SCHEMA
-- Add mapping functionality with Mapbox
-- ============================================

-- Add address fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS home_address TEXT,
ADD COLUMN IF NOT EXISTS home_latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS home_longitude DOUBLE PRECISION;

-- Create libraries table
CREATE TABLE IF NOT EXISTS libraries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  phone TEXT,
  email TEXT,
  description TEXT,
  opening_hours TEXT,
  website TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create books table
CREATE TABLE IF NOT EXISTS books (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  library_id UUID REFERENCES libraries(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn TEXT,
  category TEXT NOT NULL,
  description TEXT,
  quantity INTEGER DEFAULT 1,
  available INTEGER DEFAULT 1,
  publication_year INTEGER,
  language TEXT DEFAULT 'French',
  cover_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT positive_quantity CHECK (quantity >= 0),
  CONSTRAINT available_lte_quantity CHECK (available <= quantity)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_libraries_location ON libraries(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_books_library ON books(library_id);
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_books_title ON books USING gin(to_tsvector('french', title));
CREATE INDEX IF NOT EXISTS idx_books_author ON books USING gin(to_tsvector('french', author));

-- Enable Row Level Security
ALTER TABLE libraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- RLS Policies for libraries (everyone can view)
CREATE POLICY "Anyone can view libraries"
ON libraries FOR SELECT
USING (true);

CREATE POLICY "Professors can manage libraries"
ON libraries FOR ALL
USING (public.get_my_role() = 'tenured_professor');

-- RLS Policies for books (everyone can view)
CREATE POLICY "Anyone can view books"
ON books FOR SELECT
USING (true);

CREATE POLICY "Professors can manage books"
ON books FOR ALL
USING (public.get_my_role() = 'tenured_professor');

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_libraries_updated_at
BEFORE UPDATE ON libraries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_books_updated_at
BEFORE UPDATE ON books
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
