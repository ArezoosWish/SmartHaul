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

class Shipment(Base):
    __tablename__ = "shipments"
    
    id = Column(Integer, primary_key=True, index=True)
    tracking_number = Column(String(100), unique=True, index=True, nullable=False)
    origin = Column(String(255), nullable=False)
    destination = Column(String(255), nullable=False)
    status = Column(String(50), nullable=False, default="pending")  # pending, in_transit, delivered, cancelled
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    eta = Column(DateTime(timezone=True), nullable=True)
    actual_delivery_time = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    documents = relationship("Document", back_populates="shipment")
    delivery_events = relationship("DeliveryEvent", back_populates="shipment")
    predictions = relationship("Prediction", back_populates="shipment")

class Truck(Base):
    __tablename__ = "trucks"
    
    id = Column(Integer, primary_key=True, index=True)
    plate_number = Column(String(20), unique=True, index=True, nullable=False)
    current_lat = Column(Float, nullable=True)
    current_lng = Column(Float, nullable=True)
    driver_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(String(50), nullable=False, default="available")  # available, in_use, maintenance
    temperature = Column(Float, nullable=True)  # For temperature monitoring
    
    # Relationships
    driver = relationship("User", back_populates="trucks")

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