# SmartHaul - Intelligent Document & Delivery Management System

A comprehensive logistics platform that digitalizes paper-based workflows while providing predictive intelligence for delivery operations.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL (local or cloud)
- N8N (for workflow automation)

### Setup

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd SmartHaul

# Frontend
cd frontend
npm install

# Backend
cd ../backend
python3 -m venv ../.venv
source ../.venv/bin/activate
pip install -r requirements.txt
```

2. **Configure environment**
```bash
cp env.example .env
# Edit .env with your database and N8N credentials
```

3. **Start N8N Services** (Required for workflow automation)
```bash
./scripts/start-n8n.sh
# Access N8N at: http://localhost:5678 (admin/smarthaul123)
```

4. **Start services**
```bash
# Backend (Terminal 1)
cd backend
source ../.venv/bin/activate
python seed_db.py  # Seed database with sample data
uvicorn app.main:app --reload --port 8000

# Frontend (Terminal 2)
cd frontend
npm run dev
```

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite
- **Backend**: FastAPI + Python
- **Database**: PostgreSQL
- **Automation**: N8N workflows
- **Design System**: Custom tokens and components

## 🔧 N8N Integration

N8N workflows are embedded directly into the SmartHaul UI:
- **Embedded Workflow Editor**: Full N8N interface within the application
- **Workflow Dashboard**: Visual management of automation workflows
- **Real-time Monitoring**: Live execution status and metrics
- **Seamless Integration**: Direct communication between SmartHaul and N8N

### N8N Services
- **Workflow Editor**: http://localhost:5678
- **API Endpoints**: http://localhost:5678/api/v1
- **Default Credentials**: admin / smarthaul123

## 📁 Project Structure

```
SmartHaul/
├── frontend/          # React application
├── backend/           # FastAPI application
├── design-system/     # Design tokens and components
├── n8n-workflows/     # N8N workflow exports and templates
├── scripts/           # Utility scripts (start/stop N8N)
├── phase1_foundation/ # Phase documentation
├── docker-compose.yml # N8N services configuration
├── env.example        # Environment template
└── README.md         # This file
```

## 🎯 Features

- **Document Processing**: OCR with intelligent data extraction
- **Real-time Tracking**: Live shipment monitoring
- **Predictive Analytics**: ML-based delay prediction
- **Digital Chain of Custody**: QR codes and signatures
- **Workflow Automation**: N8N-powered processes
- **Analytics Dashboard**: KPI monitoring and reporting

## 📊 Development Progress

See `project_tasks.md` for detailed task breakdown and progress tracking. 