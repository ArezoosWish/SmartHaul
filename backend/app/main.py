from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings

app = FastAPI(
    title="SmartHaul API",
    debug=settings.debug
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok", "debug": settings.debug}

@app.get("/config")
def config():
    """Return non-sensitive configuration for frontend"""
    return {
        "n8n_base_url": settings.n8n_base_url,
        "api_port": settings.api_port,
        "debug": settings.debug
    }