-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'guest' CHECK (role IN ('guest', 'owner', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert demo users (passwords are bcrypt hashed)
-- owner@example.com / owner123
-- guest@example.com / guest123
INSERT INTO users (id, email, password_hash, name, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'owner@example.com', '$2a$10$rQEY7xmQxqK.jMxS9J5YOuQZmGvP.5.1eYqCqE.Qq9Wh.Q9Wh.Q9W', 'Demo Owner', 'owner'),
  ('22222222-2222-2222-2222-222222222222', 'guest@example.com', '$2a$10$rQEY7xmQxqK.jMxS9J5YOuQZmGvP.5.1eYqCqE.Qq9Wh.Q9Wh.Q9W', 'Demo Guest', 'guest')
ON CONFLICT (email) DO NOTHING;

-- Insert demo properties if table is empty
INSERT INTO properties (id, name, type, location, price_per_night, max_guests, bedrooms, bathrooms, amenities, image)
SELECT * FROM (VALUES
  ('prop-1', 'Luxury Beach Villa', 'villa', 'Malibu, California', 450.00, 8, 4, 3, ARRAY['wifi', 'pool', 'beach-access', 'parking', 'air-conditioning'], 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'),
  ('prop-2', 'Cozy Mountain Cabin', 'house', 'Aspen, Colorado', 275.00, 6, 3, 2, ARRAY['wifi', 'fireplace', 'hot-tub', 'parking', 'ski-access'], 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800'),
  ('prop-3', 'Modern City Apartment', 'apartment', 'New York City, NY', 195.00, 4, 2, 1, ARRAY['wifi', 'gym', 'doorman', 'air-conditioning'], 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'),
  ('prop-4', 'Charming Studio Loft', 'studio', 'San Francisco, CA', 125.00, 2, 1, 1, ARRAY['wifi', 'workspace', 'kitchen', 'washer'], 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800'),
  ('prop-5', 'Oceanfront Paradise', 'villa', 'Miami Beach, FL', 520.00, 10, 5, 4, ARRAY['wifi', 'pool', 'beach-access', 'parking', 'chef-kitchen'], 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800'),
  ('prop-6', 'Downtown Penthouse', 'apartment', 'Chicago, IL', 350.00, 6, 3, 2, ARRAY['wifi', 'rooftop', 'gym', 'concierge', 'views'], 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800')
) AS t(id, name, type, location, price_per_night, max_guests, bedrooms, bathrooms, amenities, image)
WHERE NOT EXISTS (SELECT 1 FROM properties LIMIT 1);
