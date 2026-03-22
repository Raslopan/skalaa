-- Seed maintenance tasks
INSERT INTO maintenance_tasks (id, property_id, title, description, priority, status, due_date) VALUES
('maint-1', 'prop-1', 'AC Unit Maintenance', 'Annual HVAC inspection and filter replacement', 'medium', 'pending', '2026-03-20'),
('maint-2', 'prop-2', 'Hot Tub Repair', 'Fix water heater malfunction', 'high', 'in-progress', '2026-03-18'),
('maint-3', 'prop-3', 'Smoke Detector Check', 'Replace batteries and test all smoke detectors', 'urgent', 'pending', '2026-03-16'),
('maint-4', 'prop-4', 'Deck Staining', 'Annual deck maintenance and staining', 'low', 'completed', '2026-03-15'),
('maint-5', 'prop-1', 'Pool Cleaning', 'Weekly pool maintenance and chemical balancing', 'medium', 'completed', '2026-03-14')
ON CONFLICT (id) DO NOTHING;
