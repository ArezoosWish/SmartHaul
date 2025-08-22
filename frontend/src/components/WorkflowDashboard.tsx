import React, { useState, useEffect } from 'react';
import { Package, ArrowsClockwise, Users, FileText, Lightbulb } from '@phosphor-icons/react';
import { N8NWorkflowEditor } from './N8NWorkflowEditor';
import { config } from '../config';

interface Workflow {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  lastExecuted?: string;
  executionCount: number;
  successRate: number;
}

interface Shipment {
  id: number;
  tracking_number: string;
  origin: string;
  destination: string;
  status: string;
  created_at: string;
  eta: string;
}

interface DeliveryEvent {
  id: number;
  shipment_id: number;
  event_type: string;
  timestamp: string;
  location: string;
  notes: string;
}

interface Truck {
  id: number;
  plate_number: string;
  status: string;
  current_lat: number;
  current_lng: number;
  temperature: number;
}

interface User {
  id: number;
  email: string;
  role: string;
  created_at: string;
}

interface Document {
  id: number;
  shipment_id: number;
  type: string;
  original_url: string;
  verified: boolean;
  processed_at: string;
}

interface Prediction {
  id: number;
  shipment_id: number;
  predicted_delay: number;
  risk_score: number;
  factors: any;
}

export const WorkflowDashboard: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [deliveryEvents, setDeliveryEvents] = useState<DeliveryEvent[]>([]);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'shipments' | 'trucks' | 'users' | 'documents' | 'predictions' | 'workflows'>('shipments');

  useEffect(() => {
    loadMockWorkflows();
    loadDatabaseData();
  }, []);

  const loadDatabaseData = async () => {
    try {
      // Fetch all data from backend API
      const [shipmentsRes, eventsRes, trucksRes, usersRes, documentsRes, predictionsRes] = await Promise.all([
        fetch(`${config.apiBaseUrl}/shipments`),
        fetch(`${config.apiBaseUrl}/delivery-events`),
        fetch(`${config.apiBaseUrl}/trucks`),
        fetch(`${config.apiBaseUrl}/users`),
        fetch(`${config.apiBaseUrl}/documents`),
        fetch(`${config.apiBaseUrl}/predictions`)
      ]);

      if (shipmentsRes.ok) setShipments(await shipmentsRes.json());
      if (eventsRes.ok) setDeliveryEvents(await eventsRes.json());
      if (trucksRes.ok) setTrucks(await trucksRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (documentsRes.ok) setDocuments(await documentsRes.json());
      if (predictionsRes.ok) setPredictions(await predictionsRes.json());

    } catch (error) {
      console.error('Failed to load database data:', error);
      loadMockDatabaseData();
    }
  };

  const loadMockDatabaseData = () => {
    // Mock data for when API fails
    const mockTrucks: Truck[] = [
      { id: 1, plate_number: "TRK001", status: "available", current_lat: 40.7128, current_lng: -74.0060, temperature: 4.2 },
      { id: 2, plate_number: "TRK002", status: "in_use", current_lat: 41.8781, current_lng: -87.6298, temperature: 3.8 },
      { id: 3, plate_number: "TRK003", status: "maintenance", current_lat: 47.6062, current_lng: -122.3321, temperature: 2.1 },
      { id: 4, plate_number: "TRK004", status: "available", current_lat: 29.7604, current_lng: -95.3698, temperature: 5.1 }
    ];

    const mockUsers: User[] = [
      { id: 1, email: "john@smarthaul.com", role: "driver", created_at: "2025-08-08T10:00:00Z" },
      { id: 2, email: "jane@smarthaul.com", role: "dispatcher", created_at: "2025-08-08T10:00:00Z" },
      { id: 3, email: "mike@smarthaul.com", role: "driver", created_at: "2025-08-08T10:00:00Z" },
      { id: 4, email: "sarah@smarthaul.com", role: "admin", created_at: "2025-08-08T10:00:00Z" }
    ];

    setTrucks(mockTrucks);
    setUsers(mockUsers);
  };

  const loadMockWorkflows = () => {
    const mockWorkflows: Workflow[] = [
      {
        id: '1',
        name: 'SmartHaul Test Workflow',
        status: 'active',
        lastExecuted: new Date().toISOString(),
        executionCount: 3,
        successRate: 100
      },
      {
        id: '2',
        name: 'Document Processing Workflow',
        status: 'inactive',
        lastExecuted: new Date(Date.now() - 86400000).toISOString(),
        executionCount: 15,
        successRate: 93
      },
      {
        id: '3',
        name: 'Delivery Tracking Workflow',
        status: 'active',
        lastExecuted: new Date().toISOString(),
        executionCount: 8,
        successRate: 100
      }
    ];

    setWorkflows(mockWorkflows);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'in_transit':
      case 'delivered':
      case 'available':
        return 'var(--color-success)';
      case 'inactive':
      case 'pending':
        return 'var(--color-text-muted)';
      case 'error':
      case 'maintenance':
        return 'var(--color-danger)';
      case 'in_use':
        return 'var(--color-warning)';
      default:
        return 'var(--color-text-muted)';
    }
  };

  const handleWorkflowSelect = (workflowId: string) => {
    setSelectedWorkflow(workflowId);
    setShowEditor(true);
  };

  const handleWorkflowChange = (workflow: any) => {
    console.log('Workflow changed:', workflow);
  };

  const renderShipmentsSection = () => (
    <div>
      <h4 style={{
        color: 'var(--color-text)',
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--weight-medium)',
        marginBottom: 'var(--space-3)'
      }}>
        Shipments ({shipments.length})
      </h4>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 'var(--space-3)'
      }}>
        {shipments && shipments.length > 0 ? shipments.map((shipment) => (
          <div
            key={shipment.id}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3)'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 'var(--space-2)'
            }}>
              <h5 style={{
                color: 'var(--color-text)',
                fontSize: 'var(--text-md)',
                fontWeight: 'var(--weight-medium)',
                margin: 0
              }}>
                {shipment.tracking_number}
              </h5>
              <span style={{
                background: getStatusColor(shipment.status),
                color: 'white',
                padding: 'var(--space-1) var(--space-2)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--weight-medium)',
                textTransform: 'uppercase'
              }}>
                {shipment.status}
              </span>
            </div>
            <div style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)'
            }}>
              <div><strong>From:</strong> {shipment.origin}</div>
              <div><strong>To:</strong> {shipment.destination}</div>
              <div><strong>Created:</strong> {new Date(shipment.created_at).toLocaleDateString()}</div>
            </div>
          </div>
        )) : (
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-6)',
            textAlign: 'center',
            color: 'var(--color-text-secondary)'
          }}>
            No shipments available
          </div>
        )}
      </div>
    </div>
  );

  const renderTrucksSection = () => (
    <div>
      <h4 style={{
        color: 'var(--color-text)',
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--weight-medium)',
        marginBottom: 'var(--space-3)'
      }}>
        Trucks ({trucks.length})
      </h4>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 'var(--space-3)'
      }}>
        {trucks.map((truck) => (
          <div
            key={truck.id}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3)'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 'var(--space-2)'
            }}>
              <h5 style={{
                color: 'var(--color-text)',
                fontSize: 'var(--text-md)',
                fontWeight: 'var(--weight-medium)',
                margin: 0
              }}>
                {truck.plate_number}
              </h5>
              <span style={{
                background: getStatusColor(truck.status),
                color: 'white',
                padding: 'var(--space-1) var(--space-2)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--weight-medium)',
                textTransform: 'uppercase'
              }}>
                {truck.status}
              </span>
            </div>
            <div style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)'
            }}>
              <div><strong>Location:</strong> {truck.current_lat.toFixed(4)}, {truck.current_lng.toFixed(4)}</div>
              <div><strong>Temperature:</strong> {truck.temperature}°C</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUsersSection = () => (
    <div>
      <h4 style={{
        color: 'var(--color-text)',
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--weight-medium)',
        marginBottom: 'var(--space-3)'
      }}>
        Users ({users.length})
      </h4>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 'var(--space-3)'
      }}>
        {users.map((user) => (
          <div
            key={user.id}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3)'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 'var(--space-2)'
            }}>
              <h5 style={{
                color: 'var(--color-text)',
                fontSize: 'var(--text-md)',
                fontWeight: 'var(--weight-medium)',
                margin: 0
              }}>
                {user.email}
              </h5>
              <span style={{
                background: 'var(--color-primary)',
                color: 'white',
                padding: 'var(--space-1) var(--space-2)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--weight-medium)',
                textTransform: 'uppercase'
              }}>
                {user.role}
              </span>
            </div>
            <div style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)'
            }}>
              <div><strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDocumentsSection = () => (
    <div>
      <h4 style={{
        color: 'var(--color-text)',
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--weight-medium)',
        marginBottom: 'var(--space-3)'
      }}>
        Documents ({documents.length})
      </h4>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 'var(--space-3)'
      }}>
        {documents.map((document) => (
          <div
            key={document.id}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3)'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 'var(--space-2)'
            }}>
              <h5 style={{
                color: 'var(--color-text)',
                fontSize: 'var(--text-md)',
                fontWeight: 'var(--weight-medium)',
                margin: 0
              }}>
                {document.type}
              </h5>
              <span style={{
                background: document.verified ? 'var(--color-success)' : 'var(--color-warning)',
                color: 'white',
                padding: 'var(--space-1) var(--space-2)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--weight-medium)',
                textTransform: 'uppercase'
              }}>
                {document.verified ? 'Verified' : 'Pending'}
              </span>
            </div>
            <div style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)'
            }}>
              <div><strong>Shipment ID:</strong> {document.shipment_id}</div>
              <div><strong>File:</strong> {document.original_url.split('/').pop()}</div>
              <div><strong>Processed:</strong> {new Date(document.processed_at).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPredictionsSection = () => (
    <div>
      <h4 style={{
        color: 'var(--color-text)',
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--weight-medium)',
        marginBottom: 'var(--space-3)'
      }}>
        Predictions ({predictions.length})
      </h4>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 'var(--space-3)'
      }}>
        {predictions.map((prediction) => (
          <div
            key={prediction.id}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3)'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 'var(--space-2)'
            }}>
              <h5 style={{
                color: 'var(--color-text)',
                fontSize: 'var(--text-md)',
                fontWeight: 'var(--weight-medium)',
                margin: 0
              }}>
                Shipment {prediction.shipment_id}
              </h5>
              <span style={{
                background: prediction.risk_score > 0.3 ? 'var(--color-danger)' : 'var(--color-success)',
                color: 'white',
                padding: 'var(--space-1) var(--space-2)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--weight-medium)'
              }}>
                Risk: {(prediction.risk_score * 100).toFixed(0)}%
              </span>
            </div>
            <div style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)'
            }}>
              <div><strong>Delay:</strong> {prediction.predicted_delay} minutes</div>
              <div><strong>Weather:</strong> {prediction.factors?.weather || 'Unknown'}</div>
              <div><strong>Traffic:</strong> {prediction.factors?.traffic || 'Unknown'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWorkflowsSection = () => (
    <div>
      <h4 style={{
        color: 'var(--color-text)',
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--weight-medium)',
        marginBottom: 'var(--space-3)'
      }}>
        N8N Workflows ({workflows.length})
      </h4>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 'var(--space-4)'
      }}>
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            onClick={() => handleWorkflowSelect(workflow.id)}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-4)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 'var(--space-3)'
            }}>
              <h4 style={{
                color: 'var(--color-text)',
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--weight-medium)',
                margin: 0
              }}>
                {workflow.name}
              </h4>
              <span style={{
                background: getStatusColor(workflow.status),
                color: 'white',
                padding: 'var(--space-1) var(--space-2)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--weight-medium)',
                textTransform: 'uppercase'
              }}>
                {workflow.status}
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--space-3)',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)'
            }}>
              <div>
                <strong>Executions:</strong> {workflow.executionCount}
              </div>
              <div>
                <strong>Success Rate:</strong> {workflow.successRate}%
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <strong>Last Run:</strong> {new Date(workflow.lastExecuted || '').toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-4)' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-4)'
      }}>
        <h2 style={{
          color: 'var(--color-text)',
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--weight-semibold)'
        }}>
          SmartHaul Logistics Dashboard
        </h2>
        <button
          onClick={() => setShowEditor(true)}
          style={{
            background: 'var(--color-primary)',
            color: 'var(--color-on-primary)',
            padding: 'var(--space-2) var(--space-3)',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            cursor: 'pointer',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--weight-medium)'
          }}
        >
          Open N8N Editor
        </button>
      </div>

      {error && (
        <div style={{
          background: 'var(--color-warning-bg)',
          color: 'var(--color-warning)',
          padding: 'var(--space-3)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--space-4)',
          border: '1px solid var(--color-warning)'
        }}>
          {error}
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-2)',
        marginBottom: 'var(--space-6)',
        borderBottom: '1px solid var(--color-border)',
        paddingBottom: 'var(--space-2)'
      }}>
        {[
          { key: 'shipments', label: 'Shipments', icon: <Package size={18} weight="regular" />, count: shipments.length },
          { key: 'trucks', label: 'Trucks', icon: <ArrowsClockwise size={18} weight="regular" />, count: trucks.length },
          { key: 'users', label: 'Users', icon: <Users size={18} weight="regular" />, count: users.length },
          { key: 'documents', label: 'Documents', icon: <FileText size={18} weight="regular" />, count: documents.length },
          { key: 'predictions', label: 'Predictions', icon: <Lightbulb size={18} weight="regular" />, count: predictions.length },
          { key: 'workflows', label: 'Workflows', icon: <ArrowsClockwise size={18} weight="regular" />, count: workflows.length }
        ].map(({ key, label, icon, count }) => (
          <button
            key={key}
            onClick={() => setActiveSection(key as any)}
            style={{
              background: activeSection === key ? 'var(--color-primary)' : 'transparent',
              color: activeSection === key ? 'var(--color-on-primary)' : 'var(--color-text)',
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-medium)',
              transition: 'all 0.2s ease'
            }}
                      >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                {icon}
                {label} ({count})
              </div>
            </button>
        ))}
      </div>

      {/* Content Sections */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        {activeSection === 'shipments' && renderShipmentsSection()}
        {activeSection === 'trucks' && renderTrucksSection()}
        {activeSection === 'users' && renderUsersSection()}
        {activeSection === 'documents' && renderDocumentsSection()}
        {activeSection === 'predictions' && renderPredictionsSection()}
        {activeSection === 'workflows' && renderWorkflowsSection()}
      </div>

      {showEditor && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'var(--color-bg)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4)',
            maxWidth: '90vw',
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
                color: 'var(--color-text)',
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--weight-semibold)',
                margin: 0
              }}>
                N8N Workflow Editor
              </h3>
              <button
                onClick={() => setShowEditor(false)}
                style={{
                  background: 'var(--color-danger)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-2) var(--space-3)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)'
                }}
              >
                Close
              </button>
            </div>
            <N8NWorkflowEditor
              workflowId={selectedWorkflow || undefined}
              onWorkflowChange={handleWorkflowChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}; 