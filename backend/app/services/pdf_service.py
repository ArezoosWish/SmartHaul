import io
from datetime import datetime
from typing import Dict, Any, Optional
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
import qrcode
from PIL import Image as PILImage

class PDFService:
    """Service for generating professional PDF documents for logistics operations"""
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
    
    def _setup_custom_styles(self):
        """Setup custom paragraph styles for professional documents"""
        self.styles.add(ParagraphStyle(
            name='SmartHaulTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            alignment=TA_CENTER,
            textColor=colors.HexColor('#1e40af')
        ))
        
        self.styles.add(ParagraphStyle(
            name='SmartHaulSubtitle',
            parent=self.styles['Heading2'],
            fontSize=16,
            spaceAfter=20,
            alignment=TA_CENTER,
            textColor=colors.HexColor('#374151')
        ))
        
        self.styles.add(ParagraphStyle(
            name='SmartHaulBody',
            parent=self.styles['Normal'],
            fontSize=11,
            spaceAfter=12,
            alignment=TA_LEFT
        ))
        
        self.styles.add(ParagraphStyle(
            name='SmartHaulHeader',
            parent=self.styles['Normal'],
            fontSize=12,
            spaceAfter=6,
            alignment=TA_LEFT,
            textColor=colors.HexColor('#1e40af'),
            fontName='Helvetica-Bold'
        ))
    
    def generate_delivery_confirmation(self, shipment_data: Dict[str, Any]) -> bytes:
        """Generate a professional delivery confirmation PDF"""
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        story = []
        
        # Header with company logo and title
        story.append(Paragraph("SmartHaul Logistics", self.styles['SmartHaulTitle']))
        story.append(Paragraph("Delivery Confirmation", self.styles['SmartHaulSubtitle']))
        story.append(Spacer(1, 20))
        
        # Shipment Information
        story.append(Paragraph("Shipment Details", self.styles['SmartHaulHeader']))
        story.append(Spacer(1, 10))
        
        shipment_info = [
            ['Tracking Number:', shipment_data.get('tracking_number', 'N/A')],
            ['Origin:', shipment_data.get('origin', 'N/A')],
            ['Destination:', shipment_data.get('destination', 'N/A')],
            ['Cargo Type:', shipment_data.get('cargo_type', 'N/A')],
            ['Weight:', f"{shipment_data.get('cargo_weight', 0)} lbs"],
            ['Volume:', f"{shipment_data.get('cargo_volume', 0)} cu ft"],
            ['Priority:', shipment_data.get('priority', 'N/A').title()],
            ['Pickup Time:', shipment_data.get('pickup_time', 'N/A')],
            ['Delivery Deadline:', shipment_data.get('delivery_deadline', 'N/A')]
        ]
        
        shipment_table = Table(shipment_info, colWidths=[2*inch, 4*inch])
        shipment_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f3f4f6')),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#374151')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#d1d5db'))
        ]))
        story.append(shipment_table)
        story.append(Spacer(1, 20))
        
        # Delivery Confirmation Section
        story.append(Paragraph("Delivery Confirmation", self.styles['SmartHaulHeader']))
        story.append(Spacer(1, 10))
        
        delivery_info = [
            ['Delivered To:', '_________________'],
            ['Delivery Date:', '_________________'],
            ['Delivery Time:', '_________________'],
            ['Received By:', '_________________'],
            ['Signature:', '_________________'],
            ['Notes:', '_________________']
        ]
        
        delivery_table = Table(delivery_info, colWidths=[2*inch, 4*inch])
        delivery_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f3f4f6')),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#374151')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#d1d5db'))
        ]))
        story.append(delivery_table)
        story.append(Spacer(1, 20))
        
        # Footer
        story.append(Paragraph("Generated by SmartHaul Logistics System", self.styles['SmartHaulBody']))
        story.append(Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", self.styles['SmartHaulBody']))
        
        doc.build(story)
        buffer.seek(0)
        return buffer.getvalue()
    
    def generate_exception_report(self, shipment_data: Dict[str, Any], exception_details: Dict[str, Any]) -> bytes:
        """Generate an exception report PDF for delivery issues"""
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        story = []
        
        # Header
        story.append(Paragraph("SmartHaul Logistics", self.styles['SmartHaulTitle']))
        story.append(Paragraph("Exception Report", self.styles['SmartHaulSubtitle']))
        story.append(Spacer(1, 20))
        
        # Exception Details
        story.append(Paragraph("Exception Information", self.styles['SmartHaulHeader']))
        story.append(Spacer(1, 10))
        
        exception_info = [
            ['Exception Type:', exception_details.get('type', 'N/A')],
            ['Severity:', exception_details.get('severity', 'N/A')],
            ['Description:', exception_details.get('description', 'N/A')],
            ['Reported By:', exception_details.get('reported_by', 'N/A')],
            ['Reported At:', exception_details.get('reported_at', 'N/A')],
            ['Status:', exception_details.get('status', 'N/A')]
        ]
        
        exception_table = Table(exception_info, colWidths=[2*inch, 4*inch])
        exception_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#fef2f2')),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#991b1b')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#fecaca'))
        ]))
        story.append(exception_table)
        story.append(Spacer(1, 20))
        
        # Shipment Information
        story.append(Paragraph("Affected Shipment", self.styles['SmartHaulHeader']))
        story.append(Spacer(1, 10))
        
        shipment_info = [
            ['Tracking Number:', shipment_data.get('tracking_number', 'N/A')],
            ['Origin:', shipment_data.get('origin', 'N/A')],
            ['Destination:', shipment_data.get('destination', 'N/A')],
            ['Current Status:', shipment_data.get('status', 'N/A')]
        ]
        
        shipment_table = Table(shipment_info, colWidths=[2*inch, 4*inch])
        shipment_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f3f4f6')),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#374151')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#d1d5db'))
        ]))
        story.append(shipment_table)
        story.append(Spacer(1, 20))
        
        # Action Items
        story.append(Paragraph("Action Items", self.styles['SmartHaulHeader']))
        story.append(Spacer(1, 10))
        
        action_items = [
            ['Action:', '_________________'],
            ['Assigned To:', '_________________'],
            ['Due Date:', '_________________'],
            ['Status:', '_________________']
        ]
        
        action_table = Table(action_items, colWidths=[2*inch, 4*inch])
        action_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f0f9ff')),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#1e40af')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#bfdbfe'))
        ]))
        story.append(action_table)
        
        # Footer
        story.append(Spacer(1, 20))
        story.append(Paragraph("Generated by SmartHaul Logistics System", self.styles['SmartHaulBody']))
        story.append(Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", self.styles['SmartHaulBody']))
        
        doc.build(story)
        buffer.seek(0)
        return buffer.getvalue()
    
    def generate_chain_of_custody_report(self, shipment_data: Dict[str, Any], custody_events: list) -> bytes:
        """Generate a comprehensive chain of custody report"""
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        story = []
        
        # Header
        story.append(Paragraph("SmartHaul Logistics", self.styles['SmartHaulTitle']))
        story.append(Paragraph("Chain of Custody Report", self.styles['SmartHaulSubtitle']))
        story.append(Spacer(1, 20))
        
        # Shipment Information
        story.append(Paragraph("Shipment Information", self.styles['SmartHaulHeader']))
        story.append(Spacer(1, 10))
        
        shipment_info = [
            ['Tracking Number:', shipment_data.get('tracking_number', 'N/A')],
            ['Origin:', shipment_data.get('origin', 'N/A')],
            ['Destination:', shipment_data.get('destination', 'N/A')],
            ['Cargo Type:', shipment_data.get('cargo_type', 'N/A')],
            ['Priority:', shipment_data.get('priority', 'N/A').title()],
            ['Created:', shipment_data.get('created_at', 'N/A')]
        ]
        
        shipment_table = Table(shipment_info, colWidths=[2*inch, 4*inch])
        shipment_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f3f4f6')),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#374151')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#d1d5db'))
        ]))
        story.append(shipment_table)
        story.append(Spacer(1, 20))
        
        # Chain of Custody Events
        story.append(Paragraph("Custody Transfer Events", self.styles['SmartHaulHeader']))
        story.append(Spacer(1, 10))
        
        if custody_events:
            # Create table headers
            custody_headers = ['Timestamp', 'Location', 'Responsible Party', 'Action', 'Notes']
            custody_data = [custody_headers]
            
            for event in custody_events:
                custody_data.append([
                    event.get('timestamp', 'N/A'),
                    event.get('location', 'N/A'),
                    event.get('responsible_party', 'N/A'),
                    event.get('action', 'N/A'),
                    event.get('notes', 'N/A')
                ])
            
            custody_table = Table(custody_data, colWidths=[1.2*inch, 1.2*inch, 1.2*inch, 1.2*inch, 1.2*inch])
            custody_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e40af')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#d1d5db'))
            ]))
            story.append(custody_table)
        else:
            story.append(Paragraph("No custody events recorded", self.styles['SmartHaulBody']))
        
        story.append(Spacer(1, 20))
        
        # Verification Section
        story.append(Paragraph("Verification & Signatures", self.styles['SmartHaulHeader']))
        story.append(Spacer(1, 10))
        
        verification_info = [
            ['Shipper Signature:', '_________________', 'Date:', '_________________'],
            ['Carrier Signature:', '_________________', 'Date:', '_________________'],
            ['Receiver Signature:', '_________________', 'Date:', '_________________']
        ]
        
        verification_table = Table(verification_info, colWidths=[2*inch, 2*inch, 1*inch, 1*inch])
        verification_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f0f9ff')),
            ('BACKGROUND', (2, 0), (2, -1), colors.HexColor('#f0f9ff')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#1e40af')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#bfdbfe'))
        ]))
        story.append(verification_table)
        
        # Footer
        story.append(Spacer(1, 20))
        story.append(Paragraph("Generated by SmartHaul Logistics System", self.styles['SmartHaulBody']))
        story.append(Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", self.styles['SmartHaulBody']))
        
        doc.build(story)
        buffer.seek(0)
        return buffer.getvalue()
    
    def generate_qr_code(self, data: str) -> bytes:
        """Generate a QR code image as bytes"""
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(data)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        return buffer.getvalue()
