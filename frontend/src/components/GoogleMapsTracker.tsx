import { useEffect, useRef, useState } from 'react';
import { Truck, Compass } from '@phosphor-icons/react';

interface TruckLocation {
  id: number;
  plate_number: string;
  lat: number;
  lng: number;
  status: string;
  current_shipment?: string | null;
  destination?: string | null;
  eta?: string | null;
}

interface ShipmentRoute {
  origin: { lat: number; lng: number; address: string };
  destination: { lat: number; lng: number; address: string };
  waypoints?: Array<{ lat: number; lng: number; address: string }>;
}

interface GoogleMapsTrackerProps {
  trucks: TruckLocation[];
  selectedShipment?: ShipmentRoute;
  onTruckSelect?: (truckId: number) => void;
  height?: string;
}

declare global {
  interface Window {
    google: any;
  }
}

export default function GoogleMapsTracker({ 
  trucks, 
  selectedShipment, 
  onTruckSelect,
  height = '500px' 
}: GoogleMapsTrackerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<number, any>>(new Map());
  const directionsServiceRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState<TruckLocation | null>(null);

  useEffect(() => {
    if (window.google && mapRef.current && !mapInstanceRef.current) {
      initializeMap();
    }
  }, []);

  useEffect(() => {
    if (mapLoaded && trucks.length > 0) {
      updateTruckMarkers();
    }
  }, [trucks, mapLoaded]);

  useEffect(() => {
    if (mapLoaded && selectedShipment) {
      showShipmentRoute();
    }
  }, [selectedShipment, mapLoaded]);

  const initializeMap = () => {
    if (!window.google || !mapRef.current) return;

    // Default center (you can make this configurable)
    const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // San Francisco

    const map = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 10,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'transit',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true
    });

    mapInstanceRef.current = map;
    directionsServiceRef.current = new window.google.maps.DirectionsService();
    directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: 'var(--color-primary)',
        strokeWeight: 4,
        strokeOpacity: 0.8
      }
    });

    directionsRendererRef.current.setMap(map);
    setMapLoaded(true);
  };

  const updateTruckMarkers = () => {
    if (!mapInstanceRef.current || !window.google) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current.clear();

    trucks.forEach(truck => {
      const marker = new window.google.maps.Marker({
        position: { lat: truck.lat, lng: truck.lng },
        map: mapInstanceRef.current,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="${getTruckStatusColor(truck.status)}"/>
              <path d="M8 12h16v8H8v-8z" fill="white"/>
              <circle cx="12" cy="20" r="2" fill="${getTruckStatusColor(truck.status)}"/>
              <circle cx="20" cy="20" r="2" fill="${getTruckStatusColor(truck.status)}"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 16)
        },
        title: `${truck.plate_number} - ${truck.status}`,
        animation: window.google.maps.Animation.DROP
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: createTruckInfoWindow(truck)
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker);
        setSelectedTruck(truck);
        if (onTruckSelect) {
          onTruckSelect(truck.id);
        }
      });

      markersRef.current.set(truck.id, marker);
    });
  };

  const showShipmentRoute = () => {
    if (!selectedShipment || !directionsServiceRef.current || !directionsRendererRef.current) return;

    const request = {
      origin: selectedShipment.origin,
      destination: selectedShipment.destination,
      waypoints: selectedShipment.waypoints || [],
      optimizeWaypoints: true,
      travelMode: window.google.maps.TravelMode.DRIVING
    };

    directionsServiceRef.current.route(request, (result: any, status: any) => {
      if (status === 'OK') {
        directionsRendererRef.current.setDirections(result);
        
        // Fit map to show entire route
        const bounds = new window.google.maps.LatLngBounds();
        result.routes[0].legs.forEach((leg: any) => {
          bounds.extend(leg.start_location);
          bounds.extend(leg.end_location);
        });
        mapInstanceRef.current.fitBounds(bounds);
      }
    });
  };

  const getTruckStatusColor = (status: string): string => {
    switch (status) {
      case 'available': return 'var(--color-success)';
      case 'in_use': return 'var(--color-warning)';
      case 'maintenance': return 'var(--color-danger)';
      case 'offline': return 'var(--color-text-muted)';
      default: return 'var(--color-info)';
    }
  };

  const createTruckInfoWindow = (truck: TruckLocation): string => {
    return `
      <div style="
        font-family: var(--font-sans);
        padding: var(--space-3);
        min-width: 200px;
        color: var(--color-text);
      ">
        <div style="
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-2);
          font-weight: var(--weight-bold);
          font-size: var(--text-md);
        ">
          <span style="color: ${getTruckStatusColor(truck.status)};">●</span>
          ${truck.plate_number}
        </div>
        <div style="
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
          margin-bottom: var(--space-2);
        ">
          Status: ${truck.status.toUpperCase()}
        </div>
        ${truck.current_shipment ? `
          <div style="
            font-size: var(--text-sm);
            margin-bottom: var(--space-1);
          ">
            <strong>Current Shipment:</strong> ${truck.current_shipment}
          </div>
        ` : ''}
        ${truck.destination ? `
          <div style="
            font-size: var(--text-sm);
            margin-bottom: var(--space-1);
          ">
            <strong>Destination:</strong> ${truck.destination}
          </div>
        ` : ''}
        ${truck.eta ? `
          <div style="
            font-size: var(--text-sm);
            color: var(--color-info);
          ">
            <strong>ETA:</strong> ${truck.eta}
          </div>
        ` : ''}
      </div>
    `;
  };

  const centerOnTruck = (truckId: number) => {
    const truck = trucks.find(t => t.id === truckId);
    if (truck && mapInstanceRef.current) {
      mapInstanceRef.current.setCenter({ lat: truck.lat, lng: truck.lng });
      mapInstanceRef.current.setZoom(15);
    }
  };

  if (!window.google) {
    return (
      <div style={{
        height,
        background: 'var(--color-surface-alt)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-text-secondary)',
        fontSize: 'var(--text-md)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Compass size={48} weight="light" style={{ marginBottom: 'var(--space-3)' }} />
          <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-medium)', marginBottom: 'var(--space-2)' }}>
            Google Maps Unavailable
          </div>
          <div style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>
            Demo Mode: Using mock data
          </div>
          <div style={{ 
            padding: 'var(--space-2)',
            background: 'var(--color-bg)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            fontSize: 'var(--text-xs)',
            fontFamily: 'monospace',
            color: 'var(--color-text-secondary)'
          }}>
            API Key: DEMO_KEY
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      <div 
        ref={mapRef} 
        style={{ 
          height, 
          width: '100%',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-md)'
        }} 
      />
      
      {trucks.length > 0 && (
        <div style={{
          marginTop: 'var(--space-4)',
          padding: 'var(--space-4)',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h4 style={{
            margin: '0 0 var(--space-3) 0',
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--weight-semibold)',
            color: 'var(--color-text)'
          }}>
            Fleet Overview
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--space-3)'
          }}>
            {trucks.map(truck => (
              <div
                key={truck.id}
                onClick={() => centerOnTruck(truck.id)}
                style={{
                  padding: 'var(--space-3)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  background: selectedTruck?.id === truck.id ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: selectedTruck?.id === truck.id ? 'var(--color-on-primary)' : 'var(--color-text)',
                  cursor: 'pointer',
                  transition: 'all var(--motion-duration) var(--motion-ease-standard)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)'
                }}
              >
                <Truck size={20} weight="fill" />
                <div>
                  <div style={{ fontWeight: 'var(--weight-medium)' }}>
                    {truck.plate_number}
                  </div>
                  <div style={{ 
                    fontSize: 'var(--text-sm)',
                    opacity: selectedTruck?.id === truck.id ? 0.9 : 0.7
                  }}>
                    {truck.status.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
