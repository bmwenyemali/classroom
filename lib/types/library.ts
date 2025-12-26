export interface Library {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  description?: string;
  opening_hours?: string;
  website?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Book {
  id: string;
  library_id: string;
  title: string;
  author: string;
  isbn?: string;
  category: string;
  description?: string;
  quantity: number;
  available: number;
  publication_year?: number;
  language: string;
  cover_url?: string;
  created_at: string;
  updated_at: string;
  library?: Library;
}
