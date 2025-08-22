from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field

from ..models.base import get_db
from ..models.tables import Truck, MaintenanceRecord, FuelRecord, User

router = APIRouter()

# Pydantic Models for API
class TruckBase(BaseModel):
    plate_number: str = Field(..., description="License plate number")
    make: Optional[str] = Field(None, description="Truck manufacturer")
    model: Optional[str] = Field(None, description="Truck model")
    year: Optional[int] = Field(None, description="Manufacturing year")
    capacity_volume: Optional[float] = Field(None, description="Cargo volume capacity in cubic feet")
    capacity_weight: Optional[float] = Field(None, description="Weight capacity in pounds")
    fuel_type: Optional[str] = Field(None, description="diesel, electric, hybrid")
    fuel_efficiency: Optional[float] = Field(None, description="Miles per gallon")
    driver_id: Optional[int] = Field(None, description="Assigned driver ID")

class TruckCreate(TruckBase):
    pass

class TruckUpdate(TruckBase):
    status: Optional[str] = Field(None, description="available, in_use, maintenance, out_of_service")
    current_lat: Optional[float] = Field(None, description="Current latitude")
    current_lng: Optional[float] = Field(None, description="Current longitude")
    temperature: Optional[float] = Field(None, description="Current temperature")
    total_miles: Optional[float] = Field(None, description="Total miles driven")

class TruckResponse(TruckBase):
    id: int
    status: str
    current_lat: Optional[float]
    current_lng: Optional[float]
    temperature: Optional[float]
    last_maintenance: Optional[datetime]
    next_maintenance: Optional[datetime]
    total_miles: float
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class MaintenanceRecordBase(BaseModel):
    maintenance_type: str = Field(..., description="scheduled, emergency, inspection")
    description: str = Field(..., description="Maintenance description")
    cost: Optional[float] = Field(None, description="Maintenance cost in dollars")
    performed_by: Optional[str] = Field(None, description="Mechanic or service center")
    performed_at: datetime = Field(..., description="When maintenance was performed")
    next_maintenance_due: Optional[datetime] = Field(None, description="Next maintenance due date")
    mileage_at_service: Optional[float] = Field(None, description="Mileage when service was performed")
    notes: Optional[str] = Field(None, description="Additional notes")

class MaintenanceRecordCreate(MaintenanceRecordBase):
    truck_id: int = Field(..., description="Truck ID")

class MaintenanceRecordResponse(MaintenanceRecordBase):
    id: int
    truck_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class FuelRecordBase(BaseModel):
    fuel_amount: float = Field(..., description="Gallons of fuel")
    fuel_cost: float = Field(..., description="Cost per gallon")
    total_cost: float = Field(..., description="Total fuel cost")
    mileage_at_fueling: Optional[float] = Field(None, description="Mileage when fueled")
    fuel_station: Optional[str] = Field(None, description="Location of fuel station")
    fuel_type: Optional[str] = Field(None, description="diesel, unleaded, etc.")
    notes: Optional[str] = Field(None, description="Additional notes")

class FuelRecordCreate(FuelRecordBase):
    truck_id: int = Field(..., description="Truck ID")

class FuelRecordResponse(FuelRecordBase):
    id: int
    truck_id: int
    fueled_at: datetime
    
    class Config:
        from_attributes = True

# Truck Management Endpoints
@router.post("/trucks", response_model=TruckResponse, status_code=status.HTTP_201_CREATED)
async def create_truck(truck: TruckCreate, db: Session = Depends(get_db)):
    """Create a new truck"""
    # Check if plate number already exists
    existing_truck = db.query(Truck).filter(Truck.plate_number == truck.plate_number).first()
    if existing_truck:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Truck with plate number {truck.plate_number} already exists"
        )
    
    # Create new truck
    db_truck = Truck(**truck.dict())
    db.add(db_truck)
    db.commit()
    db.refresh(db_truck)
    return db_truck

@router.get("/trucks", response_model=List[TruckResponse])
async def get_trucks(
    skip: int = 0, 
    limit: int = 100, 
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all trucks with optional filtering"""
    query = db.query(Truck)
    
    if status_filter:
        query = query.filter(Truck.status == status_filter)
    
    trucks = query.offset(skip).limit(limit).all()
    return trucks

@router.get("/trucks/{truck_id}", response_model=TruckResponse)
async def get_truck(truck_id: int, db: Session = Depends(get_db)):
    """Get a specific truck by ID"""
    truck = db.query(Truck).filter(Truck.id == truck_id).first()
    if not truck:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Truck with ID {truck_id} not found"
        )
    return truck

@router.put("/trucks/{truck_id}", response_model=TruckResponse)
async def update_truck(truck_id: int, truck_update: TruckUpdate, db: Session = Depends(get_db)):
    """Update truck information"""
    db_truck = db.query(Truck).filter(Truck.id == truck_id).first()
    if not db_truck:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Truck with ID {truck_id} not found"
        )
    
    # Update fields
    update_data = truck_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_truck, field, value)
    
    db_truck.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_truck)
    return db_truck

@router.delete("/trucks/{truck_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_truck(truck_id: int, db: Session = Depends(get_db)):
    """Delete a truck"""
    db_truck = db.query(Truck).filter(Truck.id == truck_id).first()
    if not db_truck:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Truck with ID {truck_id} not found"
        )
    
    # Check if truck has assigned shipments
    if db_truck.assigned_shipments:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete truck with assigned shipments"
        )
    
    db.delete(db_truck)
    db.commit()
    return None

# Maintenance Records Endpoints
@router.post("/maintenance", response_model=MaintenanceRecordResponse, status_code=status.HTTP_201_CREATED)
async def create_maintenance_record(record: MaintenanceRecordCreate, db: Session = Depends(get_db)):
    """Create a new maintenance record"""
    # Verify truck exists
    truck = db.query(Truck).filter(Truck.id == record.truck_id).first()
    if not truck:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Truck with ID {record.truck_id} not found"
        )
    
    # Create maintenance record
    db_record = MaintenanceRecord(**record.dict())
    db.add(db_record)
    
    # Update truck maintenance info
    truck.last_maintenance = record.performed_at
    truck.next_maintenance = record.next_maintenance_due
    truck.total_miles = record.mileage_at_service or truck.total_miles
    
    db.commit()
    db.refresh(db_record)
    return db_record

@router.get("/maintenance/{truck_id}", response_model=List[MaintenanceRecordResponse])
async def get_maintenance_records(truck_id: int, db: Session = Depends(get_db)):
    """Get maintenance records for a specific truck"""
    # Verify truck exists
    truck = db.query(Truck).filter(Truck.id == truck_id).first()
    if not truck:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Truck with ID {truck_id} not found"
        )
    
    records = db.query(MaintenanceRecord).filter(MaintenanceRecord.truck_id == truck_id).all()
    return records

# Fuel Records Endpoints
@router.post("/fuel", response_model=FuelRecordResponse, status_code=status.HTTP_201_CREATED)
async def create_fuel_record(record: FuelRecordCreate, db: Session = Depends(get_db)):
    """Create a new fuel record"""
    # Verify truck exists
    truck = db.query(Truck).filter(Truck.id == record.truck_id).first()
    if not truck:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Truck with ID {record.truck_id} not found"
        )
    
    # Create fuel record
    db_record = FuelRecord(**record.dict())
    db.add(db_record)
    
    # Update truck mileage if provided
    if record.mileage_at_fueling:
        truck.total_miles = max(truck.total_miles or 0, record.mileage_at_fueling)
    
    db.commit()
    db.refresh(db_record)
    return db_record

@router.get("/fuel/{truck_id}", response_model=List[FuelRecordResponse])
async def get_fuel_records(truck_id: int, db: Session = Depends(get_db)):
    """Get fuel records for a specific truck"""
    # Verify truck exists
    truck = db.query(Truck).filter(Truck.id == truck_id).first()
    if not truck:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Truck with ID {truck_id} not found"
        )
    
    records = db.query(FuelRecord).filter(FuelRecord.truck_id == truck_id).all()
    return records

# Fleet Analytics Endpoints
@router.get("/analytics/fleet-overview")
async def get_fleet_overview(db: Session = Depends(get_db)):
    """Get fleet overview statistics"""
    total_trucks = db.query(Truck).count()
    available_trucks = db.query(Truck).filter(Truck.status == "available").count()
    in_use_trucks = db.query(Truck).filter(Truck.status == "in_use").count()
    maintenance_trucks = db.query(Truck).filter(Truck.status == "maintenance").count()
    
    # Calculate total fleet mileage
    total_miles = db.query(func.coalesce(func.sum(Truck.total_miles), 0)).scalar() or 0
    
    return {
        "total_trucks": total_trucks,
        "available_trucks": available_trucks,
        "in_use_trucks": in_use_trucks,
        "maintenance_trucks": maintenance_trucks,
        "total_fleet_miles": total_miles,
        "utilization_rate": (in_use_trucks / total_trucks * 100) if total_trucks > 0 else 0
    }

@router.get("/analytics/maintenance-alerts")
async def get_maintenance_alerts(db: Session = Depends(get_db)):
    """Get trucks that need maintenance soon"""
    from datetime import timedelta
    
    # Get trucks that need maintenance in the next 30 days
    thirty_days_from_now = datetime.utcnow() + timedelta(days=30)
    trucks_needing_maintenance = db.query(Truck).filter(
        Truck.next_maintenance <= thirty_days_from_now,
        Truck.status != "out_of_service"
    ).all()
    
    alerts = []
    for truck in trucks_needing_maintenance:
        days_until_maintenance = (truck.next_maintenance - datetime.utcnow()).days
        alerts.append({
            "truck_id": truck.id,
            "plate_number": truck.plate_number,
            "days_until_maintenance": days_until_maintenance,
            "urgency": "critical" if days_until_maintenance <= 7 else "warning" if days_until_maintenance <= 14 else "info"
        })
    
    return {"maintenance_alerts": alerts}
