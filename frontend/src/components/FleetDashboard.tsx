import React, { useState, useEffect } from 'react';
import { Truck, Plus, Wrench, GasPump, MapPin, Gauge, X, PencilSimple, Trash, Eye, Warning } from '@phosphor-icons/react';

interface TruckData {
  id: number;
  plate_number: string;
  make?: string;
  model?: string;
  year?: number;
  status: string;
  current_lat?: number;
  current_lng?: number;
  temperature?: number;
  capacity_volume?: number;
  capacity_weight?: number;
  fuel_type?: string;
  fuel_efficiency?: number;
  driver_id?: number;
  last_maintenance?: string;
  next_maintenance?: string;
  total_miles: number;
  created_at: string;
  updated_at: string;
}

interface FleetOverview {
  total_trucks: number;
  available_trucks: number;
  in_use_trucks: number;
  maintenance_trucks: number;
  total_fleet_miles: number;
  utilization_rate: number;
}

const FleetDashboard: React.FC = () => {
  const [trucks, setTrucks] = useState<TruckData[]>([]);
  const [fleetOverview, setFleetOverview] = useState<FleetOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'trucks' | 'maintenance' | 'analytics'>('overview');
  const [showAddTruckModal, setShowAddTruckModal] = useState(false);
  const [showEditTruckModal, setShowEditTruckModal] = useState(false);
  const [showDeleteTruckModal, setShowDeleteTruckModal] = useState(false);
  const [showViewTruckModal, setShowViewTruckModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState<TruckData | null>(null);
  const [newTruck, setNewTruck] = useState({
    plate_number: '',
    make: '',
    model: '',
    year: '',
    capacity_volume: '',
    capacity_weight: '',
    fuel_type: '',
    fuel_efficiency: '',
    driver_id: ''
  });

  useEffect(() => {
    fetchFleetData();
  }, []);

  const fetchFleetData = async () => {
    try {
      setLoading(true);
      
      // Fetch trucks
      const trucksResponse = await fetch('http://localhost:8000/api/fleet/trucks');
      if (trucksResponse.ok) {
        const trucksData = await trucksResponse.json();
        setTrucks(trucksData);
      }
      
      // Fetch fleet overview
      const overviewResponse = await fetch('http://localhost:8000/api/fleet/analytics/fleet-overview');
      if (overviewResponse.ok) {
        const overviewData = await overviewResponse.json();
        setFleetOverview(overviewData);
      }
      
    } catch (err) {
      setError('Failed to fetch fleet data');
      console.error('Error fetching fleet data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'var(--color-success)';
      case 'in_use': return 'var(--color-primary)';
      case 'maintenance': return 'var(--color-warning)';
      case 'out_of_service': return 'var(--color-danger)';
      default: return 'var(--color-text-secondary)';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <Truck size={20} weight="fill" />;
      case 'in_use': return <MapPin size={20} weight="fill" />;
      case 'maintenance': return <Wrench size={20} weight="fill" />;
      case 'out_of_service': return <Truck size={20} weight="fill" />;
      default: return <Truck size={20} weight="fill" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  const handleAddTruck = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/fleet/trucks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newTruck,
          year: newTruck.year ? parseInt(newTruck.year) : null,
          capacity_volume: newTruck.capacity_volume ? parseFloat(newTruck.capacity_volume) : null,
          capacity_weight: newTruck.capacity_weight ? parseFloat(newTruck.capacity_weight) : null,
          fuel_efficiency: newTruck.fuel_efficiency ? parseFloat(newTruck.fuel_efficiency) : null,
          driver_id: newTruck.driver_id ? parseInt(newTruck.driver_id) : null
        })
      });

      if (response.ok) {
        // Refresh fleet data
        await fetchFleetData();
        // Reset form and close modal
        setNewTruck({
          plate_number: '',
          make: '',
          model: '',
          year: '',
          capacity_volume: '',
          capacity_weight: '',
          fuel_type: '',
          fuel_efficiency: '',
          driver_id: ''
        });
        setShowAddTruckModal(false);
      } else {
        const errorData = await response.json();
        setError(`Failed to create truck: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (err) {
      setError('Failed to create truck');
      console.error('Error creating truck:', err);
    }
  };

  const resetForm = () => {
    setNewTruck({
      plate_number: '',
      make: '',
      model: '',
      year: '',
      capacity_volume: '',
      capacity_weight: '',
      fuel_type: '',
      fuel_efficiency: '',
      driver_id: ''
    });
  };

  const handleEditTruck = (truck: TruckData) => {
    setSelectedTruck(truck);
    setNewTruck({
      plate_number: truck.plate_number,
      make: truck.make || '',
      model: truck.model || '',
      year: truck.year?.toString() || '',
      capacity_volume: truck.capacity_volume?.toString() || '',
      capacity_weight: truck.capacity_weight?.toString() || '',
      fuel_type: truck.fuel_type || '',
      fuel_efficiency: truck.fuel_efficiency?.toString() || '',
      driver_id: truck.driver_id?.toString() || ''
    });
    setShowEditTruckModal(true);
  };

  const handleUpdateTruck = async () => {
    if (!selectedTruck) return;

    try {
      const response = await fetch(`http://localhost:8000/api/fleet/trucks/${selectedTruck.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTruck,
          year: newTruck.year ? parseInt(newTruck.year) : null,
          capacity_volume: newTruck.capacity_volume ? parseFloat(newTruck.capacity_volume) : null,
          capacity_weight: newTruck.capacity_weight ? parseFloat(newTruck.capacity_weight) : null,
          fuel_efficiency: newTruck.fuel_efficiency ? parseFloat(newTruck.fuel_efficiency) : null,
          driver_id: newTruck.driver_id ? parseInt(newTruck.driver_id) : null
        })
      });

      if (response.ok) {
        await fetchFleetData();
        resetForm();
        setShowEditTruckModal(false);
        setSelectedTruck(null);
      } else {
        const errorData = await response.json();
        setError(`Failed to update truck: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (err) {
      setError('Failed to update truck');
      console.error('Error updating truck:', err);
    }
  };

  const handleDeleteTruck = async () => {
    if (!selectedTruck) return;

    try {
      const response = await fetch(`http://localhost:8000/api/fleet/trucks/${selectedTruck.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchFleetData();
        setShowDeleteTruckModal(false);
        setSelectedTruck(null);
      } else {
        const errorData = await response.json();
        setError(`Failed to delete truck: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (err) {
      setError('Failed to delete truck');
      console.error('Error deleting truck:', err);
    }
  };

  const handleViewTruck = (truck: TruckData) => {
    setSelectedTruck(truck);
    setShowViewTruckModal(true);
  };

  const handleMaintenance = (truck: TruckData) => {
    setSelectedTruck(truck);
    setShowMaintenanceModal(true);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
        <div style={{ fontSize: 'var(--text-xl)' }}>Loading fleet data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
        <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-xl)' }}>Error: {error}</div>
        <button
          onClick={fetchFleetData}
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
        Fleet Management Dashboard
      </h2>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        marginBottom: 'var(--space-6)',
        borderBottom: '1px solid var(--color-border)',
        paddingBottom: 'var(--space-4)'
      }}>
        {[
          { key: 'overview', label: 'Overview', icon: <Gauge size={18} weight="regular" /> },
          { key: 'trucks', label: 'Trucks', icon: <Truck size={18} weight="regular" /> },
          { key: 'maintenance', label: 'Maintenance', icon: <Wrench size={18} weight="regular" /> },
          { key: 'analytics', label: 'Analytics', icon: <GasPump size={18} weight="regular" /> }
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            style={{
              background: activeTab === key ? 'var(--color-primary)' : 'transparent',
              color: activeTab === key ? 'var(--color-on-primary)' : 'var(--color-text)',
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-medium)',
              transition: 'all var(--motion-duration) var(--motion-ease-standard)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div>
          <h3 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--weight-semibold)',
            marginBottom: 'var(--space-4)',
            textAlign: 'center',
            color: 'var(--color-primary)'
          }}>
            Fleet Overview
          </h3>
          
          {fleetOverview && (
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
                  {fleetOverview.total_trucks}
                </div>
                <div style={{ color: 'var(--color-text-secondary)' }}>
                  Total Trucks
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
                  {fleetOverview.available_trucks}
                </div>
                <div style={{ color: 'var(--color-text-secondary)' }}>
                  Available
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
                  color: 'var(--color-primary)'
                }}>
                  {fleetOverview.in_use_trucks}
                </div>
                <div style={{ color: 'var(--color-text-secondary)' }}>
                  In Use
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
                  {fleetOverview.maintenance_trucks}
                </div>
                <div style={{ color: 'var(--color-text-secondary)' }}>
                  Maintenance
                </div>
              </div>
            </div>
          )}
          
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6)',
            textAlign: 'center'
          }}>
            <h4 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--weight-semibold)',
              marginBottom: 'var(--space-3)',
              color: 'var(--color-primary)'
            }}>
              Fleet Utilization
            </h4>
            <div style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 'var(--weight-bold)',
              color: 'var(--color-success)',
              marginBottom: 'var(--space-2)'
            }}>
              {fleetOverview?.utilization_rate.toFixed(1)}%
            </div>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              {fleetOverview?.in_use_trucks} of {fleetOverview?.total_trucks} trucks currently in use
            </p>
          </div>
        </div>
      )}

      {activeTab === 'trucks' && (
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
              Fleet Trucks
            </h3>
            <button
              onClick={() => setShowAddTruckModal(true)}
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
              Add Truck
            </button>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: 'var(--space-4)'
          }}>
            {trucks.map((truck) => (
              <div
                key={truck.id}
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
                      {truck.plate_number}
                    </h4>
                    <p style={{
                      color: 'var(--color-text-secondary)',
                      fontSize: 'var(--text-sm)'
                    }}>
                      {truck.make} {truck.model} {truck.year}
                    </p>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    color: getStatusColor(truck.status)
                  }}>
                    {getStatusIcon(truck.status)}
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)' }}>
                      {truck.status.replace('_', ' ')}
                    </span>
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
                      Capacity
                    </span>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)' }}>
                      {truck.capacity_weight ? `${truck.capacity_weight} lbs` : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)' }}>
                      Fuel Type
                    </span>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)' }}>
                      {truck.fuel_type || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)' }}>
                      Total Miles
                    </span>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)' }}>
                      {truck.total_miles.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)' }}>
                      Last Updated
                    </span>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)' }}>
                      {formatDate(truck.updated_at)}
                    </div>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  gap: 'var(--space-2)'
                }}>
                  <button
                    onClick={() => handleViewTruck(truck)}
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
                    <Eye size={12} /> View
                  </button>
                  <button
                    onClick={() => handleEditTruck(truck)}
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
                    onClick={() => handleMaintenance(truck)}
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
                    <Wrench size={12} /> Maintenance
                  </button>
                  <button
                    onClick={() => { setSelectedTruck(truck); setShowDeleteTruckModal(true); }}
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
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div>
          <h3 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--weight-semibold)',
            marginBottom: 'var(--space-4)',
            textAlign: 'center',
            color: 'var(--color-primary)'
          }}>
            Maintenance Management
          </h3>
          <p style={{
            textAlign: 'center',
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--text-lg)'
          }}>
            Track maintenance schedules, costs, and service history
          </p>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div>
          <h3 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--weight-semibold)',
            marginBottom: 'var(--space-4)',
            textAlign: 'center',
            color: 'var(--color-primary)'
          }}>
            Fleet Analytics
          </h3>
          <p style={{
            textAlign: 'center',
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--text-lg)'
          }}>
            Performance metrics, fuel efficiency, and cost analysis
          </p>
        </div>
      )}

      {/* Add New Truck Modal */}
      {showAddTruckModal && (
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
            maxWidth: '600px',
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
                Add New Truck
              </h3>
              <button
                onClick={() => {
                  setShowAddTruckModal(false);
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

            <form onSubmit={(e) => { e.preventDefault(); handleAddTruck(); }}>
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
                    Plate Number *
                  </label>
                  <input
                    type="text"
                    value={newTruck.plate_number}
                    onChange={(e) => setNewTruck({...newTruck, plate_number: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: 'var(--space-2)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-bg)',
                      color: 'var(--color-text)'
                    }}
                    placeholder="ABC123"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--color-text)'
                  }}>
                    Make
                  </label>
                  <input
                    type="text"
                    value={newTruck.make}
                    onChange={(e) => setNewTruck({...newTruck, make: e.target.value})}
                    style={{
                      width: '100%',
                      padding: 'var(--space-2)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-bg)',
                      color: 'var(--color-text)'
                    }}
                    placeholder="Ford"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--color-text)'
                  }}>
                    Model
                  </label>
                  <input
                    type="text"
                    value={newTruck.model}
                    onChange={(e) => setNewTruck({...newTruck, model: e.target.value})}
                    style={{
                      width: '100%',
                      padding: 'var(--space-2)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-bg)',
                      color: 'var(--color-text)'
                    }}
                    placeholder="F-150"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--color-text)'
                  }}>
                    Year
                  </label>
                  <input
                    type="number"
                    value={newTruck.year}
                    onChange={(e) => setNewTruck({...newTruck, year: e.target.value})}
                    style={{
                      width: '100%',
                      padding: 'var(--space-2)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-bg)',
                      color: 'var(--color-text)'
                    }}
                    placeholder="2020"
                    min="1900"
                    max="2030"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--color-text)'
                  }}>
                    Capacity Weight (lbs)
                  </label>
                  <input
                    type="number"
                    value={newTruck.capacity_weight}
                    onChange={(e) => setNewTruck({...newTruck, capacity_weight: e.target.value})}
                    style={{
                      width: '100%',
                      padding: 'var(--space-2)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-bg)',
                      color: 'var(--color-text)'
                    }}
                    placeholder="10000"
                    min="0"
                    step="100"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--color-text)'
                  }}>
                    Fuel Type
                  </label>
                  <select
                    value={newTruck.fuel_type}
                    onChange={(e) => setNewTruck({...newTruck, fuel_type: e.target.value})}
                    style={{
                      width: '100%',
                      padding: 'var(--space-2)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-bg)',
                      color: 'var(--color-text)'
                    }}
                  >
                    <option value="">Select fuel type</option>
                    <option value="diesel">Diesel</option>
                    <option value="gasoline">Gasoline</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
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
                    setShowAddTruckModal(false);
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
                  Add Truck
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Truck Modal */}
      {showEditTruckModal && selectedTruck && (
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
              <h3 style={{ margin: 0, color: 'var(--color-text)' }}>Edit Truck: {selectedTruck.plate_number}</h3>
              <button
                onClick={() => { setShowEditTruckModal(false); setSelectedTruck(null); resetForm(); }}
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
            
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateTruck(); }}>
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
                    Plate Number *
                  </label>
                  <input
                    type="text"
                    value={newTruck.plate_number}
                    onChange={(e) => setNewTruck({...newTruck, plate_number: e.target.value})}
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
                    Make
                  </label>
                  <input
                    type="text"
                    value={newTruck.make}
                    onChange={(e) => setNewTruck({...newTruck, make: e.target.value})}
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
                    Model
                  </label>
                  <input
                    type="text"
                    value={newTruck.model}
                    onChange={(e) => setNewTruck({...newTruck, model: e.target.value})}
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
                    Year
                  </label>
                  <input
                    type="number"
                    value={newTruck.year}
                    onChange={(e) => setNewTruck({...newTruck, year: e.target.value})}
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
              </div>
              
              <div style={{ 
                display: 'flex', 
                gap: 'var(--space-4)', 
                justifyContent: 'flex-end',
                marginTop: 'var(--space-6)',
                paddingTop: 'var(--space-4)',
                borderTop: '1px solid var(--color-border)'
              }}>
                <button 
                  type="button" 
                  onClick={() => { setShowEditTruckModal(false); setSelectedTruck(null); resetForm(); }}
                  style={{
                    background: 'transparent',
                    color: 'var(--color-text-secondary)',
                    border: '1px solid var(--color-border)',
                    padding: 'var(--space-3) var(--space-6)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--weight-medium)',
                    transition: 'all var(--motion-duration) var(--motion-ease-standard)',
                    minWidth: '120px'
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
                    padding: 'var(--space-3) var(--space-6)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--weight-medium)',
                    transition: 'all var(--motion-duration) var(--motion-ease-standard)',
                    minWidth: '140px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-primary-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--color-primary)';
                  }}
                >
                  Update Truck
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Truck Details Modal */}
      {showViewTruckModal && selectedTruck && (
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
              <h3 style={{ margin: 0, color: 'var(--color-text)' }}>Truck Details: {selectedTruck.plate_number}</h3>
              <button
                onClick={() => { setShowViewTruckModal(false); setSelectedTruck(null); }}
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-4)'
            }}>
              <div>
                <div style={{ fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-1)' }}>Plate Number</div>
                <div>{selectedTruck.plate_number}</div>
              </div>
              <div>
                <div style={{ fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-1)' }}>Make & Model</div>
                <div>{selectedTruck.make} {selectedTruck.model} ({selectedTruck.year})</div>
              </div>
              <div>
                <div style={{ fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-1)' }}>Status</div>
                <div style={{ 
                  color: selectedTruck.status === 'available' ? 'var(--color-success)' : 
                        selectedTruck.status === 'in_use' ? 'var(--color-warning)' : 
                        'var(--color-danger)'
                }}>
                  {selectedTruck.status?.toUpperCase() || 'AVAILABLE'}
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-1)' }}>Capacity</div>
                <div>{selectedTruck.capacity_weight || 0} lbs, {selectedTruck.capacity_volume || 0} ft³</div>
              </div>
              <div>
                <div style={{ fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-1)' }}>Fuel Type</div>
                <div>{selectedTruck.fuel_type || 'N/A'}</div>
              </div>
              <div>
                <div style={{ fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-1)' }}>Total Miles</div>
                <div>{selectedTruck.total_miles?.toLocaleString() || 0} miles</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setShowViewTruckModal(false); setSelectedTruck(null); }}
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

      {/* Maintenance Modal */}
      {showMaintenanceModal && selectedTruck && (
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
            maxWidth: '500px',
            width: '90%'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--space-4)'
            }}>
              <h3 style={{ margin: 0, color: 'var(--color-text)' }}>Schedule Maintenance</h3>
              <button
                onClick={() => { setShowMaintenanceModal(false); setSelectedTruck(null); }}
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
            
            <p style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>
              Schedule maintenance for truck <strong>{selectedTruck.plate_number}</strong>
            </p>
            
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: 'var(--space-2)', 
                fontWeight: 'var(--weight-medium)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text)'
              }}>
                Maintenance Type
              </label>
              <select style={{
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
              }}>
                <option value="routine">Routine Maintenance</option>
                <option value="oil_change">Oil Change</option>
                <option value="tire_rotation">Tire Rotation</option>
                <option value="brake_service">Brake Service</option>
                <option value="engine_repair">Engine Repair</option>
                <option value="transmission">Transmission Service</option>
              </select>
            </div>
            
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: 'var(--space-2)', 
                fontWeight: 'var(--weight-medium)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text)'
              }}>
                Scheduled Date
              </label>
              <input
                type="date"
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
            
            <div style={{ 
              display: 'flex', 
              gap: 'var(--space-4)', 
              justifyContent: 'flex-end',
              marginTop: 'var(--space-6)',
              paddingTop: 'var(--space-4)',
              borderTop: '1px solid var(--color-border)'
            }}>
              <button
                onClick={() => { setShowMaintenanceModal(false); setSelectedTruck(null); }}
                style={{
                  background: 'transparent',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border)',
                  padding: 'var(--space-3) var(--space-6)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--weight-medium)',
                  transition: 'all var(--motion-duration) var(--motion-ease-standard)',
                  minWidth: '120px'
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
                onClick={() => {
                  // Here you would normally save the maintenance record
                  console.log('Schedule maintenance for truck:', selectedTruck.id);
                  setShowMaintenanceModal(false);
                  setSelectedTruck(null);
                }}
                style={{
                  background: 'var(--color-warning)',
                  color: 'var(--color-on-warning)',
                  border: 'none',
                  padding: 'var(--space-3) var(--space-6)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--weight-medium)',
                  transition: 'all var(--motion-duration) var(--motion-ease-standard)',
                  minWidth: '180px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--color-warning-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--color-warning)';
                }}
              >
                Schedule Maintenance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Truck Confirmation Modal */}
      {showDeleteTruckModal && selectedTruck && (
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
              <h3 style={{ margin: 0, color: 'var(--color-text)' }}>Delete Truck</h3>
            </div>
            
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
              Are you sure you want to delete truck <strong>{selectedTruck.plate_number}</strong>? 
              This action cannot be undone.
            </p>
            
            <div style={{ 
              display: 'flex', 
              gap: 'var(--space-4)', 
              justifyContent: 'flex-end',
              marginTop: 'var(--space-6)',
              paddingTop: 'var(--space-4)',
              borderTop: '1px solid var(--color-border)'
            }}>
              <button
                onClick={() => { setShowDeleteTruckModal(false); setSelectedTruck(null); }}
                style={{
                  background: 'transparent',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border)',
                  padding: 'var(--space-3) var(--space-6)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--weight-medium)',
                  transition: 'all var(--motion-duration) var(--motion-ease-standard)',
                  minWidth: '120px'
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
                onClick={handleDeleteTruck}
                style={{
                  background: 'var(--color-danger)',
                  color: 'var(--color-on-danger)',
                  border: 'none',
                  padding: 'var(--space-3) var(--space-6)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--weight-medium)',
                  transition: 'all var(--motion-duration) var(--motion-ease-standard)',
                  minWidth: '140px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--color-danger-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--color-danger)';
                }}
              >
                Delete Truck
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FleetDashboard;
