from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from .tables import User, Shipment, Truck, Document, DeliveryEvent, Prediction

def seed_database(db: Session):
    """Seed the database with sample data"""
    
    # Create sample users
    users = [
        User(
            email="john@smarthaul.com",
            role="driver"
        ),
        User(
            email="jane@smarthaul.com", 
            role="dispatcher"
        ),
        User(
            email="mike@smarthaul.com",
            role="driver"
        ),
        User(
            email="sarah@smarthaul.com",
            role="admin"
        )
    ]
    
    for user in users:
        db.add(user)
    db.commit()

    # Create sample trucks
    trucks = [
        Truck(
            plate_number="TRK001",
            status="available",
            current_lat=40.7128,
            current_lng=-74.0060,
            temperature=4.2
        ),
        Truck(
            plate_number="TRK002", 
            status="in_use",
            current_lat=41.8781,
            current_lng=-87.6298,
            temperature=3.8
        ),
        Truck(
            plate_number="TRK003",
            status="maintenance",
            current_lat=47.6062,
            current_lng=-122.3321,
            temperature=2.1
        ),
        Truck(
            plate_number="TRK004",
            status="available",
            current_lat=29.7604,
            current_lng=-95.3698,
            temperature=5.1
        )
    ]
    
    for truck in trucks:
        db.add(truck)
    db.commit()

    # Create sample shipments (9 total - 3 original + 6 new)
    shipments = [
        # Original 3 shipments
        Shipment(
            tracking_number="SH001",
            origin="New York, NY",
            destination="Los Angeles, CA",
            status="in_transit",
            eta=datetime.now() + timedelta(days=2)
        ),
        Shipment(
            tracking_number="SH002",
            origin="Chicago, IL", 
            destination="Miami, FL",
            status="pending",
            eta=datetime.now() + timedelta(days=3)
        ),
        Shipment(
            tracking_number="SH003",
            origin="Seattle, WA",
            destination="Boston, MA", 
            status="delivered",
            eta=datetime.now() - timedelta(days=1),
            actual_delivery_time=datetime.now() - timedelta(hours=6)
        ),
        # 6 new shipments
        Shipment(
            tracking_number="SH004",
            origin="Houston, TX",
            destination="Denver, CO",
            status="in_transit",
            eta=datetime.now() + timedelta(days=1)
        ),
        Shipment(
            tracking_number="SH005",
            origin="Phoenix, AZ",
            destination="Portland, OR",
            status="pending",
            eta=datetime.now() + timedelta(days=4)
        ),
        Shipment(
            tracking_number="SH006",
            origin="Atlanta, GA",
            destination="San Francisco, CA",
            status="in_transit",
            eta=datetime.now() + timedelta(days=2)
        ),
        Shipment(
            tracking_number="SH007",
            origin="Dallas, TX",
            destination="Las Vegas, NV",
            status="delivered",
            eta=datetime.now() - timedelta(days=1),
            actual_delivery_time=datetime.now() - timedelta(hours=12)
        ),
        Shipment(
            tracking_number="SH008",
            origin="Detroit, MI",
            destination="Nashville, TN",
            status="in_transit",
            eta=datetime.now() + timedelta(days=1)
        ),
        Shipment(
            tracking_number="SH009",
            origin="Philadelphia, PA",
            destination="Austin, TX",
            status="pending",
            eta=datetime.now() + timedelta(days=5)
        )
    ]
    
    for shipment in shipments:
        db.add(shipment)
    db.commit()

    # Create sample delivery events
    delivery_events = [
        # Original events
        DeliveryEvent(
            shipment_id=5,  # SH001
            event_type="pickup",
            location="New York, NY",
            notes="Package picked up from warehouse"
        ),
        DeliveryEvent(
            shipment_id=5,  # SH001
            event_type="in_transit",
            location="Chicago, IL", 
            notes="Arrived at distribution center"
        ),
        DeliveryEvent(
            shipment_id=7,  # SH003
            event_type="delivered",
            location="Boston, MA",
            notes="Delivered successfully",
            signature_url="/uploads/signature_003.png"
        ),
        # New events for additional shipments
        DeliveryEvent(
            shipment_id=8,  # SH004
            event_type="pickup",
            location="Houston, TX",
            notes="Package picked up from Houston warehouse"
        ),
        DeliveryEvent(
            shipment_id=8,  # SH004
            event_type="in_transit",
            location="Oklahoma City, OK",
            notes="Passing through Oklahoma"
        ),
        DeliveryEvent(
            shipment_id=10,  # SH006
            event_type="pickup",
            location="Atlanta, GA",
            notes="Package picked up from Atlanta hub"
        ),
        DeliveryEvent(
            shipment_id=10,  # SH006
            event_type="in_transit",
            location="Memphis, TN",
            notes="Arrived at Memphis distribution center"
        ),
        DeliveryEvent(
            shipment_id=11,  # SH007
            event_type="pickup",
            location="Dallas, TX",
            notes="Package picked up from Dallas facility"
        ),
        DeliveryEvent(
            shipment_id=11,  # SH007
            event_type="in_transit",
            location="Albuquerque, NM",
            notes="Passing through New Mexico"
        ),
        DeliveryEvent(
            shipment_id=11,  # SH007
            event_type="delivered",
            location="Las Vegas, NV",
            notes="Delivered to customer in Las Vegas",
            signature_url="/uploads/signature_007.png"
        ),
        DeliveryEvent(
            shipment_id=12,  # SH008
            event_type="pickup",
            location="Detroit, MI",
            notes="Package picked up from Detroit warehouse"
        ),
        DeliveryEvent(
            shipment_id=12,  # SH008
            event_type="in_transit",
            location="Cincinnati, OH",
            notes="Passing through Ohio"
        )
    ]
    
    for event in delivery_events:
        db.add(event)
    db.commit()

    # Create sample documents
    documents = [
        Document(
            shipment_id=5,  # SH001
            type="invoice",
            original_url="/uploads/invoice_001.pdf",
            extracted_data={"total": "$1,250.00", "items": 15},
            processed_at=datetime.now() - timedelta(hours=2),
            verified=True
        ),
        Document(
            shipment_id=6,  # SH002
            type="packing_list",
            original_url="/uploads/packing_002.pdf",
            extracted_data={"weight": "2,500 lbs", "pieces": 45},
            processed_at=datetime.now() - timedelta(hours=1),
            verified=True
        ),
        Document(
            shipment_id=7,  # SH003
            type="delivery_receipt",
            original_url="/uploads/receipt_003.pdf",
            extracted_data={"received_by": "John Smith", "condition": "Good"},
            processed_at=datetime.now() - timedelta(hours=6),
            verified=True
        ),
        Document(
            shipment_id=8,  # SH004
            type="bill_of_lading",
            original_url="/uploads/bill_004.pdf",
            extracted_data={"shipper": "ABC Logistics", "consignee": "XYZ Corp"},
            processed_at=datetime.now() - timedelta(hours=3),
            verified=False
        )
    ]
    
    for document in documents:
        db.add(document)
    db.commit()

    # Create sample predictions
    predictions = [
        Prediction(
            shipment_id=5,  # SH001
            predicted_delay=15,
            risk_score=0.3,
            factors={"weather": "clear", "traffic": "moderate", "distance_remaining": "1200 miles"}
        ),
        Prediction(
            shipment_id=6,  # SH002
            predicted_delay=0,
            risk_score=0.1,
            factors={"weather": "clear", "traffic": "light", "distance_remaining": "800 miles"}
        ),
        Prediction(
            shipment_id=8,  # SH004
            predicted_delay=5,
            risk_score=0.2,
            factors={"weather": "clear", "traffic": "light", "distance_remaining": "600 miles"}
        ),
        Prediction(
            shipment_id=10,  # SH006
            predicted_delay=30,
            risk_score=0.4,
            factors={"weather": "rain", "traffic": "heavy", "distance_remaining": "1800 miles"}
        )
    ]
    
    for prediction in predictions:
        db.add(prediction)
    db.commit()

    print("Database seeded successfully!")
    print(f"Created {len(users)} users, {len(trucks)} trucks, {len(shipments)} shipments, {len(delivery_events)} delivery events, {len(documents)} documents, and {len(predictions)} predictions") 