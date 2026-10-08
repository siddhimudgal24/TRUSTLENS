-- TrustLens (ShelterX) Database Schema
-- Modules:
-- Module 1: User Authentication & Role Management
-- Module 2: Disaster & Affected Population Management
-- Module 3: Shelter Management & Readiness Assessment
-- Module 4: Intelligent Shelter Allocation
-- Module 5: Emergency Reallocation, Alerts & Reports

CREATE DATABASE IF NOT EXISTS trustlens_db;
USE trustlens_db;

-- Drop tables in reverse order of dependencies if re-executing
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS emergency_alerts;
DROP TABLE IF EXISTS shelter_reallocations;
DROP TABLE IF EXISTS shelter_allocations;
DROP TABLE IF EXISTS readiness_assessments;
DROP TABLE IF EXISTS shelters;
DROP TABLE IF EXISTS affected_populations;
DROP TABLE IF EXISTS affected_zones;
DROP TABLE IF EXISTS disasters;
DROP TABLE IF EXISTS otp_verifications;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
SET FOREIGN_KEY_CHECKS = 1;

-- ========================================================
-- Module 1: User Authentication & Role Management
-- ========================================================
CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE, -- 'ADMIN', 'DISASTER_MANAGER', 'SHELTER_MANAGER', 'FIELD_OFFICER'
    description VARCHAR(255)
);

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    role_id INT NOT NULL,
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

CREATE TABLE otp_verifications (
    otp_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    otp_code VARCHAR(10) NOT NULL,
    purpose VARCHAR(30) NOT NULL, -- 'REGISTRATION', 'PASSWORD_RESET'
    expires_at DATETIME NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- Module 2: Disaster & Affected Population Management
-- ========================================================
CREATE TABLE disasters (
    disaster_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    type VARCHAR(50) NOT NULL, -- e.g., Flood, Earthquake, Cyclone, Fire
    severity VARCHAR(20) NOT NULL, -- 'LOW', 'MODERATE', 'HIGH', 'CRITICAL'
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'CONTAINED', 'RESOLVED'
    location_name VARCHAR(150) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    start_date DATETIME NOT NULL,
    end_date DATETIME,
    description TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

CREATE TABLE affected_zones (
    zone_id INT AUTO_INCREMENT PRIMARY KEY,
    disaster_id INT NOT NULL,
    zone_name VARCHAR(100) NOT NULL,
    risk_level VARCHAR(20) NOT NULL, -- 'LOW', 'MEDIUM', 'HIGH', 'SEVERE'
    estimated_affected_count INT DEFAULT 0,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    FOREIGN KEY (disaster_id) REFERENCES disasters(disaster_id) ON DELETE CASCADE
);

CREATE TABLE affected_populations (
    population_group_id INT AUTO_INCREMENT PRIMARY KEY,
    zone_id INT NOT NULL,
    family_head_name VARCHAR(100) NOT NULL,
    contact_number VARCHAR(20),
    family_members_count INT NOT NULL,
    vulnerable_members_count INT DEFAULT 0, -- Elderly, pregnant, disabled, children
    priority_level INT DEFAULT 1, -- 1 (Highest priority) to 5
    special_requirements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (zone_id) REFERENCES affected_zones(zone_id) ON DELETE CASCADE
);

-- ========================================================
-- Module 3: Shelter Management & Readiness Assessment
-- ========================================================
CREATE TABLE shelters (
    shelter_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    location_address VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    total_capacity INT NOT NULL,
    current_occupancy INT DEFAULT 0,
    status VARCHAR(30) DEFAULT 'OPERATIONAL', -- 'OPERATIONAL', 'NEAR_CAPACITY', 'FULL', 'UNSAFE', 'CLOSED'
    water_supply_rating INT DEFAULT 5, -- 1-5
    food_capacity_days INT DEFAULT 7,
    medical_facility_rating INT DEFAULT 5, -- 1-5
    structural_safety_score DECIMAL(5,2) DEFAULT 100.0,
    readiness_score DECIMAL(5,2) DEFAULT 0.0,
    manager_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES users(user_id)
);

CREATE TABLE readiness_assessments (
    assessment_id INT AUTO_INCREMENT PRIMARY KEY,
    shelter_id INT NOT NULL,
    assessor_id INT NOT NULL,
    safety_factor DECIMAL(5,2) NOT NULL,
    accessibility_factor DECIMAL(5,2) NOT NULL,
    hazard_risk_factor DECIMAL(5,2) NOT NULL,
    calculated_score DECIMAL(5,2) NOT NULL,
    remarks TEXT,
    assessment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shelter_id) REFERENCES shelters(shelter_id) ON DELETE CASCADE,
    FOREIGN KEY (assessor_id) REFERENCES users(user_id)
);

-- ========================================================
-- Module 4: Intelligent Shelter Allocation
-- ========================================================
CREATE TABLE shelter_allocations (
    allocation_id INT AUTO_INCREMENT PRIMARY KEY,
    disaster_id INT NOT NULL,
    population_group_id INT NOT NULL,
    shelter_id INT NOT NULL,
    allocated_count INT NOT NULL,
    status VARCHAR(30) DEFAULT 'ALLOCATED', -- 'ALLOCATED', 'CHECKED_IN', 'REALLOCATED', 'COMPLETED'
    allocated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    allocated_by INT,
    FOREIGN KEY (disaster_id) REFERENCES disasters(disaster_id),
    FOREIGN KEY (population_group_id) REFERENCES affected_populations(population_group_id),
    FOREIGN KEY (shelter_id) REFERENCES shelters(shelter_id),
    FOREIGN KEY (allocated_by) REFERENCES users(user_id)
);

-- ========================================================
-- Module 5: Emergency Reallocation, Alerts & Reports
-- ========================================================
CREATE TABLE shelter_reallocations (
    reallocation_id INT AUTO_INCREMENT PRIMARY KEY,
    original_allocation_id INT NOT NULL,
    from_shelter_id INT NOT NULL,
    to_shelter_id INT NOT NULL,
    reallocated_count INT NOT NULL,
    reason TEXT NOT NULL, -- e.g. "Shelter structural damage alert", "Capacity exceeded"
    reallocated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reallocated_by INT,
    FOREIGN KEY (original_allocation_id) REFERENCES shelter_allocations(allocation_id),
    FOREIGN KEY (from_shelter_id) REFERENCES shelters(shelter_id),
    FOREIGN KEY (to_shelter_id) REFERENCES shelters(shelter_id),
    FOREIGN KEY (reallocated_by) REFERENCES users(user_id)
);

CREATE TABLE emergency_alerts (
    alert_id INT AUTO_INCREMENT PRIMARY KEY,
    shelter_id INT,
    disaster_id INT,
    severity VARCHAR(20) NOT NULL, -- 'INFO', 'WARNING', 'CRITICAL'
    alert_message VARCHAR(255) NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shelter_id) REFERENCES shelters(shelter_id) ON DELETE CASCADE,
    FOREIGN KEY (disaster_id) REFERENCES disasters(disaster_id) ON DELETE CASCADE
);

-- Initial Seed Data: Roles & Admin User
INSERT INTO roles (role_id, role_name, description) VALUES
(1, 'ADMIN', 'System Administrator with full access'),
(2, 'DISASTER_MANAGER', 'Manages disasters, zones, and population metrics'),
(3, 'SHELTER_MANAGER', 'Manages specific shelter details and readiness updates'),
(4, 'FIELD_OFFICER', 'Executes allocations and field inspections');

-- Password for admin is 'admin123' (BCrypt hashed string below: $2a$10$vN9gWz8W4P1s4x... standard sample hash)
INSERT INTO users (username, email, password_hash, full_name, role_id) VALUES
('admin', 'admin@trustlens.org', '$2a$10$E2UPv7arXym3L0.yN3N6.uTjQd3kU3F9q.u4Wp2pQZ3l/K4G.YQnC', 'System Administrator', 1);

-- Sample Shelters
INSERT INTO shelters (name, location_address, latitude, longitude, total_capacity, current_occupancy, status, readiness_score) VALUES
('Central Community Hall', '124 Main Street, Sector 4', 18.52043, 73.85674, 500, 120, 'OPERATIONAL', 92.50),
('St. Mary High School Complex', '88 Hill View Road', 18.53120, 73.84410, 800, 450, 'OPERATIONAL', 88.00),
('Westside Stadium Indoor Arena', 'Stadium Complex, Sector 9', 18.51100, 73.87100, 1500, 1450, 'NEAR_CAPACITY', 78.30);
