#!/bin/bash

# Setup script for N8N SmartHaul Database Connection
# This script helps configure N8N to connect to the SmartHaul database

echo "🔧 Setting up N8N Database Connection for SmartHaul..."
echo "======================================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "📊 Step 1: Stopping current N8N service..."
docker-compose down n8n

echo "📊 Step 2: Starting SmartHaul database service..."
docker-compose up -d smarthaul-db

echo "📊 Step 3: Waiting for database to be ready..."
sleep 10

echo "📊 Step 4: Starting N8N service..."
docker-compose up -d n8n

echo "📊 Step 5: Waiting for N8N to be ready..."
sleep 15

echo "✅ Setup completed!"
echo ""
echo "🌐 N8N is now accessible at: http://localhost:5679"
echo "👤 Username: admin"
echo "🔑 Password: smarthaul123"
echo ""
echo "📋 Next steps:"
echo "1. Open N8N in your browser: http://localhost:5679"
echo "2. Go to Settings > Credentials"
echo "3. Add new PostgreSQL credential:"
echo "   - Name: SmartHaul Database"
echo "   - Host: smarthaul-db (or host.docker.internal:5434)"
echo "   - Port: 5432"
echo "   - Database: smarthaul"
echo "   - User: wishsol"
echo "   - Password: smarthaul_password"
echo "4. Import the fixed workflow: smart-delivery-workflow-fixed.json"
echo "5. Test the workflow execution"
echo ""
echo "🔍 To check if everything is working:"
echo "   docker logs smarthaul-n8n --tail 20"
echo ""
echo "📊 To check database status:"
echo "   docker exec smarthaul-database psql -U wishsol -d smarthaul -c 'SELECT COUNT(*) FROM shipments;'" 