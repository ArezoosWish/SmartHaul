#!/usr/bin/env python3
"""
Test script for PDF generation service
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.pdf_service import PDFService

def test_pdf_generation():
    """Test PDF generation functionality"""
    print("🧪 Testing PDF Generation Service...")
    
    # Initialize service
    pdf_service = PDFService()
    
    # Sample shipment data
    shipment_data = {
        "tracking_number": "SH001",
        "origin": "New York, NY",
        "destination": "Los Angeles, CA",
        "cargo_type": "Electronics",
        "cargo_weight": 1000,
        "cargo_volume": 50,
        "priority": "high",
        "pickup_time": "2025-01-15T08:00:00",
        "delivery_deadline": "2025-01-17T18:00:00"
    }
    
    # Sample exception details
    exception_details = {
        "type": "Delivery Delay",
        "severity": "Medium",
        "description": "Shipment delayed due to weather conditions",
        "reported_by": "Driver",
        "reported_at": "2025-01-15T14:00:00",
        "status": "Under Investigation"
    }
    
    # Sample custody events
    custody_events = [
        {
            "timestamp": "2025-01-15 08:00",
            "location": "New York Warehouse",
            "responsible_party": "John Smith",
            "action": "Picked Up",
            "notes": "Shipment received from shipper"
        },
        {
            "timestamp": "2025-01-15 14:00",
            "location": "Truck Loading Dock",
            "responsible_party": "Mike Johnson",
            "action": "Loaded",
            "notes": "Shipment loaded onto truck"
        }
    ]
    
    try:
        # Test delivery confirmation
        print("📄 Generating delivery confirmation...")
        delivery_pdf = pdf_service.generate_delivery_confirmation(shipment_data)
        print(f"✅ Delivery confirmation generated: {len(delivery_pdf)} bytes")
        
        # Test exception report
        print("⚠️  Generating exception report...")
        exception_pdf = pdf_service.generate_exception_report(shipment_data, exception_details)
        print(f"✅ Exception report generated: {len(exception_pdf)} bytes")
        
        # Test chain of custody
        print("🔒 Generating chain of custody report...")
        custody_pdf = pdf_service.generate_chain_of_custody_report(shipment_data, custody_events)
        print(f"✅ Chain of custody report generated: {len(custody_pdf)} bytes")
        
        # Test QR code
        print("📱 Generating QR code...")
        qr_code = pdf_service.generate_qr_code("SmartHaul:SH001")
        print(f"✅ QR code generated: {len(qr_code)} bytes")
        
        # Save test files
        print("\n💾 Saving test files...")
        
        with open("test_delivery_confirmation.pdf", "wb") as f:
            f.write(delivery_pdf)
        print("✅ Saved: test_delivery_confirmation.pdf")
        
        with open("test_exception_report.pdf", "wb") as f:
            f.write(exception_pdf)
        print("✅ Saved: test_exception_report.pdf")
        
        with open("test_chain_of_custody.pdf", "wb") as f:
            f.write(custody_pdf)
        print("✅ Saved: test_chain_of_custody.pdf")
        
        with open("test_qr_code.png", "wb") as f:
            f.write(qr_code)
        print("✅ Saved: test_qr_code.png")
        
        print("\n🎉 All PDF generation tests passed!")
        print("📁 Check the current directory for generated test files")
        
    except Exception as e:
        print(f"❌ Test failed: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_pdf_generation()
