-- Multiball Academy Registration Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sessions table (camp sessions)
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  time_start TIME NOT NULL DEFAULT '09:00',
  time_end TIME NOT NULL DEFAULT '15:00',
  capacity INTEGER NOT NULL DEFAULT 12,
  price_cents INTEGER NOT NULL DEFAULT 29500,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'full', 'closed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert the June 2026 session
INSERT INTO sessions (id, name, start_date, end_date, capacity, price_cents, status)
VALUES ('summer-2026-june', 'Summer Camp 2026', '2026-06-29', '2026-07-03', 12, 29500, 'open')
ON CONFLICT (id) DO UPDATE SET start_date = '2026-06-29', end_date = '2026-07-03', name = 'Summer Camp 2026';

-- Registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id TEXT PRIMARY KEY,
  registration_group_id TEXT, -- Links siblings in same registration
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'refunded', 'waitlist')),
  session_id TEXT NOT NULL REFERENCES sessions(id),
  is_test BOOLEAN NOT NULL DEFAULT FALSE, -- True for test registrations
  is_sibling BOOLEAN NOT NULL DEFAULT FALSE, -- True for 2nd+ campers
  price_cents INTEGER, -- Individual price for this camper
  
  -- Parent/Guardian
  parent_first_name TEXT NOT NULL,
  parent_last_name TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  
  -- Camper
  camper_first_name TEXT NOT NULL,
  camper_last_name TEXT NOT NULL,
  camper_birthdate DATE NOT NULL,
  camper_age INTEGER NOT NULL,
  camper_grade TEXT,
  tshirt_size TEXT NOT NULL,
  
  -- Emergency Contact
  emergency_name TEXT NOT NULL,
  emergency_phone TEXT NOT NULL,
  emergency_relation TEXT NOT NULL,
  
  -- Medical
  allergies TEXT,
  medications TEXT,
  medical_conditions TEXT,
  doctor_name TEXT,
  doctor_phone TEXT,
  insurance_provider TEXT,
  insurance_policy_number TEXT,
  
  -- Agreements
  photo_release BOOLEAN NOT NULL DEFAULT FALSE,
  liability_waiver BOOLEAN NOT NULL DEFAULT FALSE,
  code_of_conduct BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Meta
  how_heard TEXT,
  additional_notes TEXT,
  
  -- Payment
  stripe_checkout_session_id TEXT,
  stripe_payment_intent_id TEXT,
  amount_paid INTEGER,
  paid_at TIMESTAMPTZ
);

-- Create index for common queries
CREATE INDEX IF NOT EXISTS idx_registrations_session ON registrations(session_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(parent_email);
CREATE INDEX IF NOT EXISTS idx_registrations_group ON registrations(registration_group_id);
CREATE INDEX IF NOT EXISTS idx_registrations_test ON registrations(is_test);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS registrations_updated_at ON registrations;
CREATE TRIGGER registrations_updated_at
  BEFORE UPDATE ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Row Level Security (optional but recommended)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role full access" ON registrations
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON sessions
  FOR ALL
  USING (auth.role() = 'service_role');

-- View for admin dashboard
CREATE OR REPLACE VIEW registration_summary AS
SELECT 
  s.id as session_id,
  s.name as session_name,
  s.start_date,
  s.capacity,
  s.status as session_status,
  COUNT(r.id) FILTER (WHERE r.status = 'paid') as paid_count,
  COUNT(r.id) FILTER (WHERE r.status = 'pending') as pending_count,
  s.capacity - COUNT(r.id) FILTER (WHERE r.status IN ('paid', 'pending')) as spots_remaining
FROM sessions s
LEFT JOIN registrations r ON r.session_id = s.id
GROUP BY s.id, s.name, s.start_date, s.capacity, s.status;
