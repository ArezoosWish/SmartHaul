#!/bin/bash

# Script to stop all N8N workflows and clear executions
echo "🛑 Stopping all N8N workflows..."
echo "=================================="

# Check if N8N is running
if ! curl -s http://localhost:5679/healthz > /dev/null; then
    echo "❌ N8N is not running. Please start it first."
    exit 1
fi

echo "📊 Step 1: Checking current workflow status..."
echo "N8N is accessible at: http://localhost:5679"
echo "Login: admin / smarthaul123"
echo ""
echo "📋 Manual steps to stop all workflows:"
echo "1. Open N8N in your browser: http://localhost:5679"
echo "2. Login with admin/smarthaul123"
echo "3. Go to Workflows tab"
echo "4. For each active workflow:"
echo "   - Click on the workflow"
echo "5. Click the 'Stop' button (square icon) to deactivate it"
echo "6. Or click the three dots menu → 'Deactivate'"
echo ""
echo "📋 To clear executions:"
echo "1. Go to Executions tab"
echo "2. Click 'Clear All' to remove old execution data"
echo ""
echo "📋 After stopping all workflows:"
echo "1. Import only the fixed workflow: smart-delivery-workflow-fixed.json"
echo "2. Activate only that workflow"
echo "3. Test it manually first"
echo ""
echo "🔧 Alternative: Restart N8N to clear all workflows"
echo "   docker-compose restart n8n"
echo ""
echo "✅ This will prevent the foreign key constraint errors from old workflows." 