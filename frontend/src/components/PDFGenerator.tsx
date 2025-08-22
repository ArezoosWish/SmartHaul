import React, { useState, useEffect, useRef } from 'react';
import { FileText, Warning, ShieldCheck, QrCode } from '@phosphor-icons/react';

interface PDFGeneratorProps {
  shipmentId: number;
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ shipmentId }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const generatePDF = async (type: string) => {
    setLoading(type);
    setError(null);
    
    try {
      let requestBody = {};
      
      // Add required data for specific PDF types
      if (type === 'exception-report') {
        requestBody = {
          exception_details: {
            type: "delivery_delay",
            description: "Shipment delayed due to weather conditions",
            timestamp: new Date().toISOString(),
            severity: "medium"
          }
        };
      } else if (type === 'chain-of-custody') {
        requestBody = [
          {
            event_type: "pickup",
            timestamp: new Date().toISOString(),
            location: "Warehouse A",
            handler: "John Doe",
            notes: "Package picked up from origin"
          },
          {
            event_type: "in_transit",
            timestamp: new Date().toISOString(),
            location: "Distribution Center",
            handler: "Jane Smith",
            notes: "Package in transit"
          }
        ];
      }
      
      const response = await fetch(`http://localhost:8000/api/pdf/${type}/${shipmentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate ${type}: ${response.status} - ${errorText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_${shipmentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate PDF');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{
      marginTop: 'var(--space-4)',
      padding: 'var(--space-4)',
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)'
    }}>

      
      {error && (
        <div style={{
          padding: 'var(--space-3)',
          background: 'var(--color-error)',
          color: 'var(--color-on-error)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--space-3)',
          fontSize: 'var(--text-sm)'
        }}>
          {error}
        </div>
      )}
      
      <div style={{ position: 'relative' }} ref={dropdownRef}>
        {/* Compact PDF Button */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          style={{
            background: 'transparent',
            color: 'var(--color-text-secondary)',
            padding: 'var(--space-2) var(--space-3)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-text-secondary)',
            cursor: 'pointer',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--weight-medium)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            transition: 'all var(--motion-duration) var(--motion-ease-standard)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-surface-alt)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <FileText size={16} weight="regular" />
          Generate Document as PDF
          <span style={{ fontSize: 'var(--text-xs)' }}>▼</span>
        </button>
        
        {/* Dropdown Menu */}
        {showDropdown && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            marginTop: 'var(--space-1)',
            minWidth: '200px'
          }}>
            <div
              onClick={() => { generatePDF('delivery-confirmation'); setShowDropdown(false); }}
              style={{
                padding: 'var(--space-3)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                borderBottom: '1px solid var(--color-border)',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-alt)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-surface)'}
            >
              <FileText size={16} weight="regular" style={{ color: 'var(--color-primary)' }} />
              <span>Delivery Confirmation</span>
            </div>
            
            <div
              onClick={() => { generatePDF('exception-report'); setShowDropdown(false); }}
              style={{
                padding: 'var(--space-3)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                borderBottom: '1px solid var(--color-border)',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-alt)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-surface)'}
            >
              <Warning size={16} weight="regular" style={{ color: 'var(--color-warning)' }} />
              <span>Exception Report</span>
            </div>
            
            <div
              onClick={() => { generatePDF('chain-of-custody'); setShowDropdown(false); }}
              style={{
                padding: 'var(--space-3)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                borderBottom: '1px solid var(--color-border)',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-alt)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-surface)'}
            >
              <ShieldCheck size={16} weight="regular" style={{ color: 'var(--color-info)' }} />
              <span>Chain of Custody</span>
            </div>
            
            <div
              onClick={() => { generatePDF('qr-code'); setShowDropdown(false); }}
              style={{
                padding: 'var(--space-3)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-alt)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-surface)'}
            >
              <QrCode size={16} weight="regular" style={{ color: 'var(--color-success)' }} />
              <span>QR Code</span>
            </div>
          </div>
        )}
      </div>
      

    </div>
  );
};

export default PDFGenerator;
