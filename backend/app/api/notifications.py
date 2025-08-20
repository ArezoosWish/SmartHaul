from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from typing import Dict, List, Any
import json
import asyncio
from datetime import datetime
from pydantic import BaseModel

router = APIRouter()

# Store connected WebSocket clients
connected_clients: List[WebSocket] = []

# Store notification history
notification_history: List[Dict[str, Any]] = []

class NotificationRequest(BaseModel):
    type: str
    message: str
    timestamp: str
    shipment_id: int = None
    truck_id: int = None
    statistics: Dict[str, Any] = None

@router.websocket("/ws/notifications")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time notifications"""
    await websocket.accept()
    connected_clients.append(websocket)
    
    try:
        # Send welcome message
        await websocket.send_text(json.dumps({
            "type": "connection",
            "message": "Connected to SmartHaul notifications",
            "timestamp": datetime.now().isoformat()
        }))
        
        # Keep connection alive
        while True:
            await websocket.receive_text()
            
    except WebSocketDisconnect:
        connected_clients.remove(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        if websocket in connected_clients:
            connected_clients.remove(websocket)

async def broadcast_notification(notification: Dict[str, Any]):
    """Broadcast notification to all connected clients"""
    if connected_clients:
        message = json.dumps(notification)
        await asyncio.gather(
            *[client.send_text(message) for client in connected_clients],
            return_exceptions=True
        )

@router.post("/delay")
async def notify_delay(request: NotificationRequest):
    """Handle delay notifications from N8N"""
    notification = {
        "type": "delay_alert",
        "message": request.message,
        "shipment_id": request.shipment_id,
        "timestamp": request.timestamp,
        "severity": "warning"
    }
    
    # Store in history
    notification_history.append(notification)
    
    # Broadcast to connected clients
    await broadcast_notification(notification)
    
    return JSONResponse({
        "status": "success",
        "message": "Delay notification sent",
        "notification": notification
    })

@router.post("/maintenance")
async def notify_maintenance(request: NotificationRequest):
    """Handle maintenance notifications from N8N"""
    notification = {
        "type": "truck_maintenance",
        "message": request.message,
        "truck_id": request.truck_id,
        "timestamp": request.timestamp,
        "severity": "error"
    }
    
    # Store in history
    notification_history.append(notification)
    
    # Broadcast to connected clients
    await broadcast_notification(notification)
    
    return JSONResponse({
        "status": "success",
        "message": "Maintenance notification sent",
        "notification": notification
    })

@router.post("/urgent")
async def notify_urgent(request: NotificationRequest):
    """Handle urgent delivery notifications from N8N"""
    notification = {
        "type": "urgent_alert",
        "message": request.message,
        "shipment_id": request.shipment_id,
        "timestamp": request.timestamp,
        "severity": "critical"
    }
    
    # Store in history
    notification_history.append(notification)
    
    # Broadcast to connected clients
    await broadcast_notification(notification)
    
    return JSONResponse({
        "status": "success",
        "message": "Urgent notification sent",
        "notification": notification
    })

@router.post("/daily-report")
async def notify_daily_report(request: NotificationRequest):
    """Handle daily report notifications from N8N"""
    notification = {
        "type": "daily_report",
        "message": request.message,
        "statistics": request.statistics,
        "timestamp": request.timestamp,
        "severity": "info"
    }
    
    # Store in history
    notification_history.append(notification)
    
    # Broadcast to connected clients
    await broadcast_notification(notification)
    
    return JSONResponse({
        "status": "success",
        "message": "Daily report notification sent",
        "notification": notification
    })

@router.get("/history")
async def get_notification_history():
    """Get notification history"""
    return {
        "notifications": notification_history[-50:],  # Last 50 notifications
        "total": len(notification_history)
    }

@router.get("/status")
async def get_notification_status():
    """Get notification system status"""
    return {
        "connected_clients": len(connected_clients),
        "total_notifications": len(notification_history),
        "status": "active"
    }
