import React, { useState } from 'react';
import { Package, ChartLine, TrendUp, MapPin } from '@phosphor-icons/react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useShipments } from '../contexts/ShipmentContext';

type ChartView = 'shipments' | 'performance' | 'trends' | 'geography';

const DashboardCharts: React.FC = () => {
  const [activeView, setActiveView] = useState<ChartView>('shipments');
  const { getShipmentStats, getMonthlyShipmentData } = useShipments();

  // Get real shipment data
  const shipmentStats = getShipmentStats();
  const shipmentData = getMonthlyShipmentData();

  const performanceData = [
    { time: '00:00', cpu: 45, memory: 60, network: 30 },
    { time: '04:00', cpu: 35, memory: 55, network: 25 },
    { time: '08:00', cpu: 75, memory: 80, network: 85 },
    { time: '12:00', cpu: 85, memory: 90, network: 95 },
    { time: '16:00', cpu: 70, memory: 75, network: 70 },
    { time: '20:00', cpu: 50, memory: 65, network: 40 }
  ];

  const trendData = [
    { period: 'Q1', efficiency: 78, cost: 85, satisfaction: 92 },
    { period: 'Q2', efficiency: 82, cost: 88, satisfaction: 94 },
    { period: 'Q3', efficiency: 85, cost: 90, satisfaction: 96 },
    { period: 'Q4', efficiency: 89, cost: 92, satisfaction: 98 }
  ];

  const geographyData = [
    { city: 'New York', shipments: 25, revenue: 125000 },
    { city: 'Los Angeles', shipments: 18, revenue: 98000 },
    { city: 'Chicago', shipments: 22, revenue: 115000 },
    { city: 'Houston', shipments: 15, revenue: 85000 },
    { city: 'Phoenix', shipments: 12, revenue: 65000 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const chartViews = [
    { id: 'shipments', label: 'Shipments', icon: <Package size={20} weight="regular" /> },
    { id: 'performance', label: 'Performance', icon: <ChartLine size={20} weight="regular" /> },
    { id: 'trends', label: 'Trends', icon: <TrendUp size={20} weight="regular" /> },
    { id: 'geography', label: 'Geography', icon: <MapPin size={20} weight="regular" /> }
  ];

  const renderChartContent = () => {
    switch (activeView) {
      case 'shipments':
        return (
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6)',
            minHeight: '400px'
          }}>
            <h3 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--weight-semibold)',
              marginBottom: 'var(--space-4)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              <Package size={24} weight="regular" />
              Shipment Analytics
            </h3>
            
            {/* Real Shipment Statistics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-6)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 'var(--text-3xl)',
                  fontWeight: 'var(--weight-bold)',
                  color: 'var(--color-primary)'
                }}>
                  {shipmentStats.total}
                </div>
                <div style={{ color: 'var(--color-text-secondary)' }}>
                  Total Shipments
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 'var(--text-3xl)',
                  fontWeight: 'var(--weight-bold)',
                  color: 'var(--color-success)'
                }}>
                  {shipmentStats.inTransit}
                </div>
                <div style={{ color: 'var(--color-text-secondary)' }}>
                  In Transit
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 'var(--text-3xl)',
                  fontWeight: 'var(--weight-bold)',
                  color: 'var(--color-warning)'
                }}>
                  {shipmentStats.pending}
                </div>
                <div style={{ color: 'var(--color-text-secondary)' }}>
                  Pending
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 'var(--text-3xl)',
                  fontWeight: 'var(--weight-bold)',
                  color: 'var(--color-info)'
                }}>
                  {shipmentStats.delivered}
                </div>
                <div style={{ color: 'var(--color-text-secondary)' }}>
                  Delivered
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 'var(--text-3xl)',
                  fontWeight: 'var(--weight-bold)',
                  color: 'var(--color-text-secondary)'
                }}>
                  {shipmentStats.assigned}
                </div>
                <div style={{ color: 'var(--color-text-secondary)' }}>
                  Assigned
                </div>
              </div>
            </div>
            
            {/* Shipments Chart */}
            <div style={{
              background: 'var(--color-surface-alt)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4)',
              height: '300px'
            }}>
              {shipmentData && shipmentData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={shipmentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="delivered" fill="#0088FE" name="Delivered" />
                    <Bar dataKey="inTransit" fill="#00C49F" name="In Transit" />
                    <Bar dataKey="pending" fill="#FF8042" name="Pending" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--text-lg)'
                }}>
                  <Package size={48} weight="regular" />
                  <span style={{ marginLeft: 'var(--space-2)' }}>
                    No chart data available yet. Add some shipments to see analytics!
                  </span>
                </div>
              )}
            </div>
          </div>
        );

      case 'performance':
        return (
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6)',
            minHeight: '400px'
          }}>
            <h3 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--weight-semibold)',
              marginBottom: 'var(--space-4)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              <ChartLine size={24} weight="regular" />
              System Performance
            </h3>
            
            {/* Performance Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-6)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 'var(--weight-bold)',
                  color: 'var(--color-success)'
                }}>
                  99.9%
                </div>
                <div style={{ color: 'var(--color-text-secondary)' }}>
                  Uptime
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 'var(--weight-bold)',
                  color: 'var(--color-primary)'
                }}>
                  &lt;100ms
                </div>
                <div style={{ color: 'var(--color-text-secondary)' }}>
                  API Response
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 'var(--weight-bold)',
                  color: 'var(--color-info)'
                }}>
                  100%
                </div>
                <div style={{ color: 'var(--color-text-secondary)' }}>
                  Workflow Success
                </div>
              </div>
            </div>
            
            {/* Performance Chart */}
            <div style={{
              background: 'var(--color-surface-alt)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4)',
              height: '300px'
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="cpu" stroke="#0088FE" strokeWidth={2} name="CPU %" />
                  <Line type="monotone" dataKey="memory" stroke="#00C49F" strokeWidth={2} name="Memory %" />
                  <Line type="monotone" dataKey="network" stroke="#FF8042" strokeWidth={2} name="Network %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'trends':
        return (
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6)',
            minHeight: '400px'
          }}>
            <h3 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--weight-semibold)',
              marginBottom: 'var(--space-4)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
                                        <TrendUp size={24} weight="regular" />
              Delivery Trends
            </h3>
            
            {/* Trend Indicators */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-6)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 'var(--weight-bold)',
                  color: 'var(--color-success)'
                }}>
                  <TrendUp size={20} weight="fill" style={{ color: 'var(--color-success)' }} /> +15%
                </div>
                <div style={{ color: 'var(--color-text-secondary)' }}>
                  On-time Delivery
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 'var(--weight-bold)',
                  color: 'var(--color-warning)'
                }}>
                  <TrendUp size={20} weight="fill" style={{ color: 'var(--color-danger)', transform: 'rotate(180deg)' }} /> -8%
                </div>
                <div style={{ color: 'var(--color-text-secondary)' }}>
                  Delays
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 'var(--weight-bold)',
                  color: 'var(--color-info)'
                }}>
                  <TrendUp size={20} weight="fill" style={{ color: 'var(--color-success)' }} /> +22%
                </div>
                <div style={{ color: 'var(--color-text-secondary)' }}>
                  Efficiency
                </div>
              </div>
            </div>
            
            {/* Trends Chart */}
            <div style={{
              background: 'var(--color-surface-alt)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4)',
              height: '300px'
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="efficiency" stackId="1" stroke="#0088FE" fill="#0088FE" name="Efficiency %" />
                  <Area type="monotone" dataKey="cost" stackId="1" stroke="#00C49F" fill="#00C49F" name="Cost %" />
                  <Area type="monotone" dataKey="satisfaction" stackId="1" stroke="#FF8042" fill="#FF8042" name="Satisfaction %" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'geography':
        return (
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6)',
            minHeight: '400px'
          }}>
            <h3 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--weight-semibold)',
              marginBottom: 'var(--space-4)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              <MapPin size={24} weight="regular" />
              Geographic Distribution
            </h3>
            
            {/* Geographic Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-6)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 'var(--weight-bold)',
                  color: 'var(--color-primary)'
                }}>
                  12
                </div>
                <div style={{ color: 'var(--color-text-secondary)' }}>
                  Cities Covered
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 'var(--weight-bold)',
                  color: 'var(--color-secondary)'
                }}>
                  4
                </div>
                <div style={{ color: 'var(--color-text-secondary)' }}>
                  Active Routes
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 'var(--weight-bold)',
                  color: 'var(--color-info)'
                }}>
                  89%
                </div>
                <div style={{ color: 'var(--color-text-secondary)' }}>
                  Coverage
                </div>
              </div>
            </div>
            
            {/* Geography Chart */}
            <div style={{
              background: 'var(--color-surface-alt)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4)',
              height: '300px'
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={geographyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ city, shipments }) => `${city}: ${shipments}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="shipments"
                  >
                    {geographyData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {/* Chart View Selector */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        marginBottom: 'var(--space-6)',
        flexWrap: 'wrap'
      }}>
        {chartViews.map((view) => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id as ChartView)}
            style={{
              background: activeView === view.id ? 'var(--color-primary)' : 'transparent',
              color: activeView === view.id ? 'var(--color-on-primary)' : 'var(--color-text)',
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-medium)',
              transition: 'all var(--motion-duration) var(--motion-ease-standard)',
              minWidth: '120px'
            }}
          >
            {view.icon} {view.label}
          </button>
        ))}
      </div>

      {/* Chart Content */}
      {renderChartContent()}
    </div>
  );
};

export default DashboardCharts;
