# N8N Setup Guide for SmartHaul

## 🚀 Quick Start

Your N8N service is now running and accessible at: **http://localhost:5679**

### Login Credentials
- **Username:** `admin`
- **Password:** `smarthaul123`

## 🔧 Database Configuration

### Step 1: Access N8N
1. Open your browser and go to: http://localhost:5679
2. Login with the credentials above

### Step 2: Configure Database Credentials
1. Go to **Settings** (gear icon) → **Credentials**
2. Click **Add Credential**
3. Select **PostgreSQL** from the list
4. Fill in the following details:

```
Name: SmartHaul Database
Host: smarthaul-database
Port: 5432
Database: smarthaul
User: wishsol
Password: smarthaul_password
```

5. Click **Save**

### Step 3: Import the Fixed Workflow
1. Go to **Workflows** in the main menu
2. Click **Import from File**
3. Select the file: `n8n-workflows/exports/smart-delivery-workflow-fixed.json`
4. The workflow will be imported with the correct database credentials

### Step 4: Test the Workflow
1. Click on the imported workflow
2. Click **Execute Workflow** (play button)
3. The workflow should now run without "Unauthorized" or "Lost connection" errors

## 🐛 Troubleshooting

### If you still get "Unauthorized" errors:
1. **Verify credentials are saved** - Check Settings → Credentials
2. **Check credential name** - Make sure it matches exactly: "SmartHaul Database"
3. **Verify database is running** - Run: `docker ps | grep smarthaul-database`

### If you get "Lost connection to the server":
1. **Check container status** - Run: `docker ps | grep n8n`
2. **Check N8N logs** - Run: `docker logs smarthaul-n8n --tail 20`
3. **Restart N8N** - Run: `docker-compose restart n8n`

### If the workflow doesn't trigger automatically:
1. **Check trigger settings** - The workflow is set to run every 30 minutes
2. **Manual execution** - You can manually trigger it by clicking Execute Workflow
3. **Check scheduler** - Verify the schedule trigger node is properly configured

## 📊 Database Status

To check if your database is working:
```bash
# Check container status
docker ps | grep smarthaul-database

# Check database content
docker exec smarthaul-database psql -U wishsol -d smarthaul -c "SELECT COUNT(*) FROM shipments;"

# Check N8N logs
docker logs smarthaul-n8n --tail 20
```

## 🔄 Workflow Details

The imported workflow will:
1. **Check every 30 minutes** for shipments in transit
2. **Update ETAs** by adding 2 hours (simulating weather delays)
3. **Create delivery events** for tracking
4. **Update predictions** with risk scores
5. **Handle errors** gracefully

## 📝 Next Steps

After successful setup:
1. **Monitor execution** - Check the Executions tab in N8N
2. **Customize workflow** - Modify the schedule, queries, or logic as needed
3. **Add more workflows** - Create additional automation for your SmartHaul operations

## 🆘 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review N8N logs: `docker logs smarthaul-n8n`
3. Verify database connectivity: `./scripts/test-n8n-connection.sh`
4. Restart services: `docker-compose restart` 