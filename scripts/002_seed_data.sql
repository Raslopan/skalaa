-- Seed properties data
INSERT INTO properties (id, name, type, location, price_per_night, max_guests, bedrooms, bathrooms, amenities, image)
VALUES 
  (
    'prop-1',
    'Seaside Luxury Apartment',
    'apartment',
    'Miami Beach, FL',
    250.00,
    4,
    2,
    2,
    ARRAY['WiFi', 'Pool', 'Kitchen', 'AC', 'Parking'],
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop'
  ),
  (
    'prop-2',
    'Mountain View Villa',
    'villa',
    'Aspen, CO',
    450.00,
    8,
    4,
    3,
    ARRAY['WiFi', 'Hot Tub', 'Fireplace', 'Kitchen', 'Ski Storage'],
    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop'
  ),
  (
    'prop-3',
    'Downtown Studio Loft',
    'studio',
    'New York, NY',
    180.00,
    2,
    1,
    1,
    ARRAY['WiFi', 'Gym', 'Doorman', 'Washer/Dryer'],
    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&auto=format&fit=crop'
  ),
  (
    'prop-4',
    'Beachfront House',
    'house',
    'Malibu, CA',
    650.00,
    6,
    3,
    2,
    ARRAY['WiFi', 'Beach Access', 'BBQ', 'Patio', 'Kitchen'],
    'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&auto=format&fit=crop'
  )
ON CONFLICT (id) DO NOTHING;

-- Seed reservations data
INSERT INTO reservations (id, property_id, guest_name, guest_email, check_in, check_out, guests, total_price, status, created_at)
VALUES 
  (
    'res-1',
    'prop-1',
    'John Smith',
    'john@example.com',
    '2026-03-15',
    '2026-03-20',
    2,
    1250.00,
    'confirmed',
    '2026-03-01'
  ),
  (
    'res-2',
    'prop-1',
    'Jane Doe',
    'jane@example.com',
    '2026-03-22',
    '2026-03-25',
    4,
    750.00,
    'confirmed',
    '2026-03-05'
  ),
  (
    'res-3',
    'prop-2',
    'Mike Johnson',
    'mike@example.com',
    '2026-03-18',
    '2026-03-24',
    6,
    2700.00,
    'pending',
    '2026-03-10'
  ),
  (
    'res-4',
    'prop-3',
    'Sarah Wilson',
    'sarah@example.com',
    '2026-03-16',
    '2026-03-19',
    2,
    540.00,
    'confirmed',
    '2026-03-08'
  ),
  (
    'res-5',
    'prop-4',
    'Robert Brown',
    'robert@example.com',
    '2026-03-20',
    '2026-03-27',
    5,
    4550.00,
    'confirmed',
    '2026-03-12'
  )
ON CONFLICT (id) DO NOTHING;
