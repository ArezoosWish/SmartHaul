# 📄 SmartHaul PDF Generation Service

## Overview
The PDF Generation Service provides professional document creation for logistics operations, including delivery confirmations, exception reports, chain of custody documents, and QR codes.

## 🚀 Features

### 1. Delivery Confirmation PDF
- Professional delivery confirmation forms
- Shipment details with structured layout
- Signature fields for delivery verification
- SmartHaul branding and styling

### 2. Exception Report PDF
- Detailed exception documentation
- Severity classification
- Action item tracking
- Professional formatting for compliance

### 3. Chain of Custody Report PDF
- Complete custody transfer tracking
- Event timeline with timestamps
- Responsible party documentation
- Signature verification sections

### 4. QR Code Generation
- Unique QR codes per shipment
- Encoded shipment information
- High-quality PNG output
- Mobile-friendly scanning

## 📋 API Endpoints

### Generate Delivery Confirmation
```http
POST /api/pdf/delivery-confirmation/{shipment_id}
```
**Response**: PDF file download

### Generate Exception Report
```http
POST /api/pdf/exception-report/{shipment_id}
```
**Body**: Exception details JSON
**Response**: PDF file download

### Generate Chain of Custody Report
```http
POST /api/pdf/chain-of-custody/{shipment_id}
```
**Body**: Custody events array
**Response**: PDF file download

### Generate QR Code
```http
GET /api/pdf/qr-code/{shipment_id}
```
**Response**: PNG image download

## 🛠️ Installation

### 1. Install Dependencies
```bash
pip install -r requirements-pdf.txt
```

### 2. Required Packages
- `reportlab==4.0.4` - PDF generation
- `qrcode==7.4.2` - QR code creation
- `Pillow==10.0.1` - Image processing

## 🧪 Testing

### Run Test Script
```bash
cd backend
python test_pdf.py
```

This will generate test PDFs and QR codes in the current directory.

### Test Files Generated
- `test_delivery_confirmation.pdf`
- `test_exception_report.pdf`
- `test_chain_of_custody.pdf`
- `test_qr_code.png`

## 💻 Frontend Integration

The `PDFGenerator` React component provides a user-friendly interface for generating documents:

```tsx
<PDFGenerator 
  shipmentId={shipment.id} 
  shipmentData={shipment}
/>
```

### Features
- One-click PDF generation
- Loading states and error handling
- Automatic file downloads
- Professional button styling

## 🎨 Customization

### Styling
The service uses SmartHaul design system colors:
- Primary: `#1e40af` (Blue)
- Warning: `#f59e0b` (Amber)
- Info: `#0891b2` (Cyan)
- Success: `#059669` (Emerald)

### Layout
- Professional table formatting
- Consistent spacing and typography
- Branded headers and footers
- Responsive design elements

## 🔧 Configuration

### PDF Settings
- Page size: Letter (8.5" x 11")
- Font: Helvetica family
- Margins: Standard business format
- Color scheme: SmartHaul brand colors

### QR Code Settings
- Version: 1 (automatic sizing)
- Box size: 10 pixels
- Border: 5 pixels
- Format: PNG with transparency

## 📊 Usage Examples

### Generate Delivery Confirmation
```python
from app.services.pdf_service import PDFService

pdf_service = PDFService()
pdf_bytes = pdf_service.generate_delivery_confirmation(shipment_data)

# Save to file
with open("delivery_confirmation.pdf", "wb") as f:
    f.write(pdf_bytes)
```

### Generate Exception Report
```python
exception_details = {
    "type": "Delivery Delay",
    "severity": "High",
    "description": "Weather-related delay",
    "reported_by": "Driver",
    "reported_at": "2025-01-15T14:00:00",
    "status": "Under Investigation"
}

pdf_bytes = pdf_service.generate_exception_report(shipment_data, exception_details)
```

## 🚨 Error Handling

The service includes comprehensive error handling:
- Input validation
- File generation errors
- Memory management
- Graceful fallbacks

## 🔮 Future Enhancements

- Digital signature integration
- Template customization
- Multi-language support
- Batch PDF generation
- Email integration
- Cloud storage support

## 📞 Support

For issues or questions about the PDF service:
1. Check the test script output
2. Verify dependencies are installed
3. Check API endpoint responses
4. Review error logs in the backend

---

**SmartHaul Logistics** - Professional document generation for modern logistics operations.
