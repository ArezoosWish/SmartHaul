import React, { useState, useEffect } from 'react';
import { Package, Plus, Truck, MapPin, Calendar, Weight, Cube, X, Check, Clock } from '@phosphor-icons/react';

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
  const [shipments, setShipments] = useState<ShipmentData[]>([]);
  const [shipmentOverview, setShipmentOverview] = useState<ShipmentOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
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
    fetchShipmentData();
  }, []);

  const fetchShipmentData = async () => {
    try {
      setLoading(true);
      
      // Fetch shipments
      const shipmentsResponse = await fetch('http://localhost:8000/api/shipments/');
      if (shipmentsResponse.ok) {
        const shipmentsData = await shipmentsResponse.json();
        setShipments(shipmentsData);
      }
      
      // Fetch shipment overview
      const overviewResponse = await fetch('http://localhost:8000/api/shipments/analytics/overview');
      if (overviewResponse.ok) {
        const overviewData = await overviewResponse.json();
        setShipmentOverview(overviewData);
      }
      
    } catch (err) {
      setError('Failed to fetch shipment data');
      console.error('Error fetching shipment data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShipment = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/shipments/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newShipment,
          cargo_weight: parseFloat(newShipment.cargo_weight),
          cargo_volume: parseFloat(newShipment.cargo_volume),
          pickup_time: newShipment.pickup_time ? new Date(newShipment.pickup_time).toISOString() : null,
          delivery_deadline: newShipment.delivery_deadline ? new Date(newShipment.delivery_deadline).toISOString() : null
        })
      });

      if (response.ok) {
        // Refresh shipment data
        await fetchShipmentData();
        // Reset form and close modal
        resetForm();
        setShowCreateModal(false);
      } else {
        const errorData = await response.json();
        setError(`Failed to create shipment: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (err) {
      setError('Failed to create shipment');
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

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
        <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-xl)' }}>Error: {error}</div>
        <button
          onClick={fetchShipmentData}
          style={{
            background: 'var(--color-primary)',
            color: 'var(--color-on-primary)',
            padding: 'var(--space-2) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            cursor: 'pointer',
            marginTop: 'var(--space-4)'
          }}
        >
          Retry
        </button>
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
                  <h4 style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: 'var(--weight-semibold)',
                    marginBottom: 'var(--space-1)',
                    color: 'var(--color-text)'
                  }}>
                    {shipment.tracking_number}
                  </h4>
                  <p style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--text-sm)'
                  }}>
                    {shipment.cargo_type} • {shipment.cargo_weight} lbs • {shipment.cargo_volume} cu ft
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)'
                }}>
                  <span style={{
                    background: getPriorityColor(shipment.priority),
                    color: 'white',
                    padding: 'var(--space-1) var(--space-2)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--weight-medium)',
                    textTransform: 'uppercase'
                  }}>
                    {shipment.priority}
                  </span>
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
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--space-3)',
                marginBottom: 'var(--space-3)'
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
                  style={{
                    background: 'transparent',
                    color: 'var(--color-primary)',
                    padding: 'var(--space-1) var(--space-2)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-primary)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-xs)',
                    flex: 1
                  }}
                >
                  View Details
                </button>
                <button
                  style={{
                    background: 'transparent',
                    color: 'var(--color-warning)',
                    padding: 'var(--space-1) var(--space-2)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-warning)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-xs)',
                    flex: 1
                  }}
                >
                  Assign Truck
                </button>
                <button
                  style={{
                    background: 'transparent',
                    color: 'var(--color-info)',
                    padding: 'var(--space-1) var(--space-2)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-info)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-xs)',
                    flex: 1
                  }}
                >
                  Track
                </button>
              </div>
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
    </div>
  );
}
