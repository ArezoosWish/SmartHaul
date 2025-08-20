#!/bin/bash

# Final N8N Setup Script for SmartHaul
echo "🚀 Final N8N Setup for SmartHaul"
echo "=================================="

# Check if services are running
echo "📊 Checking service status..."
if docker ps | grep -q "smarthaul-n8n"; then
    echo "✅ N8N is running"
else
    echo "❌ N8N is not running"
    exit 1
fi

if docker ps | grep -q "smarthaul-database"; then
    echo "✅ SmartHaul database is running"
else
    echo "❌ SmartHaul database is not running"
    exit 1
fi

echo ""
echo "🌐 N8N is now accessible at: http://localhost:5679"
echo "👤 Login credentials: admin / smarthaul123"
echo ""

echo "📋 Step-by-Step Setup Instructions:"
echo "===================================="
echo ""
echo "1️⃣  FIRST: Open N8N in your browser"
echo "   URL: http://localhost:5679"
echo "   Login: admin / smarthaul123"
echo ""
echo "2️⃣  SECOND: Configure Database Credentials"
echo "   - Go to Settings (gear icon) → Credentials"
echo "   - Click 'Add Credential'"
echo "   - Select 'PostgreSQL'"
echo "   - Fill in these exact details:"
echo "     • Name: SmartHaul Database"
echo "     • Host: smarthaul-database"
echo "     • Port: 5432"
echo "     • Database: smarthaul"
echo "     • User: wishsol"
echo "     • Password: smarthaul_password"
echo "   - Click 'Save'"
echo ""
echo "3️⃣  THIRD: Import the Fixed Workflow"
echo "   - Go to Workflows tab"
echo "   - Click 'Import from File'"
echo "   - Select: n8n-workflows/exports/smart-delivery-workflow-fixed.json"
echo "   - The workflow will be imported with the correct credentials"
echo ""
echo "4️⃣  FOURTH: Test the Workflow"
echo "   - Click on the imported workflow"
echo "   - Click 'Execute Workflow' (play button)"
echo "   - Check the execution log for any errors"
echo ""
echo "5️⃣  FIFTH: Activate the Workflow (Optional)"
echo "   - Click the 'Activate' button (toggle switch)"
echo "   - This will make it run automatically every 30 minutes"
echo ""

echo "🔧 Troubleshooting Commands:"
echo "============================"
echo "• Check N8N status: curl http://localhost:5679/healthz"
echo "• Check N8N logs: docker logs smarthaul-n8n --tail 20"
echo "• Check database: docker exec smarthaul-database psql -U wishsol -d smarthaul -c 'SELECT COUNT(*) FROM shipments;'"
echo "• Restart N8N: docker-compose restart n8n"
echo ""

echo "✅ What This Fixes:"
echo "==================="
echo "• ❌ 'Lost connection to the server' - FIXED by clean restart"
echo "• ❌ 'Unauthorized' errors - FIXED by proper credentials"
echo "• ❌ Foreign key constraint violations - FIXED by removing old workflows"
echo "• ❌ Port conflicts - FIXED by consistent configuration"
echo ""

echo "🎯 Expected Result:"
echo "==================="
echo "After following these steps, the workflow should:"
echo "• Execute successfully without errors"
echo "• Create delivery events in the database"
echo "• Update shipment ETAs"
echo "• Generate predictions"
echo "• Run automatically every 30 minutes (if activated)"
echo ""

echo "🚨 Important Notes:"
echo "==================="
echo "• Only import the 'smart-delivery-workflow-fixed.json' file"
echo "• Do NOT import any other workflow files yet"
echo "• Make sure the credential name is exactly 'SmartHaul Database'"
echo "• Test manually before activating automatic execution"
echo ""

echo "🎉 You're all set! Follow the steps above and let me know if you encounter any issues." 