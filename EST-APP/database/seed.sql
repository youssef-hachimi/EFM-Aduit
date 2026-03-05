-- Seed: create one admin user (password: admin123)
-- NOTE: bcrypt hash below is for "admin123" with cost=10 (you can regenerate)
INSERT INTO users (name, email, password_hash, role)
VALUES (
  'Admin',
  'admin@college.local',
  '$2a$10$wH9dQG8i9v5dJvH2o5B1jO8T0pG9aK3w8YvH8m2pLxwH3vD8q5G8a',
  'ADMIN'
)
ON CONFLICT (email) DO NOTHING;