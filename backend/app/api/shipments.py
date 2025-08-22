from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel, Field
import math

from ..models.base import get_db
from ..models.tables import Shipment, Truck, User, Route

router = APIRouter()

# Pydantic Models for API
class ShipmentBase(BaseModel):
    tracking_number: str = Field(..., description="Unique tracking number")
    origin: str = Field(..., description="Pickup location")
    destination: str = Field(..., description="Delivery location")
    priority: str = Field("normal", description="high, normal, low")
    cargo_type: str = Field(..., description="Type of cargo")
    cargo_weight: float = Field(..., description="Weight in pounds")
    cargo_volume: float = Field(..., description="Volume in cubic feet")
    pickup_time: Optional[datetime] = Field(None, description="Scheduled pickup time")
    delivery_deadline: Optional[datetime] = Field(None, description="Delivery deadline")


class ShipmentCreate(ShipmentBase):
    pass

class ShipmentUpdate(ShipmentBase):
    status: Optional[str] = Field(None, description="pending, in_transit, delivered, cancelled")
    assigned_truck_id: Optional[int] = Field(None, description="ID of assigned truck")
    assigned_driver_id: Optional[int] = Field(None, description="ID of assigned driver")
    route_id: Optional[int] = Field(None, description="ID of assigned route")
    actual_pickup_time: Optional[datetime] = Field(None, description="Actual pickup time")
    actual_delivery_time: Optional[datetime] = Field(None, description="Actual delivery time")

class ShipmentResponse(ShipmentBase):
    id: int
    status: str
    assigned_truck_id: Optional[int]
    assigned_driver_id: Optional[int]
    route_id: Optional[int]
    route_distance: Optional[float]
    estimated_fuel_cost: Optional[float]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class TruckAssignmentRequest(BaseModel):
    shipment_id: int
    truck_id: int
    driver_id: Optional[int] = None

class RouteOptimizationRequest(BaseModel):
    origin: str
    destination: str
    cargo_weight: float
    cargo_volume: float
    priority: str = "normal"

# Shipment Management Endpoints
@router.post("/", response_model=ShipmentResponse, status_code=status.HTTP_201_CREATED)
async def create_shipment(shipment: ShipmentCreate, db: Session = Depends(get_db)):
    """Create a new shipment"""
    # Check if tracking number already exists
    existing_shipment = db.query(Shipment).filter(Shipment.tracking_number == shipment.tracking_number).first()
    if existing_shipment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Shipment with tracking number {shipment.tracking_number} already exists"
        )
    
    # Create shipment
    db_shipment = Shipment(
        **shipment.dict(),
        status="pending",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    db.add(db_shipment)
    db.commit()
    db.refresh(db_shipment)
    
    return db_shipment

@router.get("/", response_model=List[ShipmentResponse])
async def get_shipments(
    skip: int = 0, 
    limit: int = 100, 
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all shipments with optional filtering"""
    query = db.query(Shipment)
    
    if status_filter:
        query = query.filter(Shipment.status == status_filter)
    
    shipments = query.offset(skip).limit(limit).all()
    return shipments

@router.get("/{shipment_id}", response_model=ShipmentResponse)
async def get_shipment(shipment_id: int, db: Session = Depends(get_db)):
    """Get a specific shipment by ID"""
    shipment = db.query(Shipment).filter(Shipment.id == shipment_id).first()
    if not shipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Shipment with ID {shipment_id} not found"
        )
    return shipment

@router.put("/{shipment_id}", response_model=ShipmentResponse)
async def update_shipment(shipment_id: int, shipment_update: ShipmentUpdate, db: Session = Depends(get_db)):
    """Update shipment information"""
    db_shipment = db.query(Shipment).filter(Shipment.id == shipment_id).first()
    if not db_shipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Shipment with ID {shipment_id} not found"
        )
    
    # Update fields
    update_data = shipment_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_shipment, field, value)
    
    db_shipment.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_shipment)
    return db_shipment

@router.delete("/{shipment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_shipment(shipment_id: int, db: Session = Depends(get_db)):
    """Delete a shipment"""
    db_shipment = db.query(Shipment).filter(Shipment.id == shipment_id).first()
    if not db_shipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Shipment with ID {shipment_id} not found"
        )
    
    db.delete(db_shipment)
    db.commit()
    return None

# Truck Assignment Endpoints
@router.post("/assign", response_model=ShipmentResponse)
async def assign_shipment_to_truck(assignment: TruckAssignmentRequest, db: Session = Depends(get_db)):
    """Assign a shipment to a truck"""
    # Verify shipment exists
    shipment = db.query(Shipment).filter(Shipment.id == assignment.shipment_id).first()
    if not shipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Shipment with ID {assignment.shipment_id} not found"
        )
    
    # Verify truck exists and is available
    truck = db.query(Truck).filter(Truck.id == assignment.truck_id).first()
    if not truck:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Truck with ID {assignment.truck_id} not found"
        )
    
    if truck.status != "available":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Truck {truck.plate_number} is not available (status: {truck.status})"
        )
    
    # Check capacity constraints
    if truck.capacity_weight and shipment.cargo_weight > truck.capacity_weight:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Shipment weight ({shipment.cargo_weight} lbs) exceeds truck capacity ({truck.capacity_weight} lbs)"
        )
    
    if truck.capacity_volume and shipment.cargo_volume > truck.capacity_volume:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Shipment volume ({shipment.cargo_volume} cu ft) exceeds truck capacity ({truck.capacity_volume} cu ft)"
        )
    
    # Assign shipment to truck
    shipment.assigned_truck_id = assignment.truck_id
    shipment.assigned_driver_id = assignment.driver_id
    shipment.status = "assigned"
    shipment.updated_at = datetime.utcnow()
    
    # Update truck status
    truck.status = "in_use"
    truck.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(shipment)
    return shipment

# Route Optimization Endpoints
@router.post("/optimize-route")
async def optimize_route(request: RouteOptimizationRequest, db: Session = Depends(get_db)):
    """Get route optimization suggestions"""
    # Find available trucks that can handle the cargo
    available_trucks = db.query(Truck).filter(
        Truck.status == "available",
        Truck.capacity_weight >= request.cargo_weight,
        Truck.capacity_volume >= request.cargo_volume
    ).all()
    
    if not available_trucks:
        return {
            "message": "No available trucks can handle this cargo",
            "suggestions": []
        }
    
    # Simple distance calculation (in real world, use Google Maps API)
    def calculate_distance(origin: str, destination: str) -> float:
        # Placeholder - in real implementation, use geocoding and distance calculation
        return 150.0  # Mock distance in miles
    
    # Calculate estimated costs and find best options
    route_suggestions = []
    for truck in available_trucks:
        distance = calculate_distance(request.origin, request.destination)
        fuel_cost = distance * 0.15  # Mock fuel cost per mile
        
        route_suggestions.append({
            "truck_id": truck.id,
            "plate_number": truck.plate_number,
            "make": truck.make,
            "model": truck.model,
            "year": truck.year,
            "capacity_weight": truck.capacity_weight,
            "capacity_volume": truck.capacity_volume,
            "fuel_type": truck.fuel_type,
            "estimated_distance": distance,
            "estimated_fuel_cost": fuel_cost,
            "total_cost": fuel_cost + 50,  # Add base operational cost
            "priority_score": 0
        })
    
    # Calculate priority scores based on various factors
    for suggestion in route_suggestions:
        score = 0
        
        # Fuel efficiency bonus
        if suggestion["fuel_type"] == "electric":
            score += 20
        elif suggestion["fuel_type"] == "hybrid":
            score += 15
        elif suggestion["fuel_type"] == "diesel":
            score += 10
        
        # Capacity utilization bonus
        weight_utilization = request.cargo_weight / suggestion["capacity_weight"]
        volume_utilization = request.cargo_volume / suggestion["capacity_volume"]
        utilization_score = min(weight_utilization, volume_utilization) * 30
        score += utilization_score
        
        # Cost efficiency bonus
        cost_score = (100 - suggestion["total_cost"]) / 2
        score += max(0, cost_score)
        
        suggestion["priority_score"] = score
    
    # Sort by priority score
    route_suggestions.sort(key=lambda x: x["priority_score"], reverse=True)
    
    return {
        "origin": request.origin,
        "destination": request.destination,
        "cargo_weight": request.cargo_weight,
        "cargo_volume": request.cargo_volume,
        "priority": request.priority,
        "route_suggestions": route_suggestions[:5]  # Top 5 suggestions
    }

# Shipment Analytics Endpoints
@router.get("/analytics/overview")
async def get_shipment_overview(db: Session = Depends(get_db)):
    """Get shipment overview statistics"""
    total_shipments = db.query(Shipment).count()
    pending_shipments = db.query(Shipment).filter(Shipment.status == "pending").count()
    in_transit_shipments = db.query(Shipment).filter(Shipment.status == "in_transit").count()
    delivered_shipments = db.query(Shipment).filter(Shipment.status == "delivered").count()
    assigned_shipments = db.query(Shipment).filter(Shipment.status == "assigned").count()
    
    # Calculate average delivery time for completed shipments
    completed_shipments = db.query(Shipment).filter(
        Shipment.status == "delivered",
        Shipment.actual_delivery_time.isnot(None),
        Shipment.created_at.isnot(None)
    ).all()
    
    total_delivery_time = 0
    valid_deliveries = 0
    
    for shipment in completed_shipments:
        if shipment.actual_delivery_time and shipment.created_at:
            delivery_time = (shipment.actual_delivery_time - shipment.created_at).total_seconds() / 3600  # hours
            total_delivery_time += delivery_time
            valid_deliveries += 1
    
    avg_delivery_time = total_delivery_time / valid_deliveries if valid_deliveries > 0 else 0
    
    return {
        "total_shipments": total_shipments,
        "pending_shipments": pending_shipments,
        "assigned_shipments": assigned_shipments,
        "in_transit_shipments": in_transit_shipments,
        "delivered_shipments": delivered_shipments,
        "avg_delivery_time_hours": round(avg_delivery_time, 2),
        "completion_rate": round((delivered_shipments / total_shipments * 100), 2) if total_shipments > 0 else 0
    }
