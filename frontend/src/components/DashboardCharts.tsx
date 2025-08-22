import React, { useState } from 'react';
import { Package, ChartLine, TrendingUp, MapPin } from '@phosphor-icons/react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type ChartView = 'shipments' | 'performance' | 'trends' | 'geography';

const DashboardCharts: React.FC = () => {
  const [activeView, setActiveView] = useState<ChartView>('shipments');

  // Sample data for charts
  const shipmentData = [
    { month: 'Jan', delivered: 45, inTransit: 12, delayed: 3 },
    { month: 'Feb', delivered: 52, inTransit: 8, delayed: 2 },
    { month: 'Mar', delivered: 48, inTransit: 15, delayed: 4 },
    { month: 'Apr', delivered: 61, inTransit: 10, delayed: 1 },
    { month: 'May', delivered: 55, inTransit: 12, delayed: 2 },
    { month: 'Jun', delivered: 67, inTransit: 8, delayed: 1 }
  ];

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
    { id: 'trends', label: 'Trends', icon: <TrendingUp size={20} weight="regular" /> },
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
            
            {/* Mock Chart Data */}
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
                  9
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
                  7
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
                  2
                </div>
                <div style={{ color: 'var(--color-text-secondary)' }}>
                  Delayed
                </div>
              </div>
            </div>
            
            {/* Mock Chart Visualization */}
            {/* Shipments Chart */}
            <div style={{
              background: 'var(--color-surface-alt)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4)',
              height: '300px'
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={shipmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="delivered" fill="#0088FE" name="Delivered" />
                  <Bar dataKey="inTransit" fill="#00C49F" name="In Transit" />
                  <Bar dataKey="delayed" fill="#FF8042" name="Delayed" />
                </BarChart>
              </ResponsiveContainer>
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
              <TrendingUp size={24} weight="regular" />
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
                  <TrendingUp size={20} weight="fill" style={{ color: 'var(--color-success)' }} /> +15%
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
                  <TrendingUp size={20} weight="fill" style={{ color: 'var(--color-danger)', transform: 'rotate(180deg)' }} /> -8%
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
                  <TrendingUp size={20} weight="fill" style={{ color: 'var(--color-success)' }} /> +22%
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
                    {geographyData.map((entry, index) => (
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
