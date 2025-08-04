-- Create individual registrations table if it doesn't exist
CREATE OR REPLACE FUNCTION create_individual_registrations_table_if_not_exists()
RETURNS void AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'individual_registrations'
    ) THEN
        CREATE TABLE individual_registrations (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            email VARCHAR(100),
            phone VARCHAR(50),
            church VARCHAR(100),
            country VARCHAR(100),
            emergencyName VARCHAR(100),
            emergencyContact VARCHAR(100),
            indemnity BOOLEAN,
            accommodation VARCHAR(20),
            bedding BOOLEAN,
            dayPass TEXT,
            payment VARCHAR(20),
            commitment VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create group registrations table if it doesn't exist
CREATE OR REPLACE FUNCTION create_group_registrations_table_if_not_exists()
RETURNS void AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'group_registrations'
    ) THEN
        CREATE TABLE group_registrations (
            id SERIAL PRIMARY KEY,
            leader_name VARCHAR(100),
            leader_email VARCHAR(100),
            leader_phone VARCHAR(50),
            leader_church VARCHAR(100),
            leader_country VARCHAR(100),
            accommodation VARCHAR(20),
            payment VARCHAR(20),
            total DECIMAL(10,2),
            discount DECIMAL(10,2),
            members TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    END IF;
END;
$$ LANGUAGE plpgsql;
