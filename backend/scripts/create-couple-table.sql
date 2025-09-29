-- REACH2026 Couple Registrations Table
-- This table stores registration data for couples attending REACH2026

CREATE TABLE couple_registrations (
    id SERIAL PRIMARY KEY,
    
    -- Partner 1 Information
    partner1_name VARCHAR(255) NOT NULL,
    partner1_email VARCHAR(255) NOT NULL,
    partner1_phone VARCHAR(50) NOT NULL,
    partner1_gender VARCHAR(10) NOT NULL CHECK (partner1_gender IN ('Male', 'Female')),
    
    -- Partner 2 Information
    partner2_name VARCHAR(255) NOT NULL,
    partner2_email VARCHAR(255) NOT NULL,
    partner2_phone VARCHAR(50) NOT NULL,
    partner2_gender VARCHAR(10) NOT NULL CHECK (partner2_gender IN ('Male', 'Female')),
    
    -- Shared Information
    church VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    accommodation VARCHAR(50) NOT NULL DEFAULT 'dorm' CHECK (accommodation IN ('dorm', 'daypass')),
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('eft', 'cash', 'card')),
    
    -- Pricing
    total DECIMAL(10,2) NOT NULL DEFAULT 2600.00,
    
    -- Special Requirements
    dietary_requirements TEXT,
    special_needs TEXT,
    
    -- Check-in Information
    checked_in BOOLEAN DEFAULT FALSE,
    checkin_time TIMESTAMP,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT unique_couple_email UNIQUE (partner1_email, partner2_email),
    CONSTRAINT different_partners CHECK (partner1_email != partner2_email)
);

-- Create indexes for better performance
CREATE INDEX idx_couple_partner1_email ON couple_registrations(partner1_email);
CREATE INDEX idx_couple_partner2_email ON couple_registrations(partner2_email);
CREATE INDEX idx_couple_partner1_name ON couple_registrations(partner1_name);
CREATE INDEX idx_couple_partner2_name ON couple_registrations(partner2_name);
CREATE INDEX idx_couple_church ON couple_registrations(church);
CREATE INDEX idx_couple_country ON couple_registrations(country);
CREATE INDEX idx_couple_checked_in ON couple_registrations(checked_in);
CREATE INDEX idx_couple_created_at ON couple_registrations(created_at);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_couple_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_couple_updated_at 
    BEFORE UPDATE ON couple_registrations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_couple_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE couple_registrations IS 'Stores registration data for couples attending REACH2026';
COMMENT ON COLUMN couple_registrations.total IS 'Registration fee for couple (R2600)';
COMMENT ON COLUMN couple_registrations.accommodation IS 'Accommodation type: dorm or daypass';
COMMENT ON COLUMN couple_registrations.checked_in IS 'Whether the couple has checked in at the venue';
COMMENT ON COLUMN couple_registrations.checkin_time IS 'Timestamp when couple checked in';
