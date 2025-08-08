#!/bin/bash

# SmartHaul N8N Startup Script
# This script starts the N8N services using Docker Compose

set -e

echo "🚀 Starting SmartHaul N8N Services..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml not found. Please run this script from the project root."
    exit 1
fi

# Create necessary directories
mkdir -p n8n-workflows/exports
mkdir -p n8n-workflows/templates
mkdir -p n8n-workflows/config

# Start services
echo "📦 Starting N8N, PostgreSQL, and Redis containers..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

# Display access information
echo ""
echo "✅ N8N Services Started Successfully!"
echo ""
echo "🌐 Access URLs:"
echo "   N8N Workflow Editor: http://localhost:5679"
echo "   N8N API: http://localhost:5679/api/v1"
echo "   PostgreSQL (N8N): localhost:5433"
echo "   Redis: localhost:6379"
echo ""
echo "🔐 Default Credentials:"
echo "   Username: admin"
echo "   Password: smarthaul123"
echo ""
echo "📁 Workflow Directory: ./n8n-workflows/"
echo ""
echo "🛑 To stop services: docker-compose down"
echo "📊 To view logs: docker-compose logs -f" 