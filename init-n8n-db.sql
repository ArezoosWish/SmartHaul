-- Initialize N8N database with required users and permissions
-- This script runs when the PostgreSQL container starts

-- Create additional database for SmartHaul if needed
CREATE DATABASE smarthaul_docker;

-- Grant permissions to N8N user
GRANT ALL PRIVILEGES ON DATABASE n8n TO n8n;
GRANT ALL PRIVILEGES ON DATABASE smarthaul_docker TO n8n;

-- Create a dedicated user for SmartHaul application
CREATE USER smarthaul_app WITH PASSWORD 'smarthaul_app_password';
GRANT ALL PRIVILEGES ON DATABASE smarthaul_docker TO smarthaul_app;

-- Set up extensions that N8N might need
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create some basic tables for N8N workflow management
CREATE TABLE IF NOT EXISTS n8n_workflow_metadata (
    id SERIAL PRIMARY KEY,
    workflow_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    tags JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_n8n_workflow_metadata_workflow_id 
ON n8n_workflow_metadata(workflow_id);

-- Grant permissions to N8N user
GRANT ALL PRIVILEGES ON TABLE n8n_workflow_metadata TO n8n;
GRANT USAGE, SELECT ON SEQUENCE n8n_workflow_metadata_id_seq TO n8n; 