-- SmartHaul Database Initialization Script
-- This script sets up the initial database structure for SmartHaul

-- Create the smarthaul database if it doesn't exist
-- (PostgreSQL creates the database automatically from environment variables)

-- Create tables based on the models
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'driver',
    company_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shipments (
    id SERIAL PRIMARY KEY,
    tracking_number VARCHAR(100) UNIQUE NOT NULL,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    eta TIMESTAMP WITH TIME ZONE,
    actual_delivery_time TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS trucks (
    id SERIAL PRIMARY KEY,
    plate_number VARCHAR(20) UNIQUE NOT NULL,
    current_lat DOUBLE PRECISION,
    current_lng DOUBLE PRECISION,
    driver_id INTEGER REFERENCES users(id),
    status VARCHAR(50) NOT NULL DEFAULT 'available',
    temperature DOUBLE PRECISION
);

CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    shipment_id INTEGER NOT NULL REFERENCES shipments(id),
    type VARCHAR(100) NOT NULL,
    original_url VARCHAR(500) NOT NULL,
    extracted_data JSONB,
    processed_at TIMESTAMP WITH TIME ZONE,
    verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS delivery_events (
    id SERIAL PRIMARY KEY,
    shipment_id INTEGER NOT NULL REFERENCES shipments(id),
    event_type VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    location VARCHAR(255),
    signature_url VARCHAR(500),
    notes TEXT
);

CREATE TABLE IF NOT EXISTS predictions (
    id SERIAL PRIMARY KEY,
    shipment_id INTEGER NOT NULL REFERENCES shipments(id),
    predicted_delay INTEGER,
    risk_score DOUBLE PRECISION,
    factors JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking ON shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_delivery_events_shipment ON delivery_events(shipment_id);
CREATE INDEX IF NOT EXISTS idx_predictions_shipment ON predictions(shipment_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_trucks_plate ON trucks(plate_number);

-- Insert sample data if tables are empty
INSERT INTO users (email, role) 
SELECT 'admin@smarthaul.com', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@smarthaul.com');

INSERT INTO users (email, role) 
SELECT 'driver1@smarthaul.com', 'driver'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'driver1@smarthaul.com');

INSERT INTO users (email, role) 
SELECT 'dispatcher@smarthaul.com', 'dispatcher'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'dispatcher@smarthaul.com');

-- Insert sample shipments if they don't exist
INSERT INTO shipments (tracking_number, origin, destination, status, eta) 
SELECT 'SH001', 'New York, NY', 'Los Angeles, CA', 'in_transit', CURRENT_TIMESTAMP + INTERVAL '2 days'
WHERE NOT EXISTS (SELECT 1 FROM shipments WHERE tracking_number = 'SH001');

INSERT INTO shipments (tracking_number, origin, destination, status, eta) 
SELECT 'SH002', 'Chicago, IL', 'Miami, FL', 'pending', CURRENT_TIMESTAMP + INTERVAL '3 days'
WHERE NOT EXISTS (SELECT 1 FROM shipments WHERE tracking_number = 'SH002');

INSERT INTO shipments (tracking_number, origin, destination, status, eta) 
SELECT 'SH003', 'Houston, TX', 'Seattle, WA', 'delivered', CURRENT_TIMESTAMP - INTERVAL '1 day'
WHERE NOT EXISTS (SELECT 1 FROM shipments WHERE tracking_number = 'SH003');

-- Insert sample delivery events
INSERT INTO delivery_events (shipment_id, event_type, location, notes)
SELECT s.id, 'pickup', s.origin, 'Package picked up from warehouse'
FROM shipments s 
WHERE s.tracking_number = 'SH001' 
AND NOT EXISTS (
    SELECT 1 FROM delivery_events de 
    WHERE de.shipment_id = s.id AND de.event_type = 'pickup'
);

-- Insert sample predictions
INSERT INTO predictions (shipment_id, predicted_delay, risk_score, factors)
SELECT s.id, 15, 0.3, '{"weather": "clear", "traffic": "normal"}'
FROM shipments s 
WHERE s.tracking_number = 'SH001' 
AND NOT EXISTS (
    SELECT 1 FROM predictions p 
    WHERE p.shipment_id = s.id
);

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO wishsol;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO wishsol;
GRANT ALL PRIVILEGES ON SCHEMA public TO wishsol;

-- Set ownership
ALTER TABLE users OWNER TO wishsol;
ALTER TABLE shipments OWNER TO wishsol;
ALTER TABLE trucks OWNER TO wishsol;
ALTER TABLE documents OWNER TO wishsol;
ALTER TABLE delivery_events OWNER TO wishsol;
ALTER TABLE predictions OWNER TO wishsol; 