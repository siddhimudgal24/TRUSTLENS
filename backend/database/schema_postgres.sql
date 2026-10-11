-- TrustLens (ShelterX) Database Schema for PostgreSQL
-- Drop tables in reverse order of dependencies
DROP TABLE IF EXISTS emergency_alerts CASCADE;
DROP TABLE IF EXISTS shelter_reallocations CASCADE;
DROP TABLE IF EXISTS shelter_allocations CASCADE;
DROP TABLE IF EXISTS readiness_assessments CASCADE;
DROP TABLE IF EXISTS shelters CASCADE;
DROP TABLE IF EXISTS affected_populations CASCADE;
DROP TABLE IF EXISTS affected_zones CASCADE;
DROP TABLE IF EXISTS disasters CASCADE;
DROP TABLE IF EXISTS otp_verifications CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- ========================================================
-- Module 1: User Authentication & Role Management
-- ========================================================
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    role_id INT NOT NULL REFERENCES roles(role_id),
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE otp_verifications (
    otp_id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    otp_code VARCHAR(10) NOT NULL,
    purpose VARCHAR(30) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- Module 2: Disaster & Affected Population Management
-- ========================================================
CREATE TABLE disasters (
    disaster_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    location_name VARCHAR(150) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    description TEXT,
    created_by INT REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE affected_zones (
    zone_id SERIAL PRIMARY KEY,
    disaster_id INT NOT NULL REFERENCES disasters(disaster_id) ON DELETE CASCADE,
    zone_name VARCHAR(100) NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    estimated_affected_count INT DEFAULT 0,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8)
);

CREATE TABLE affected_populations (
    population_group_id SERIAL PRIMARY KEY,
    zone_id INT NOT NULL REFERENCES affected_zones(zone_id) ON DELETE CASCADE,
    family_head_name VARCHAR(100) NOT NULL,
    contact_number VARCHAR(20),
    family_members_count INT NOT NULL,
    vulnerable_members_count INT DEFAULT 0,
    priority_level INT DEFAULT 1,
    special_requirements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- Module 3: Shelter Management & Readiness Assessment
-- ========================================================
CREATE TABLE shelters (
    shelter_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    location_address VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    total_capacity INT NOT NULL,
    current_occupancy INT DEFAULT 0,
    status VARCHAR(30) DEFAULT 'OPERATIONAL',
    water_supply_rating INT DEFAULT 5,
    food_capacity_days INT DEFAULT 7,
    medical_facility_rating INT DEFAULT 5,
    structural_safety_score DECIMAL(5,2) DEFAULT 100.0,
    readiness_score DECIMAL(5,2) DEFAULT 0.0,
    manager_id INT REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE readiness_assessments (
    assessment_id SERIAL PRIMARY KEY,
    shelter_id INT NOT NULL REFERENCES shelters(shelter_id) ON DELETE CASCADE,
    assessor_id INT NOT NULL REFERENCES users(user_id),
    safety_factor DECIMAL(5,2) NOT NULL,
    accessibility_factor DECIMAL(5,2) NOT NULL,
    hazard_risk_factor DECIMAL(5,2) NOT NULL,
    calculated_score DECIMAL(5,2) NOT NULL,
    remarks TEXT,
    assessment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- Module 4: Intelligent Shelter Allocation
-- ========================================================
CREATE TABLE shelter_allocations (
    allocation_id SERIAL PRIMARY KEY,
    disaster_id INT NOT NULL REFERENCES disasters(disaster_id),
    population_group_id INT NOT NULL REFERENCES affected_populations(population_group_id),
    shelter_id INT NOT NULL REFERENCES shelters(shelter_id),
    allocated_count INT NOT NULL,
    status VARCHAR(30) DEFAULT 'ALLOCATED',
    allocated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    allocated_by INT REFERENCES users(user_id)
);

-- ========================================================
-- Module 5: Emergency Reallocation, Alerts & Reports
-- ========================================================
CREATE TABLE shelter_reallocations (
    reallocation_id SERIAL PRIMARY KEY,
    original_allocation_id INT NOT NULL REFERENCES shelter_allocations(allocation_id),
    from_shelter_id INT NOT NULL REFERENCES shelters(shelter_id),
    to_shelter_id INT NOT NULL REFERENCES shelters(shelter_id),
    reallocated_count INT NOT NULL,
    reason TEXT NOT NULL,
    reallocated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reallocated_by INT REFERENCES users(user_id)
);

CREATE TABLE emergency_alerts (
    alert_id SERIAL PRIMARY KEY,
    shelter_id INT REFERENCES shelters(shelter_id) ON DELETE CASCADE,
    disaster_id INT REFERENCES disasters(disaster_id) ON DELETE CASCADE,
    severity VARCHAR(20) NOT NULL,
    alert_message VARCHAR(255) NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial Roles
INSERT INTO roles (role_id, role_name, description) VALUES
(1, 'ADMIN', 'System Administrator with full access'),
(2, 'DISASTER_MANAGER', 'Manages disasters, zones, and population metrics'),
(3, 'SHELTER_MANAGER', 'Manages specific shelter details and readiness updates'),
(4, 'FIELD_OFFICER', 'Executes allocations and field inspections')
ON CONFLICT (role_id) DO NOTHING;

-- Initial Admin (Password: admin123)
INSERT INTO users (username, email, password_hash, full_name, role_id) VALUES
('admin', 'admin@trustlens.org', '$2a$10$E2UPv7arXym3L0.yN3N6.uTjQd3kU3F9q.u4Wp2pQZ3l/K4G.YQnC', 'System Administrator', 1)
ON CONFLICT (username) DO NOTHING;

-- Sample Shelters
INSERT INTO shelters (name, location_address, latitude, longitude, total_capacity, current_occupancy, status, readiness_score) VALUES
('Central Community Hall', '124 Main Street, Sector 4', 18.52043, 73.85674, 500, 120, 'OPERATIONAL', 92.50),
('St. Mary High School Complex', '88 Hill View Road', 18.53120, 73.84410, 800, 450, 'OPERATIONAL', 88.00),
('Westside Stadium Indoor Arena', 'Stadium Complex, Sector 9', 18.51100, 73.87100, 1500, 1450, 'NEAR_CAPACITY', 78.30);
