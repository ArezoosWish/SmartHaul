import { useState, useEffect } from 'react';
import { Package, Plus, Truck, MapPin, X, Check, Clock, PencilSimple, Trash, Warning } from '@phosphor-icons/react';
import GoogleMapsTracker from './GoogleMapsTracker';
import PDFGenerator from './PDFGenerator';
import { useShipments } from '../contexts/ShipmentContext';

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

interface ShipmentOverview {
  total_shipments: number;
  pending_shipments: number;
  assigned_shipments: number;
  in_transit_shipments: number;
  delivered_shipments: number;
  avg_delivery_time_hours: number;
  completion_rate: number;
}

export default function ShipmentDashboard() {
  const { 
    shipments, 
    loading, 
    addShipment, 
    updateShipment, 
    deleteShipment 
  } = useShipments();
  
  const [shipmentOverview] = useState<ShipmentOverview | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<ShipmentData | null>(null);
  const [trucks, setTrucks] = useState<any[]>([]);
  const [truckLocations] = useState([
    {
      id: 1,
      plate_number: 'TK-001',
      lat: 37.7749,
      lng: -122.4194,
      status: 'available',
      current_shipment: 'SH001',
      destination: 'Los Angeles, CA',
      eta: '2 hours'
    },
    {
      id: 2,
      plate_number: 'TK-002',
      lat: 37.7849,
      lng: -122.4094,
      status: 'in_use',
      current_shipment: 'SH002',
      destination: 'Miami, FL',
      eta: '5 hours'
    },
    {
      id: 3,
      plate_number: 'TK-003',
      lat: 37.7649,
      lng: -122.4294,
      status: 'available',
      current_shipment: null,
      destination: null,
      eta: 'null'
    }
  ]);
  const [newShipment, setNewShipment] = useState({
    tracking_number: '',
    origin: '',
    destination: '',
    priority: 'normal',
    cargo_type: '',
    cargo_weight: '',
    cargo_volume: '',
    pickup_time: '',
    delivery_deadline: ''
  });

  useEffect(() => {
    fetchTrucks();
  }, []);



  const handleCreateShipment = async () => {
    try {
      await addShipment({
        ...newShipment,
        status: 'pending',
        cargo_weight: parseFloat(newShipment.cargo_weight),
        cargo_volume: parseFloat(newShipment.cargo_volume),
        pickup_time: newShipment.pickup_time ? new Date(newShipment.pickup_time).toISOString() : undefined,
        delivery_deadline: newShipment.delivery_deadline ? new Date(newShipment.delivery_deadline).toISOString() : undefined
      });
      
      // Reset form and close modal
      resetForm();
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating shipment:', err);
    }
  };

  const resetForm = () => {
    setNewShipment({
      tracking_number: '',
      origin: '',
      destination: '',
      priority: 'normal',
      cargo_type: '',
      cargo_weight: '',
      cargo_volume: '',
      pickup_time: '',
      delivery_deadline: ''
    });
  };

  const fetchTrucks = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/fleet/trucks');
      if (response.ok) {
        const trucksData = await response.json();
        setTrucks(trucksData);
      }
    } catch (err) {
      console.error('Error fetching trucks:', err);
    }
  };

  const handleEditShipment = (shipment: ShipmentData) => {
    setSelectedShipment(shipment);
    setNewShipment({
      tracking_number: shipment.tracking_number,
      origin: shipment.origin,
      destination: shipment.destination,
      priority: shipment.priority,
      cargo_type: shipment.cargo_type || '',
      cargo_weight: shipment.cargo_weight?.toString() || '',
      cargo_volume: shipment.cargo_volume?.toString() || '',
      pickup_time: shipment.pickup_time ? new Date(shipment.pickup_time).toISOString().slice(0, 16) : '',
      delivery_deadline: shipment.delivery_deadline ? new Date(shipment.delivery_deadline).toISOString().slice(0, 16) : ''
    });
    setShowEditModal(true);
  };

  const handleUpdateShipment = async () => {
    if (!selectedShipment) return;

    try {
      await updateShipment(selectedShipment.id, {
        ...newShipment,
        cargo_weight: newShipment.cargo_weight ? parseFloat(newShipment.cargo_weight) : undefined,
        cargo_volume: newShipment.cargo_volume ? parseFloat(newShipment.cargo_volume) : undefined,
        pickup_time: newShipment.pickup_time ? new Date(newShipment.pickup_time).toISOString() : undefined,
        delivery_deadline: newShipment.delivery_deadline ? new Date(newShipment.delivery_deadline).toISOString() : undefined
      });
      
      resetForm();
      setShowEditModal(false);
      setSelectedShipment(null);
    } catch (err) {
      console.error('Error updating shipment:', err);
    }
  };

  const handleDeleteShipment = async () => {
    if (!selectedShipment) return;

    try {
      await deleteShipment(selectedShipment.id);
      setShowDeleteModal(false);
      setSelectedShipment(null);
    } catch (err) {
      console.error('Error deleting shipment:', err);
    }
  };

  const handleTrackShipment = (shipment: ShipmentData) => {
    setSelectedShipment(shipment);
    setShowTrackModal(true);
  };

  const handleAssignTruck = (shipment: ShipmentData) => {
    setSelectedShipment(shipment);
    fetchTrucks();
    setShowAssignModal(true);
  };

  const handleTruckAssignment = async (truckId: number) => {
    if (!selectedShipment) return;

    try {
      const response = await fetch('http://localhost:8000/api/shipments/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipment_id: selectedShipment.id,
          truck_id: truckId
        })
      });

      if (response.ok) {
        setShowAssignModal(false);
        setSelectedShipment(null);
      } else {
        const errorData = await response.json();
        console.error(`Failed to assign truck: ${errorData.detail || 'Unknown error'}`);
      }
          } catch (err) {
        console.error('Error assigning truck:', err);
      }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'var(--color-warning)';
      case 'assigned': return 'var(--color-info)';
      case 'in_transit': return 'var(--color-primary)';
      case 'delivered': return 'var(--color-success)';
      case 'cancelled': return 'var(--color-danger)';
      default: return 'var(--color-text-secondary)';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={20} weight="fill" />;
      case 'assigned': return <Truck size={20} weight="fill" />;
      case 'in_transit': return <MapPin size={20} weight="fill" />;
      case 'delivered': return <Check size={20} weight="fill" />;
      case 'cancelled': return <X size={20} weight="fill" />;
      default: return <Package size={20} weight="fill" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'var(--color-danger)';
      case 'normal': return 'var(--color-primary)';
      case 'low': return 'var(--color-success)';
      default: return 'var(--color-text-secondary)';
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
        <div style={{ fontSize: 'var(--text-xl)' }}>Loading shipment data...</div>
      </div>
    );
  }



  return (
    <div>
      <h2 style={{ 
        fontSize: 'var(--text-3xl)',
        fontWeight: 'var(--weight-semibold)',
        marginBottom: 'var(--space-4)',
        textAlign: 'center'
      }}>
        Shipment Management Dashboard
      </h2>

      {/* Shipment Overview */}
      {shipmentOverview && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-6)'
        }}>
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: 'var(--weight-bold)',
              color: 'var(--color-primary)'
            }}>
              {shipmentOverview.total_shipments}
            </div>
            <div style={{ color: 'var(--color-text-secondary)' }}>
              Total Shipments
            </div>
          </div>
          
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: 'var(--weight-bold)',
              color: 'var(--color-warning)'
            }}>
              {shipmentOverview.pending_shipments}
            </div>
            <div style={{ color: 'var(--color-text-secondary)' }}>
              Pending
            </div>
          </div>
          
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: 'var(--weight-bold)',
              color: 'var(--color-success)'
            }}>
              {shipmentOverview.completion_rate}%
            </div>
            <div style={{ color: 'var(--color-text-secondary)' }}>
              Completion Rate
            </div>
          </div>
          
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: 'var(--weight-bold)',
              color: 'var(--color-info)'
            }}>
              {shipmentOverview.avg_delivery_time_hours}h
            </div>
            <div style={{ color: 'var(--color-text-secondary)' }}>
              Avg Delivery Time
            </div>
          </div>
        </div>
      )}

      {/* Shipments List */}
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-4)'
        }}>
          <h3 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--weight-semibold)',
            color: 'var(--color-primary)'
          }}>
            Shipments ({shipments.length})
          </h3>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              background: 'var(--color-primary)',
              color: 'var(--color-on-primary)',
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-medium)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}
          >
            <Plus size={18} weight="regular" />
            Create Shipment
          </button>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: 'var(--space-4)'
        }}>
          {shipments.map((shipment) => (
            <div
              key={shipment.id}
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-4)'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 'var(--space-3)'
              }}>
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    marginBottom: 'var(--space-2)'
                  }}>
                    <h4 style={{
                      fontSize: 'var(--text-lg)',
                      fontWeight: 'var(--weight-semibold)',
                      margin: 0,
                      color: 'var(--color-text)'
                    }}>
                      {shipment.tracking_number}
                    </h4>
                    <span style={{
                      background: 'var(--color-primary-light)',
                      color: 'var(--color-primary)',
                      padding: 'var(--space-1) var(--space-2)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--weight-medium)',
                      textTransform: 'capitalize'
                    }}>
                      {shipment.priority}
                    </span>
                  </div>
                  <p style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--text-lg)',
                    margin: 0
                  }}>
                    {shipment.cargo_type || 'General'} • {shipment.cargo_weight || 0} lbs • {shipment.cargo_volume || 0} cu ft
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  color: getStatusColor(shipment.status)
                }}>
                  {getStatusIcon(shipment.status)}
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)' }}>
                    {shipment.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--space-3)',
                marginBottom: 'var(--space-5)'
              }}>
                <div>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)' }}>
                    From
                  </span>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)' }}>
                    {shipment.origin}
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)' }}>
                    To
                  </span>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)' }}>
                    {shipment.destination}
                  </div>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                gap: 'var(--space-2)'
              }}>
                <button
                  onClick={() => handleEditShipment(shipment)}
                  style={{
                    background: 'transparent',
                    color: 'var(--color-text-secondary)',
                    padding: 'var(--space-1) var(--space-2)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-text-secondary)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-xs)',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--space-1)'
                  }}
                >
                  <PencilSimple size={12} /> Edit
                </button>
                <button
                  onClick={() => handleAssignTruck(shipment)}
                  style={{
                    background: 'transparent',
                    color: 'var(--color-text-secondary)',
                    padding: 'var(--space-1) var(--space-2)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-text-secondary)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-xs)',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--space-1)'
                  }}
                >
                  <Truck size={12} /> Assign
                </button>
                <button
                  onClick={() => handleTrackShipment(shipment)}
                  style={{
                    background: 'transparent',
                    color: 'var(--color-text-secondary)',
                    padding: 'var(--space-1) var(--space-2)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-text-secondary)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-xs)',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--space-1)'
                  }}
                >
                  <MapPin size={12} /> Track
                </button>
                <button
                  onClick={() => { setSelectedShipment(shipment); setShowDeleteModal(true); }}
                  style={{
                    background: 'transparent',
                    color: 'var(--color-danger)',
                    padding: 'var(--space-1) var(--space-2)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-danger)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-xs)',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--space-1)'
                  }}
                >
                  <Trash size={12} /> Delete
                </button>
              </div>
              
              {/* PDF Generator for this shipment */}
              <PDFGenerator 
                shipmentId={shipment.id} 
              />
            </div>
          ))}
        </div>
      </div>

      {/* Create Shipment Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6)',
            width: '90%',
            maxWidth: '700px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--space-4)'
            }}>
              <h3 style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--color-text)',
                margin: 0
              }}>
                Create New Shipment
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 'var(--space-1)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-text-secondary)'
                }}
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleCreateShipment(); }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--space-4)',
                marginBottom: 'var(--space-4)'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--color-text)'
                  }}>
                    Tracking Number *
                  </label>
                  <input
                    type="text"
                    value={newShipment.tracking_number}
                    onChange={(e) => setNewShipment({...newShipment, tracking_number: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: 'var(--space-2)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-bg)',
                      color: 'var(--color-text)'
                    }}
                    placeholder="SH001"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--color-text)'
                  }}>
                    Priority
                  </label>
                  <select
                    value={newShipment.priority}
                    onChange={(e) => setNewShipment({...newShipment, priority: e.target.value})}
                    style={{
                      width: '100%',
                      padding: 'var(--space-2)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-bg)',
                      color: 'var(--color-text)'
                    }}
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--color-text)'
                  }}>
                    Origin *
                  </label>
                  <input
                    type="text"
                    value={newShipment.origin}
                    onChange={(e) => setNewShipment({...newShipment, origin: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: 'var(--space-2)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-bg)',
                      color: 'var(--color-text)'
                    }}
                    placeholder="New York, NY"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--color-text)'
                  }}>
                    Destination *
                  </label>
                  <input
                    type="text"
                    value={newShipment.destination}
                    onChange={(e) => setNewShipment({...newShipment, destination: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: 'var(--space-2)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-bg)',
                      color: 'var(--color-text)'
                    }}
                    placeholder="Los Angeles, CA"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--color-text)'
                  }}>
                    Cargo Type *
                  </label>
                  <input
                    type="text"
                    value={newShipment.cargo_type}
                    onChange={(e) => setNewShipment({...newShipment, cargo_type: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: 'var(--space-2)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-bg)',
                      color: 'var(--color-text)'
                    }}
                    placeholder="Electronics"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--color-text)'
                  }}>
                    Cargo Weight (lbs) *
                  </label>
                  <input
                    type="number"
                    value={newShipment.cargo_weight}
                    onChange={(e) => setNewShipment({...newShipment, cargo_weight: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: 'var(--space-2)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-bg)',
                      color: 'var(--color-text)'
                    }}
                    placeholder="1000"
                    min="0"
                    step="0.1"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--color-text)'
                  }}>
                    Cargo Volume (cu ft) *
                  </label>
                  <input
                    type="number"
                    value={newShipment.cargo_volume}
                    onChange={(e) => setNewShipment({...newShipment, cargo_volume: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: 'var(--space-2)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-bg)',
                      color: 'var(--color-text)'
                    }}
                    placeholder="50"
                    min="0"
                    step="0.1"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--color-text)'
                  }}>
                    Pickup Time
                  </label>
                  <input
                    type="datetime-local"
                    value={newShipment.pickup_time}
                    onChange={(e) => setNewShipment({...newShipment, pickup_time: e.target.value})}
                    style={{
                      width: '100%',
                      padding: 'var(--space-2)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-bg)',
                      color: 'var(--color-text)'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--color-text)'
                  }}>
                    Delivery Deadline
                  </label>
                  <input
                    type="datetime-local"
                    value={newShipment.delivery_deadline}
                    onChange={(e) => setNewShipment({...newShipment, delivery_deadline: e.target.value})}
                    style={{
                      width: '100%',
                      padding: 'var(--space-2)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-bg)',
                      color: 'var(--color-text)'
                    }}
                  />
                </div>
              </div>



              <div style={{
                display: 'flex',
                gap: 'var(--space-3)',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  style={{
                    background: 'transparent',
                    color: 'var(--color-text-secondary)',
                    border: '1px solid var(--color-border)',
                    padding: 'var(--space-2) var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: 'var(--color-primary)',
                    color: 'var(--color-on-primary)',
                    border: 'none',
                    padding: 'var(--space-2) var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--weight-medium)'
                  }}
                >
                  Create Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Shipment Modal */}
      {showEditModal && selectedShipment && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--color-bg)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6)',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--space-4)'
            }}>
              <h3 style={{ margin: 0, color: 'var(--color-text)' }}>Edit Shipment</h3>
              <button
                onClick={() => { setShowEditModal(false); setSelectedShipment(null); resetForm(); }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-secondary)'
                }}
              >
                <X size={20} weight="bold" />
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateShipment(); }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: 'var(--space-4)',
                marginBottom: 'var(--space-6)'
              }}>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--color-text)'
                  }}>
                    Tracking Number *
                  </label>
                  <input
                    type="text"
                    value={newShipment.tracking_number}
                    onChange={(e) => setNewShipment({...newShipment, tracking_number: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: 'var(--space-3)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-bg)',
                      color: 'var(--color-text)',
                      fontSize: 'var(--text-sm)',
                      transition: 'all var(--motion-duration) var(--motion-ease-standard)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--color-primary)';
                      e.target.style.boxShadow = '0 0 0 3px var(--focus-ring-color)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--color-border)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--color-text)'
                  }}>
                    Priority
                  </label>
                  <select
                    value={newShipment.priority}
                    onChange={(e) => setNewShipment({...newShipment, priority: e.target.value})}
                    style={{
                      width: '100%',
                      padding: 'var(--space-3)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-bg)',
                      color: 'var(--color-text)',
                      fontSize: 'var(--text-sm)',
                      transition: 'all var(--motion-duration) var(--motion-ease-standard)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--color-primary)';
                      e.target.style.boxShadow = '0 0 0 3px var(--focus-ring-color)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--color-border)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  onClick={() => { setShowEditModal(false); setSelectedShipment(null); resetForm(); }}
                  style={{
                    background: 'transparent',
                    color: 'var(--color-text-secondary)',
                    border: '1px solid var(--color-border)',
                    padding: 'var(--space-2) var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--weight-medium)',
                    transition: 'all var(--motion-duration) var(--motion-ease-standard)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-surface-alt)';
                    e.currentTarget.style.borderColor = 'var(--color-text-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{
                    background: 'var(--color-primary)',
                    color: 'var(--color-on-primary)',
                    border: 'none',
                    padding: 'var(--space-2) var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--weight-medium)',
                    transition: 'all var(--motion-duration) var(--motion-ease-standard)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-primary-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--color-primary)';
                  }}
                >
                  Update Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Track Shipment Modal */}
      {showTrackModal && selectedShipment && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--color-bg)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6)',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--space-4)'
            }}>
              <h3 style={{ margin: 0, color: 'var(--color-text)' }}>Track Shipment: {selectedShipment.tracking_number}</h3>
              <button
                onClick={() => { setShowTrackModal(false); setSelectedShipment(null); }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-secondary)'
                }}
              >
                <X size={20} weight="bold" />
              </button>
            </div>
            
            {/* Google Maps Integration */}
            <GoogleMapsTracker
              trucks={truckLocations}
              selectedShipment={{
                origin: { lat: 37.7749, lng: -122.4194, address: selectedShipment.origin },
                destination: { lat: 34.0522, lng: -118.2437, address: selectedShipment.destination }
              }}
              height="400px"
            />
            
            {/* Shipment Details */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-4)'
            }}>
              <div>
                <div style={{ fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-1)' }}>Status</div>
                <div style={{ color: getStatusColor(selectedShipment.status) }}>{selectedShipment.status.toUpperCase()}</div>
              </div>
              <div>
                <div style={{ fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-1)' }}>Priority</div>
                <div style={{ color: getPriorityColor(selectedShipment.priority) }}>{selectedShipment.priority.toUpperCase()}</div>
              </div>
              <div>
                <div style={{ fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-1)' }}>Cargo Type</div>
                <div>{selectedShipment.cargo_type || 'N/A'}</div>
              </div>
              <div>
                <div style={{ fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-1)' }}>Weight</div>
                <div>{selectedShipment.cargo_weight ? `${selectedShipment.cargo_weight} lbs` : 'N/A'}</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setShowTrackModal(false); setSelectedShipment(null); }}
                style={{
                  background: 'var(--color-primary)',
                  color: 'var(--color-on-primary)',
                  border: 'none',
                  padding: 'var(--space-2) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--weight-medium)'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Truck Modal */}
      {showAssignModal && selectedShipment && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--color-bg)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6)',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--space-4)'
            }}>
              <h3 style={{ margin: 0, color: 'var(--color-text)' }}>Assign Truck to {selectedShipment.tracking_number}</h3>
              <button
                onClick={() => { setShowAssignModal(false); setSelectedShipment(null); }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-secondary)'
                }}
              >
                <X size={20} weight="bold" />
              </button>
            </div>
            
            <div style={{
              display: 'grid',
              gap: 'var(--space-3)',
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              {trucks.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: 'var(--space-6)' }}>
                  No trucks available
                </div>
              ) : (
                trucks.map((truck) => (
                  <div
                    key={truck.id}
                    style={{
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-4)',
                      background: 'var(--color-surface)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => handleTruckAssignment(truck.id)}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 'var(--space-2)'
                    }}>
                      <div style={{ fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-lg)' }}>
                        {truck.plate_number}
                      </div>
                      <div style={{
                        background: truck.status === 'available' ? 'var(--color-success)' : 'var(--color-warning)',
                        color: 'white',
                        padding: 'var(--space-1) var(--space-2)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--weight-bold)'
                      }}>
                        {truck.status?.toUpperCase() || 'AVAILABLE'}
                      </div>
                    </div>
                    <div style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-1)' }}>
                      {truck.make} {truck.model} ({truck.year})
                    </div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                      Capacity: {truck.capacity_weight || 0} lbs, {truck.capacity_volume || 0} ft³
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
              <button
                onClick={() => { setShowAssignModal(false); setSelectedShipment(null); }}
                style={{
                  background: 'transparent',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border)',
                  padding: 'var(--space-2) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedShipment && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--color-bg)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6)',
            maxWidth: '400px',
            width: '90%'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              marginBottom: 'var(--space-4)'
            }}>
              <Warning size={24} weight="fill" style={{ color: 'var(--color-danger)' }} />
              <h3 style={{ margin: 0, color: 'var(--color-text)' }}>Delete Shipment</h3>
            </div>
            
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
              Are you sure you want to delete shipment <strong>{selectedShipment.tracking_number}</strong>? 
              This action cannot be undone.
            </p>
            
            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setShowDeleteModal(false); setSelectedShipment(null); }}
                style={{
                  background: 'transparent',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border)',
                  padding: 'var(--space-2) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteShipment}
                style={{
                  background: 'var(--color-danger)',
                  color: 'var(--color-on-danger)',
                  border: 'none',
                  padding: 'var(--space-2) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--weight-medium)'
                }}
              >
                Delete Shipment
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer Note */}
      <div style={{
        marginTop: 'var(--space-8)',
        padding: 'var(--space-4)',
        background: 'var(--color-surface-alt)',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-secondary)',
        textAlign: 'center',
        border: '1px solid var(--color-border)'
      }}>
                        <strong>Note:</strong> Documents are generated with sample data for demonstration.
      </div>
    </div>
  );
}
