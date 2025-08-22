from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    role = Column(String(50), nullable=False, default="driver")  # admin, dispatcher, driver
    company_id = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    trucks = relationship("Truck", back_populates="driver")
    assigned_shipments = relationship("Shipment", back_populates="assigned_driver")

class Shipment(Base):
    __tablename__ = "shipments"
    
    id = Column(Integer, primary_key=True, index=True)
    tracking_number = Column(String(100), unique=True, index=True, nullable=False)
    origin = Column(String(255), nullable=False)
    destination = Column(String(255), nullable=False)
    status = Column(String(50), nullable=False, default="pending")  # pending, assigned, in_transit, delivered, cancelled
    priority = Column(String(20), nullable=False, default="normal")  # low, normal, high, urgent
    cargo_type = Column(String(100), nullable=True)  # dry_goods, refrigerated, hazardous, etc.
    cargo_weight = Column(Float, nullable=True)  # Weight in pounds
    cargo_volume = Column(Float, nullable=True)  # Volume in cubic feet
    pickup_time = Column(DateTime(timezone=True), nullable=True)
    delivery_deadline = Column(DateTime(timezone=True), nullable=True)
    assigned_truck_id = Column(Integer, ForeignKey("trucks.id"), nullable=True)
    assigned_driver_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=True)
    route_distance = Column(Float, nullable=True)  # Distance in miles
    estimated_fuel_cost = Column(Float, nullable=True)  # Estimated fuel cost for trip
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    eta = Column(DateTime(timezone=True), nullable=True)
    actual_delivery_time = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    assigned_truck = relationship("Truck", back_populates="assigned_shipments")
    assigned_driver = relationship("User", back_populates="assigned_shipments")
    route = relationship("Route", back_populates="shipments")
    documents = relationship("Document", back_populates="shipment")
    delivery_events = relationship("DeliveryEvent", back_populates="shipment")
    predictions = relationship("Prediction", back_populates="shipment")

class Truck(Base):
    __tablename__ = "trucks"
    
    id = Column(Integer, primary_key=True, index=True)
    plate_number = Column(String(20), unique=True, index=True, nullable=False)
    make = Column(String(100), nullable=True)  # e.g., "Freightliner", "Peterbilt"
    model = Column(String(100), nullable=True)  # e.g., "Cascadia", "579"
    year = Column(Integer, nullable=True)  # Manufacturing year
    capacity_volume = Column(Float, nullable=True)  # Cargo volume capacity in cubic feet
    capacity_weight = Column(Float, nullable=True)  # Weight capacity in pounds
    fuel_type = Column(String(50), nullable=True)  # diesel, electric, hybrid
    fuel_efficiency = Column(Float, nullable=True)  # miles per gallon
    current_lat = Column(Float, nullable=True)
    current_lng = Column(Float, nullable=True)
    driver_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(String(50), nullable=False, default="available")  # available, in_use, maintenance, out_of_service
    temperature = Column(Float, nullable=True)  # For temperature monitoring
    last_maintenance = Column(DateTime(timezone=True), nullable=True)
    next_maintenance = Column(DateTime(timezone=True), nullable=True)
    total_miles = Column(Float, nullable=True, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    driver = relationship("User", back_populates="trucks")
    maintenance_records = relationship("MaintenanceRecord", back_populates="truck")
    fuel_records = relationship("FuelRecord", back_populates="truck")
    assigned_shipments = relationship("Shipment", back_populates="assigned_truck")

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    shipment_id = Column(Integer, ForeignKey("shipments.id"), nullable=False)
    type = Column(String(100), nullable=False)  # bill_of_lading, delivery_receipt, customs_form, weight_ticket
    original_url = Column(String(500), nullable=False)
    extracted_data = Column(JSON, nullable=True)  # OCR extracted data
    processed_at = Column(DateTime(timezone=True), nullable=True)
    verified = Column(Boolean, default=False)
    
    # Relationships
    shipment = relationship("Shipment", back_populates="documents")

class DeliveryEvent(Base):
    __tablename__ = "delivery_events"
    
    id = Column(Integer, primary_key=True, index=True)
    shipment_id = Column(Integer, ForeignKey("shipments.id"), nullable=False)
    event_type = Column(String(100), nullable=False)  # pickup, in_transit, delivered, exception
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    location = Column(String(255), nullable=True)
    signature_url = Column(String(500), nullable=True)
    notes = Column(Text, nullable=True)
    
    # Relationships
    shipment = relationship("Shipment", back_populates="delivery_events")

class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    shipment_id = Column(Integer, ForeignKey("shipments.id"), nullable=False)
    predicted_delay = Column(Integer, nullable=True)  # Delay in minutes
    risk_score = Column(Float, nullable=True)  # 0.0 to 1.0
    factors = Column(JSON, nullable=True)  # Factors contributing to prediction
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    shipment = relationship("Shipment", back_populates="predictions") 

class MaintenanceRecord(Base):
    __tablename__ = "maintenance_records"
    
    id = Column(Integer, primary_key=True, index=True)
    truck_id = Column(Integer, ForeignKey("trucks.id"), nullable=False)
    maintenance_type = Column(String(100), nullable=False)  # scheduled, emergency, inspection
    description = Column(Text, nullable=False)
    cost = Column(Float, nullable=True)  # Maintenance cost in dollars
    performed_by = Column(String(255), nullable=True)  # Mechanic or service center
    performed_at = Column(DateTime(timezone=True), nullable=False)
    next_maintenance_due = Column(DateTime(timezone=True), nullable=True)
    mileage_at_service = Column(Float, nullable=True)  # Truck mileage when service was performed
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    truck = relationship("Truck", back_populates="maintenance_records")

class FuelRecord(Base):
    __tablename__ = "fuel_records"
    
    id = Column(Integer, primary_key=True, index=True)
    truck_id = Column(Integer, ForeignKey("trucks.id"), nullable=False)
    fuel_amount = Column(Float, nullable=False)  # Gallons of fuel
    fuel_cost = Column(Float, nullable=False)  # Cost per gallon
    total_cost = Column(Float, nullable=False)  # Total fuel cost
    mileage_at_fueling = Column(Float, nullable=True)  # Truck mileage when fueled
    fuel_station = Column(String(255), nullable=True)  # Location of fuel station
    fuel_type = Column(String(50), nullable=True)  # diesel, unleaded, etc.
    fueled_at = Column(DateTime(timezone=True), server_default=func.now())
    notes = Column(Text, nullable=True)
    
    # Relationships
    truck = relationship("Truck", back_populates="fuel_records")

class Route(Base):
    __tablename__ = "routes"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    origin = Column(String(255), nullable=False)
    destination = Column(String(255), nullable=False)
    waypoints = Column(JSON, nullable=True)  # Array of waypoint coordinates
    estimated_distance = Column(Float, nullable=True)  # Total route distance in miles
    estimated_time = Column(Integer, nullable=True)  # Estimated travel time in minutes
    fuel_efficiency = Column(Float, nullable=True)  # Expected fuel efficiency for this route
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    shipments = relationship("Shipment", back_populates="route") 