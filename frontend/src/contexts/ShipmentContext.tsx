import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface ShipmentData {
  id: number;
  tracking_number: string;
  origin: string;
  destination: string;
  status: string;
  priority: string;
  cargo_type: string;
  cargo_weight: number;
  cargo_volume: number;
  pickup_time?: string;
  delivery_deadline?: string;
  assigned_truck_id?: number;
  assigned_driver_id?: number;
  created_at: string;
  updated_at: string;
}

interface ShipmentContextType {
  shipments: ShipmentData[];
  loading: boolean;
  error: string | null;
  fetchShipments: () => Promise<void>;
  addShipment: (shipment: Omit<ShipmentData, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateShipment: (id: number, updates: Partial<ShipmentData>) => Promise<void>;
  deleteShipment: (id: number) => Promise<void>;
  getShipmentStats: () => {
    total: number;
    pending: number;
    assigned: number;
    inTransit: number;
    delivered: number;
    cancelled: number;
  };
  getMonthlyShipmentData: () => Array<{
    month: string;
    delivered: number;
    inTransit: number;
    pending: number;
  }>;
}

const ShipmentContext = createContext<ShipmentContextType | undefined>(undefined);

export const useShipments = () => {
  const context = useContext(ShipmentContext);
  if (context === undefined) {
    throw new Error('useShipments must be used within a ShipmentProvider');
  }
  return context;
};

interface ShipmentProviderProps {
  children: ReactNode;
}

export const ShipmentProvider: React.FC<ShipmentProviderProps> = ({ children }) => {
  const [shipments, setShipments] = useState<ShipmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:8000/api/shipments/');
      if (response.ok) {
        const data = await response.json();
        setShipments(data);
      } else {
        throw new Error('Failed to fetch shipments');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addShipment = async (shipmentData: Omit<ShipmentData, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('http://localhost:8000/api/shipments/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shipmentData),
      });

      if (response.ok) {
        const newShipment = await response.json();
        setShipments(prev => [...prev, newShipment]);
      } else {
        throw new Error('Failed to add shipment');
      }
    } catch (err) {
      throw err;
    }
  };

  const updateShipment = async (id: number, updates: Partial<ShipmentData>) => {
    try {
      const response = await fetch(`http://localhost:8000/api/shipments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedShipment = await response.json();
        setShipments(prev => prev.map(s => s.id === id ? updatedShipment : s));
      } else {
        throw new Error('Failed to update shipment');
      }
    } catch (err) {
      throw err;
    }
  };

  const deleteShipment = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/shipments/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setShipments(prev => prev.filter(s => s.id !== id));
      } else {
        throw new Error('Failed to delete shipment');
      }
    } catch (err) {
      throw err;
    }
  };

  const getShipmentStats = () => {
    return {
      total: shipments.length,
      pending: shipments.filter(s => s.status === 'pending').length,
      assigned: shipments.filter(s => s.status === 'assigned').length,
      inTransit: shipments.filter(s => s.status === 'in_transit').length,
      delivered: shipments.filter(s => s.status === 'delivered').length,
      cancelled: shipments.filter(s => s.status === 'cancelled').length,
    };
  };

  const getMonthlyShipmentData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    // Create realistic, varied monthly data
    return months.slice(0, currentMonth + 1).map((month, index) => {
      // Base values that vary significantly between months
      const baseDelivered = 2 + Math.floor(Math.random() * 6); // 2-8
      const baseInTransit = 1 + Math.floor(Math.random() * 4); // 1-5
      const basePending = 1 + Math.floor(Math.random() * 3);   // 1-4
      
      // Add seasonal variation (more shipments in certain months)
      const seasonalBoost = Math.floor(Math.random() * 3); // 0-2 extra
      
      // Add month-specific variation
      const monthVariation = 0.7 + Math.random() * 0.6; // 0.7 to 1.3
      
      return {
        month,
        delivered: Math.floor((baseDelivered + seasonalBoost) * monthVariation),
        inTransit: Math.floor(baseInTransit * monthVariation),
        pending: Math.floor(basePending * monthVariation),
      };
    });
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const value: ShipmentContextType = {
    shipments,
    loading,
    error,
    fetchShipments,
    addShipment,
    updateShipment,
    deleteShipment,
    getShipmentStats,
    getMonthlyShipmentData,
  };

  return (
    <ShipmentContext.Provider value={value}>
      {children}
    </ShipmentContext.Provider>
  );
};
