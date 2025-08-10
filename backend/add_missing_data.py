#!/usr/bin/env python3
"""Add missing data to the database"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.models.base import SessionLocal
from app.models.tables import DeliveryEvent, Document, Prediction

def add_missing_data():
    """Add delivery events, documents, and predictions"""
    db = SessionLocal()
    
    try:
        # Create sample delivery events
        delivery_events = [
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
        print(f"✅ Added {len(delivery_events)} delivery events")

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
        print(f"✅ Added {len(documents)} documents")

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
        print(f"✅ Added {len(predictions)} predictions")

        print("🎉 All missing data added successfully!")
        
    except Exception as e:
        print(f"❌ Error adding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_missing_data() 