from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://localhost:5432/smarthaul"
    database_test_url: str = "postgresql://localhost:5432/smarthaul_test"
    
    # API
    api_host: str = "127.0.0.1"
    api_port: int = 8000
    debug: bool = True
    secret_key: str = "your-secret-key-here-change-in-production"
    access_token_expire_minutes: int = 30
    
    # N8N
    n8n_base_url: str = "http://localhost:5678"
    n8n_webhook_url: str = "http://localhost:5678/webhook"
    n8n_api_key: str = "your-n8n-api-key"
    n8n_workspace_id: str = "your-workspace-id"
    
    # File Storage
    upload_dir: str = "./uploads"
    max_file_size: int = 10485760  # 10MB
    
    # Logging
    log_level: str = "INFO"
    log_file: str = "./logs/smarthaul.log"
    
    # CORS
    cors_origins: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings() 