-- ============================================
-- SEED DATA: Kinshasa Libraries and Books
-- Real locations in Kinshasa, DRC
-- ============================================

-- Insert Libraries in Kinshasa
INSERT INTO libraries (name, address, latitude, longitude, phone, email, description, opening_hours, website) VALUES
-- Gombe (Downtown)
('Bibliothèque Nationale du Congo', 'Avenue de la Justice, Gombe, Kinshasa', -4.3225, 15.3088, '+243 81 234 5678', 'contact@biblionationale.cd', 'La bibliothèque nationale la plus grande de la RDC avec une collection extensive de livres en français et lingala.', 'Lun-Ven: 8h00-17h00, Sam: 9h00-13h00', 'www.biblionationale.cd'),

-- Gombe - Near Memling Hotel
('Centre Culturel Français', '8 Avenue de la Mongala, Gombe, Kinshasa', -4.3156, 15.3127, '+243 81 345 6789', 'mediatheque@ccfkin.cd', 'Médiathèque moderne avec une large collection de livres français, magazines et ressources numériques.', 'Lun-Ven: 9h00-18h00, Sam: 10h00-14h00', 'www.ccfkinshasa.org'),

-- Lemba - University Area
('Bibliothèque Universitaire de Kinshasa', 'Avenue de l''Université, Lemba, Kinshasa', -4.3789, 15.3312, '+243 81 456 7890', 'biblio@unikin.cd', 'Bibliothèque académique servant l''Université de Kinshasa avec des ressources scientifiques et littéraires.', 'Lun-Sam: 7h00-19h00', 'www.unikin.cd/bibliotheque'),

-- Ngaliema - Diplomatic Area
('American Corner Kinshasa', '310 Avenue des Aviateurs, Ngaliema, Kinshasa', -4.3298, 15.2845, '+243 81 567 8901', 'kinshasa.americancorner@state.gov', 'Ressources en anglais, programmes éducatifs et accès internet gratuit pour la communauté.', 'Mar-Sam: 9h00-17h00', 'www.americancornerkinshasa.org'),

-- Lingwala - Central
('Bibliothèque Populaire de Lingwala', 'Avenue Kalemie, Lingwala, Kinshasa', -4.3134, 15.2967, '+243 81 678 9012', 'biblio.lingwala@gmail.com', 'Bibliothèque communautaire offrant des livres pour tous les âges, programmes de lecture pour enfants.', 'Lun-Ven: 8h30-16h30', NULL),

-- Bandalungwa
('Bibliothèque Saint Paul', 'Avenue de la Paix, Bandalungwa, Kinshasa', -4.3445, 15.2789, '+243 81 789 0123', 'bibliosaintpaul@yahoo.fr', 'Bibliothèque catholique avec une collection de littérature religieuse et éducative.', 'Lun-Ven: 9h00-17h00, Dim: 10h00-13h00', NULL),

-- Kintambo
('Médiathèque de Kintambo', 'Boulevard du 30 Juin, Kintambo, Kinshasa', -4.3267, 15.2956, '+243 81 890 1234', 'media.kintambo@gmail.com', 'Médiathèque moderne avec livres, DVD, et espaces d''étude pour étudiants.', 'Lun-Sam: 8h00-18h00', NULL),

-- Limete - Airport Area
('Bibliothèque Communautaire de Limete', 'Avenue Colonel Mondjiba, Limete, Kinshasa', -4.3567, 15.3456, '+243 81 901 2345', 'biblio.limete@gmail.com', 'Centre de lecture communautaire avec programmes d''alphabétisation.', 'Lun-Ven: 8h00-16h00, Sam: 9h00-12h00', NULL),

-- Masina
('Bibliothèque Scolaire Masina', 'Avenue Lubumbashi, Masina, Kinshasa', -4.3812, 15.3678, '+243 82 012 3456', 'biblio.masina@education.cd', 'Bibliothèque scolaire servant plusieurs écoles de Masina.', 'Lun-Ven: 7h30-15h30', NULL),

-- Kalamu
('Centre de Lecture de Kalamu', 'Avenue de la Victoire, Kalamu, Kinshasa', -4.3356, 15.3234, '+243 82 123 4567', 'lecture.kalamu@gmail.com', 'Petit centre de lecture avec focus sur livres pour enfants et jeunes.', 'Lun-Sam: 9h00-17h00', NULL);

-- Insert Books
INSERT INTO books (library_id, title, author, isbn, category, description, quantity, available, publication_year, language) 
SELECT 
  l.id,
  b.title,
  b.author,
  b.isbn,
  b.category,
  b.description,
  b.quantity,
  b.available,
  b.publication_year,
  b.language
FROM libraries l
CROSS JOIN (
  VALUES
    -- French Literature
    ('Les Misérables', 'Victor Hugo', '978-2-07-036734-8', 'Littérature', 'Chef-d''œuvre de Victor Hugo sur la rédemption et la justice sociale.', 3, 3, 1862, 'French'),
    ('Le Petit Prince', 'Antoine de Saint-Exupéry', '978-2-07-061275-8', 'Jeunesse', 'Conte philosophique et poétique sur l''amitié et l''amour.', 5, 4, 1943, 'French'),
    ('L''Étranger', 'Albert Camus', '978-2-07-036002-8', 'Littérature', 'Roman existentialiste explorant l''absurdité de la condition humaine.', 2, 2, 1942, 'French'),
    
    -- African Literature
    ('Le Pleurer-Rire', 'Henri Lopes', '978-2-253-04547-2', 'Littérature Africaine', 'Satire politique de l''Afrique post-coloniale.', 3, 2, 1982, 'French'),
    ('Une Vie de Boy', 'Ferdinand Oyono', '978-2-266-12836-1', 'Littérature Africaine', 'Critique du colonialisme à travers le journal d''un boy.', 2, 2, 1956, 'French'),
    ('Le Vieux Nègre et la Médaille', 'Ferdinand Oyono', '978-2-266-05861-1', 'Littérature Africaine', 'Récit ironique sur le colonialisme français.', 2, 1, 1956, 'French'),
    
    -- Congolese Authors
    ('L''Écart', 'V.Y. Mudimbe', '978-2-01-003456-7', 'Littérature Congolaise', 'Roman philosophique d''un intellectuel congolais.', 2, 2, 1979, 'French'),
    ('La Légende de M''Pfoumou Ma Mazono', 'Jean-Baptiste Tati Loutard', '978-2-7384-3456-8', 'Littérature Congolaise', 'Légendes et traditions du Congo.', 3, 3, 1971, 'French'),
    
    -- Education & Science
    ('Mathématiques 6ème', 'Sesamath', '978-2-210-10567-3', 'Éducation', 'Manuel scolaire de mathématiques niveau 6ème.', 10, 8, 2020, 'French'),
    ('Physique-Chimie 3ème', 'Bordas', '978-2-04-733456-9', 'Sciences', 'Manuel de physique-chimie pour le secondaire.', 8, 6, 2021, 'French'),
    ('Histoire de l''Afrique', 'Ki-Zerbo Joseph', '978-92-3-201710-0', 'Histoire', 'Histoire générale de l''Afrique par l''UNESCO.', 4, 3, 1978, 'French'),
    
    -- Children''s Books
    ('Contes de la Savane', 'Amadou Hampâté Bâ', '978-2-7384-1234-5', 'Jeunesse', 'Contes traditionnels africains pour enfants.', 6, 5, 1990, 'French'),
    ('Aya de Yopougon', 'Marguerite Abouet', '978-2-07-057063-0', 'Bande Dessinée', 'BD sur la vie quotidienne à Abidjan.', 4, 3, 2005, 'French'),
    
    -- English Books
    ('Things Fall Apart', 'Chinua Achebe', '978-0-385-47454-2', 'African Literature', 'Classic novel about pre-colonial Nigeria.', 3, 3, 1958, 'English'),
    ('Animal Farm', 'George Orwell', '978-0-452-28424-1', 'Literature', 'Political allegory about totalitarianism.', 4, 2, 1945, 'English'),
    ('To Kill a Mockingbird', 'Harper Lee', '978-0-06-112008-4', 'Literature', 'Classic American novel about racial injustice.', 2, 2, 1960, 'English'),
    
    -- Reference
    ('Dictionnaire Larousse', 'Larousse', '978-2-03-583456-7', 'Référence', 'Dictionnaire français complet.', 5, 5, 2022, 'French'),
    ('Atlas du Monde', 'National Geographic', '978-2-8104-567-8', 'Référence', 'Atlas mondial avec cartes détaillées.', 3, 3, 2021, 'French'),
    
    -- Programming (for students)
    ('Apprendre Python', 'Gérard Swinnen', '978-2-212-14128-2', 'Informatique', 'Introduction à la programmation Python.', 4, 3, 2020, 'French'),
    ('HTML & CSS', 'Jon Duckett', '978-1-118-00818-8', 'Informatique', 'Guide visuel du web design.', 3, 2, 2011, 'English')
) AS b(title, author, isbn, category, description, quantity, available, publication_year, language)
WHERE l.name IN ('Bibliothèque Nationale du Congo', 'Centre Culturel Français', 'Bibliothèque Universitaire de Kinshasa');

-- Add more books to other libraries
INSERT INTO books (library_id, title, author, category, quantity, available, publication_year, language)
SELECT 
  l.id,
  'Le Petit Nicolas',
  'René Goscinny',
  'Jeunesse',
  4,
  3,
  1960,
  'French'
FROM libraries l
WHERE l.name IN ('Bibliothèque Populaire de Lingwala', 'Centre de Lecture de Kalamu');

INSERT INTO books (library_id, title, author, category, quantity, available, publication_year, language)
SELECT 
  l.id,
  'La Bible',
  'Collectif',
  'Religion',
  10,
  10,
  2015,
  'French'
FROM libraries l
WHERE l.name = 'Bibliothèque Saint Paul';

INSERT INTO books (library_id, title, author, category, quantity, available, publication_year, language)
SELECT 
  l.id,
  'English Grammar in Use',
  'Raymond Murphy',
  'Education',
  5,
  4,
  2019,
  'English'
FROM libraries l
WHERE l.name = 'American Corner Kinshasa';
