-- Order types (fixed business rules: lower priority = served first)
INSERT INTO order_types (code, name, priority) VALUES
  ('EMERGENCY', 'Emergency', 1),
  ('OVERDUE',   'Overdue',   2),
  ('DAILY',     'Daily',     3);

-- Wildcard supplier and warehouse (SP-000 / WH-000 = any)
INSERT INTO suppliers  (code, name,          is_wildcard) VALUES ('SP-000', 'Any Supplier',  TRUE);
INSERT INTO warehouses (code, name,          is_wildcard) VALUES ('WH-000', 'Any Warehouse', TRUE);
