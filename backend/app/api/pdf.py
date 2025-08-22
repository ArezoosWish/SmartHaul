from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from typing import Dict, Any, List
import io

from ..services.pdf_service import PDFService


router = APIRouter(prefix="/api/pdf", tags=["PDF Generation"])
pdf_service = PDFService()

@router.post("/delivery-confirmation/{shipment_id}")
async def generate_delivery_confirmation(shipment_id: int):
    """Generate delivery confirmation PDF for a shipment"""
    try:
        # Using sample data for demonstration
        shipment_data = {
            "tracking_number": f"SH{shipment_id:03d}",
            "origin": "New York, NY",
            "destination": "Los Angeles, CA",
            "cargo_type": "Electronics",
            "cargo_weight": 1000,
            "cargo_volume": 50,
            "priority": "high",
            "pickup_time": "2025-01-15T08:00:00",
            "delivery_deadline": "2025-01-17T18:00:00"
        }
        
        pdf_bytes = pdf_service.generate_delivery_confirmation(shipment_data)
        
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=delivery_confirmation_{shipment_id}.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")

@router.post("/exception-report/{shipment_id}")
async def generate_exception_report(
    shipment_id: int,
    exception_details: Dict[str, Any]
):
    """Generate exception report PDF for a shipment"""
    try:
        # Using sample data for demonstration
        shipment_data = {
            "tracking_number": f"SH{shipment_id:03d}",
            "origin": "New York, NY",
            "destination": "Los Angeles, CA",
            "status": "delayed"
        }
        
        pdf_bytes = pdf_service.generate_exception_report(shipment_data, exception_details)
        
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=exception_report_{shipment_id}.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")

@router.post("/chain-of-custody/{shipment_id}")
async def generate_chain_of_custody_report(
    shipment_id: int,
    custody_events: List[Dict[str, Any]]
):
    """Generate chain of custody report PDF for a shipment"""
    try:
        # Using sample data for demonstration
        shipment_data = {
            "tracking_number": f"SH{shipment_id:03d}",
            "origin": "New York, NY",
            "destination": "Los Angeles, CA",
            "cargo_type": "Electronics",
            "priority": "high",
            "created_at": "2025-01-15T08:00:00"
        }
        
        pdf_bytes = pdf_service.generate_chain_of_custody_report(shipment_data, custody_events)
        
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=chain_of_custody_{shipment_id}.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")

@router.post("/qr-code/{shipment_id}")
async def generate_qr_code(shipment_id: int):
    """Generate QR code for a shipment"""
    try:
        # Generate QR code data
        qr_data = f"SmartHaul:SH{shipment_id:03d}"
        qr_bytes = pdf_service.generate_qr_code(qr_data)
        
        return StreamingResponse(
            io.BytesIO(qr_bytes),
            media_type="image/png",
            headers={"Content-Disposition": f"attachment; filename=qr_code_{shipment_id}.png"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate QR code: {str(e)}")
