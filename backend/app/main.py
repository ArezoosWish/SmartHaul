from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from sqlalchemy.orm import Session
from .core.config import settings
from .core.performance import PerformanceMiddleware
from .models.base import get_db
from .models.tables import Shipment, DeliveryEvent, Truck, User, Document, Prediction
from .api import performance, notifications, fleet, shipments

app = FastAPI(
    title="SmartHaul API",
    description="Intelligent document & delivery management system",
    version="1.0.0",
    debug=settings.debug
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add performance optimization middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)
# app.add_middleware(PerformanceMiddleware)  # Temporarily disabled

# Include performance monitoring routes
app.include_router(performance.router)

# Include notifications routes
app.include_router(notifications.router, prefix="/api/notifications", tags=["notifications"])

# Include fleet management routes
app.include_router(fleet.router, prefix="/api/fleet", tags=["fleet"])

# Include shipment management routes
app.include_router(shipments.router, prefix="/api/shipments", tags=["shipments"])

@app.get("/")
async def root():
    return {"message": "SmartHaul API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "SmartHaul API is operational"}

@app.get("/config")
async def get_config():
    """Return non-sensitive configuration for frontend"""
    return {
        "api_host": settings.api_host,
        "api_port": settings.api_port,
        "n8n_base_url": settings.n8n_base_url,
        "database_url": settings.database_url.replace(settings.database_url.split('@')[0].split('://')[1], '***') if '@' in settings.database_url else settings.database_url
    }

@app.get("/shipments")
async def get_shipments(db: Session = Depends(get_db)):
    """Get all shipments from the database"""
    try:
        shipments = db.query(Shipment).all()
        return [
            {
                "id": shipment.id,
                "tracking_number": shipment.tracking_number,
                "origin": shipment.origin,
                "destination": shipment.destination,
                "status": shipment.status,
                "created_at": shipment.created_at.isoformat() if shipment.created_at else None,
                "eta": shipment.eta.isoformat() if shipment.eta else None,
                "actual_delivery_time": shipment.actual_delivery_time.isoformat() if shipment.actual_delivery_time else None
            }
            for shipment in shipments
        ]
    except Exception as e:
        return {"error": f"Failed to fetch shipments: {str(e)}"}

@app.get("/delivery-events")
async def get_delivery_events(db: Session = Depends(get_db)):
    """Get all delivery events from the database"""
    try:
        events = db.query(DeliveryEvent).all()
        return [
            {
                "id": event.id,
                "shipment_id": event.shipment_id,
                "event_type": event.event_type,
                "timestamp": event.timestamp.isoformat() if event.timestamp else None,
                "location": event.location,
                "notes": event.notes,
                "signature_url": event.signature_url
            }
            for event in events
        ]
    except Exception as e:
        return {"error": f"Failed to fetch delivery events: {str(e)}"}

@app.get("/trucks")
async def get_trucks(db: Session = Depends(get_db)):
    """Get all trucks from the database"""
    try:
        trucks = db.query(Truck).all()
        return [
            {
                "id": truck.id,
                "plate_number": truck.plate_number,
                "status": truck.status,
                "current_lat": truck.current_lat,
                "current_lng": truck.current_lng,
                "temperature": truck.temperature
            }
            for truck in trucks
        ]
    except Exception as e:
        return {"error": f"Failed to fetch trucks: {str(e)}"}

@app.get("/users")
async def get_users(db: Session = Depends(get_db)):
    """Get all users from the database"""
    try:
        users = db.query(User).all()
        return [
            {
                "id": user.id,
                "email": user.email,
                "role": user.role,
                "created_at": user.created_at.isoformat() if user.created_at else None
            }
            for user in users
        ]
    except Exception as e:
        return {"error": f"Failed to fetch users: {str(e)}"}

@app.get("/documents")
async def get_documents(db: Session = Depends(get_db)):
    """Get all documents from the database"""
    try:
        documents = db.query(Document).all()
        return [
            {
                "id": document.id,
                "shipment_id": document.shipment_id,
                "type": document.type,
                "original_url": document.original_url,
                "verified": document.verified,
                "processed_at": document.processed_at.isoformat() if document.processed_at else None
            }
            for document in documents
        ]
    except Exception as e:
        return {"error": f"Failed to fetch documents: {str(e)}"}

@app.get("/predictions")
async def get_predictions(db: Session = Depends(get_db)):
    """Get all predictions from the database"""
    try:
        predictions = db.query(Prediction).all()
        return [
            {
                "id": prediction.id,
                "shipment_id": prediction.shipment_id,
                "predicted_delay": prediction.predicted_delay,
                "risk_score": prediction.risk_score,
                "factors": prediction.factors
            }
            for prediction in predictions
        ]
    except Exception as e:
        return {"error": f"Failed to fetch predictions: {str(e)}"}

@app.get("/shipments/{tracking_number}")
async def get_shipment_by_tracking(tracking_number: str, db: Session = Depends(get_db)):
    """Get a specific shipment by tracking number"""
    try:
        shipment = db.query(Shipment).filter(Shipment.tracking_number == tracking_number).first()
        if not shipment:
            return {"error": "Shipment not found"}

        return {
            "id": shipment.id,
            "tracking_number": shipment.tracking_number,
            "origin": shipment.origin,
            "destination": shipment.destination,
            "status": shipment.status,
            "created_at": shipment.created_at.isoformat() if shipment.created_at else None,
            "eta": shipment.eta.isoformat() if shipment.eta else None,
            "actual_delivery_time": shipment.actual_delivery_time.isoformat() if shipment.actual_delivery_time else None
        }
    except Exception as e:
        return {"error": f"Failed to fetch shipment: {str(e)}"}

@app.get("/shipments/{shipment_id}/events")
async def get_shipment_events(shipment_id: int, db: Session = Depends(get_db)):
    """Get all delivery events for a specific shipment"""
    try:
        events = db.query(DeliveryEvent).filter(DeliveryEvent.shipment_id == shipment_id).all()
        return [
            {
                "id": event.id,
                "shipment_id": event.shipment_id,
                "event_type": event.event_type,
                "timestamp": event.timestamp.isoformat() if event.timestamp else None,
                "location": event.location,
                "notes": event.notes,
                "signature_url": event.signature_url
            }
            for event in events
        ]
    except Exception as e:
        return {"error": f"Failed to fetch shipment events: {str(e)}"}