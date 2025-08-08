from sqlalchemy.orm import Session
from .tables import User, Shipment, Truck, Document, DeliveryEvent, Prediction
from datetime import datetime, timedelta
import random

def seed_database(db: Session):
    """Seed the database with sample data for development"""
    
    # Create sample users
    users = [
        User(email="admin@smarthaul.com", role="admin"),
        User(email="dispatcher@smarthaul.com", role="dispatcher"),
        User(email="driver1@smarthaul.com", role="driver"),
        User(email="driver2@smarthaul.com", role="driver"),
    ]
    
    for user in users:
        db.add(user)
    db.commit()
    
    # Create sample trucks
    trucks = [
        Truck(
            plate_number="ABC123",
            current_lat=40.7128,
            current_lng=-74.0060,
            driver_id=users[2].id,
            status="in_use",
            temperature=4.2
        ),
        Truck(
            plate_number="XYZ789",
            current_lat=34.0522,
            current_lng=-118.2437,
            driver_id=users[3].id,
            status="available",
            temperature=2.8
        ),
    ]
    
    for truck in trucks:
        db.add(truck)
    db.commit()
    
    # Create sample shipments
    shipments = [
        Shipment(
            tracking_number="SH001",
            origin="New York, NY",
            destination="Los Angeles, CA",
            status="in_transit",
            eta=datetime.now() + timedelta(days=2),
        ),
        Shipment(
            tracking_number="SH002",
            origin="Chicago, IL",
            destination="Miami, FL",
            status="pending",
            eta=datetime.now() + timedelta(days=3),
        ),
        Shipment(
            tracking_number="SH003",
            origin="Seattle, WA",
            destination="Boston, MA",
            status="delivered",
            eta=datetime.now() - timedelta(days=1),
            actual_delivery_time=datetime.now() - timedelta(hours=6),
        ),
    ]
    
    for shipment in shipments:
        db.add(shipment)
    db.commit()
    
    # Create sample documents
    documents = [
        Document(
            shipment_id=shipments[0].id,
            type="bill_of_lading",
            original_url="/uploads/bill_of_lading_001.pdf",
            extracted_data={
                "shipper": "ABC Logistics",
                "consignee": "XYZ Corp",
                "weight": "1500 lbs",
                "pieces": "50"
            },
            processed_at=datetime.now() - timedelta(hours=2),
            verified=True
        ),
        Document(
            shipment_id=shipments[1].id,
            type="delivery_receipt",
            original_url="/uploads/delivery_receipt_002.pdf",
            extracted_data={
                "delivery_date": "2024-01-15",
                "received_by": "John Smith",
                "condition": "Good"
            },
            processed_at=datetime.now() - timedelta(hours=1),
            verified=False
        ),
    ]
    
    for document in documents:
        db.add(document)
    db.commit()
    
    # Create sample delivery events
    events = [
        DeliveryEvent(
            shipment_id=shipments[0].id,
            event_type="pickup",
            location="New York, NY",
            notes="Package picked up from warehouse"
        ),
        DeliveryEvent(
            shipment_id=shipments[0].id,
            event_type="in_transit",
            location="Chicago, IL",
            notes="Arrived at distribution center"
        ),
        DeliveryEvent(
            shipment_id=shipments[2].id,
            event_type="delivered",
            location="Boston, MA",
            signature_url="/uploads/signature_003.png",
            notes="Delivered successfully"
        ),
    ]
    
    for event in events:
        db.add(event)
    db.commit()
    
    # Create sample predictions
    predictions = [
        Prediction(
            shipment_id=shipments[0].id,
            predicted_delay=15,
            risk_score=0.3,
            factors={
                "weather": "clear",
                "traffic": "moderate",
                "distance_remaining": "1200 miles"
            }
        ),
        Prediction(
            shipment_id=shipments[1].id,
            predicted_delay=0,
            risk_score=0.1,
            factors={
                "weather": "clear",
                "traffic": "light",
                "distance_remaining": "800 miles"
            }
        ),
    ]
    
    for prediction in predictions:
        db.add(prediction)
    db.commit()
    
    print("Database seeded successfully!")
    print(f"Created {len(users)} users, {len(trucks)} trucks, {len(shipments)} shipments")
    print(f"Created {len(documents)} documents, {len(events)} events, {len(predictions)} predictions") 