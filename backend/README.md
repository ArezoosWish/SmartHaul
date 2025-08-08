# SmartHaul Backend (FastAPI)

## Setup

```bash
cd backend
python3 -m venv ../.venv
source ../.venv/bin/activate
pip install -U pip 'uvicorn[standard]' fastapi 'pydantic[dotenv]' sqlalchemy 'psycopg[binary]' alembic
```

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

## Endpoints
- GET `/health` → { status: "ok" }