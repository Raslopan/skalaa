-- Seed properties
INSERT INTO properties (id, name, type, location, price_per_night, max_guests, bedrooms, bathrooms, amenities, image) VALUES
  ('prop-1', 'Seaside Luxury Apartment', 'apartment', 'Miami Beach, FL', 250, 4, 2, 2, ARRAY['WiFi', 'Pool', 'Kitchen', 'AC', 'Parking'], 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop'),
  ('prop-2', 'Mountain View Villa', 'villa', 'Aspen, CO', 450, 8, 4, 3, ARRAY['WiFi', 'Hot Tub', 'Fireplace', 'Kitchen', 'Ski Storage'], 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop'),
  ('prop-3', 'Downtown Studio Loft', 'studio', 'New York, NY', 180, 2, 1, 1, ARRAY['WiFi', 'Gym', 'Doorman', 'Washer/Dryer'], 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&auto=format&fit=crop'),
  ('prop-4', 'Beachfront House', 'house', 'Malibu, CA', 650, 6, 3, 2, ARRAY['WiFi', 'Beach Access', 'BBQ', 'Patio', 'Kitchen'], 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&auto=format&fit=crop')
ON CONFLICT (id) DO NOTHING;

-- Seed reservations
INSERT INTO reservations (id, property_id, guest_name, guest_email, check_in, check_out, guests, total_price, status, created_at) VALUES
  ('res-1', 'prop-1', 'John Smith', 'john@example.com', '2026-03-15', '2026-03-20', 2, 1250, 'confirmed', '2026-03-01'),
  ('res-2', 'prop-1', 'Jane Doe', 'jane@example.com', '2026-03-22', '2026-03-25', 4, 750, 'confirmed', '2026-03-05'),
  ('res-3', 'prop-2', 'Mike Johnson', 'mike@example.com', '2026-03-18', '2026-03-24', 6, 2700, 'pending', '2026-03-10'),
  ('res-4', 'prop-3', 'Sarah Wilson', 'sarah@example.com', '2026-03-16', '2026-03-19', 2, 540, 'confirmed', '2026-03-08'),
  ('res-5', 'prop-4', 'Robert Brown', 'robert@example.com', '2026-03-20', '2026-03-27', 5, 4550, 'confirmed', '2026-03-12')
ON CONFLICT (id) DO NOTHING;

-- Seed modules
INSERT INTO modules (id, name, description, icon, enabled, route) VALUES
  ('dashboard', 'Owner Dashboard', 'Property overview and analytics', 'LayoutDashboard', true, '/admin/dashboard'),
  ('properties', 'Property Management', 'Add, edit and manage listings', 'Building2', true, '/admin/properties'),
  ('reservations', 'Manual Booking', 'Create bookings for guests', 'Calendar', true, '/admin/reservations'),
  ('financial', 'Financial Analysis', 'Revenue reports and insights', 'TrendingUp', true, '/admin/financial'),
  ('maintenance', 'Maintenance', 'Property upkeep tracking', 'Wrench', true, '/admin/maintenance'),
  ('employees', 'Employee Management', 'Staff scheduling and payroll', 'Users', false, '/admin/employees')
ON CONFLICT (id) DO NOTHING;

-- Seed maintenance tasks
INSERT INTO maintenance_tasks (id, property_id, title, description, priority, status, assignee, due_date, created_at) VALUES
  ('task-1', 'prop-1', 'AC Unit Maintenance', 'Annual HVAC inspection and filter replacement', 'medium', 'pending', 'John Technician', '2026-03-20', '2026-03-10'),
  ('task-2', 'prop-2', 'Hot Tub Repair', 'Fix water heater malfunction', 'high', 'in-progress', 'Mike Plumber', '2026-03-18', '2026-03-12'),
  ('task-3', 'prop-3', 'Smoke Detector Check', 'Replace batteries and test all smoke detectors', 'urgent', 'pending', 'Sarah Safety', '2026-03-16', '2026-03-14'),
  ('task-4', 'prop-4', 'Deck Staining', 'Annual deck maintenance and staining', 'low', 'completed', 'Tom Carpenter', '2026-03-15', '2026-03-05'),
  ('task-5', 'prop-1', 'Pool Cleaning', 'Weekly pool maintenance and chemical balancing', 'medium', 'completed', 'Pool Service Co.', '2026-03-14', '2026-03-07')
ON CONFLICT (id) DO NOTHING;
