import { useState, useEffect } from 'react';
import { Monitor, ArrowsClockwise, Info, CheckCircle, Warning, ChartLine, Gauge, Gear } from '@phosphor-icons/react';
import { config } from '../config';

interface PerformanceMetrics {
  cpu: number;
  memory: number;
  api: number;
  cache: number;
  database: number;
  network: number;
}

interface Alert {
  id: string;
  type: 'critical' | 'warning';
  message: string;
  timestamp: string;
}

export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'overview' | 'metrics' | 'alerts' | 'system'>('overview');

  useEffect(() => {
    loadPerformanceData();
  }, []);

  const loadPerformanceData = async () => {
    try {
      setLoading(true);
      const [metricsRes, alertsRes] = await Promise.all([
        fetch(`${config.apiBaseUrl}/api/performance/metrics`),
        fetch(`${config.apiBaseUrl}/api/performance/alerts`)
      ]);

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        // Handle both old and new API response formats
        if (metricsData.system && metricsData.api && metricsData.cache) {
          // Old format - extract values
          setMetrics({
            cpu: metricsData.system.cpu_percent || 0,
            memory: metricsData.system.memory_percent || 0,
            api: metricsData.api.avg_response_time_ms || 0,
            cache: (metricsData.cache.cache_hit_ratio || 0) * 100,
            database: metricsData.database?.queries_per_second || 0,
            network: 0 // Not available in old format
          });
        } else {
          // New format - use directly
          setMetrics(metricsData);
        }
      }

      if (alertsRes.ok) {
        const alertsData = await alertsRes.json();
        // Handle both old and new API response formats
        if (alertsData.alerts) {
          // Old format - extract alerts array
          setAlerts(alertsData.alerts.map((alert: any) => ({
            id: alert.id || Math.random().toString(),
            type: alert.type,
            message: alert.message || `${alert.component}: ${alert.metric} = ${alert.value}`,
            timestamp: new Date().toISOString()
          })));
        } else {
          // New format - use directly
          setAlerts(alertsData);
        }
      }
    } catch (err) {
      setError('Failed to load performance data');
      console.error('Error loading performance data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (value: number) => {
    if (!value || isNaN(value)) return 'var(--color-success)';
    if (value >= 80) return 'var(--color-danger)';
    if (value >= 60) return 'var(--color-warning)';
    return 'var(--color-success)';
  };

  const renderOverviewSection = () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: 'var(--space-4)',
      marginBottom: 'var(--space-6)'
    }}>
      {/* CPU Usage */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-3)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)'
          }}>
            <div style={{
              background: 'var(--color-primary)',
              color: 'white',
              padding: 'var(--space-1)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--text-xs)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Monitor size={16} weight="fill" />
            </div>
            <span style={{
              color: 'var(--color-text)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-medium)'
            }}>
              CPU Usage
            </span>
          </div>
          <span style={{
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--text-xs)'
          }}>
            {metrics?.cpu ? Math.round(metrics.cpu) : 0}%
          </span>
        </div>
        <div style={{
          background: 'var(--color-surface-alt)',
          borderRadius: 'var(--radius-sm)',
          height: '8px',
          overflow: 'hidden'
        }}>
                     <div style={{
             background: getStatusColor(metrics?.cpu || 0),
             height: '100%',
             width: `${Math.max(0, Math.min(100, metrics?.cpu || 0))}%`,
             transition: 'width 0.3s ease'
           }} />
        </div>
      </div>

      {/* Memory Usage */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-3)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)'
          }}>
            <div style={{
              background: 'var(--color-secondary)',
              color: 'white',
              padding: 'var(--space-1)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--text-xs)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Gauge size={16} weight="fill" />
            </div>
            <span style={{
              color: 'var(--color-text)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-medium)'
            }}>
              Memory Usage
            </span>
          </div>
          <span style={{
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--text-xs)'
          }}>
            {metrics?.memory ? Math.round(metrics.memory) : 0}%
          </span>
        </div>
        <div style={{
          background: 'var(--color-surface-alt)',
          borderRadius: 'var(--radius-sm)',
          height: '8px',
          overflow: 'hidden'
        }}>
                     <div style={{
             background: getStatusColor(metrics?.memory || 0),
             height: '100%',
             width: `${Math.max(0, Math.min(100, metrics?.memory || 0))}%`,
             transition: 'width 0.3s ease'
           }} />
        </div>
      </div>

      {/* API Response Time */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-3)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)'
          }}>
            <div style={{
              background: 'var(--color-info)',
              color: 'white',
              padding: 'var(--space-1)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--text-xs)'
            }}>
              ⚡
            </div>
            <span style={{
              color: 'var(--color-text)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-medium)'
            }}>
              API Response
            </span>
          </div>
          <span style={{
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--text-xs)'
          }}>
            {metrics?.api ? Math.round(metrics.api) : 0}ms
          </span>
        </div>
        <div style={{
          background: 'var(--color-surface-alt)',
          borderRadius: 'var(--radius-sm)',
          height: '8px',
          overflow: 'hidden'
        }}>
                     <div style={{
             background: getStatusColor(metrics?.api || 0),
             height: '100%',
             width: `${Math.max(0, Math.min(100, Math.min((metrics?.api || 0) / 2, 100)))}%`,
             transition: 'width 0.3s ease'
           }} />
        </div>
      </div>

      {/* Cache Hit Rate */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-3)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)'
          }}>
            <div style={{
              background: 'var(--color-warning)',
              color: 'white',
              padding: 'var(--space-1)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--text-xs)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ArrowsClockwise size={16} weight="fill" />
            </div>
            <span style={{
              color: 'var(--color-text)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-medium)'
            }}>
              Cache Hit Rate
            </span>
          </div>
          <span style={{
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--text-xs)'
          }}>
            {metrics?.cache ? Math.round(metrics.cache) : 0}%
          </span>
        </div>
        <div style={{
          background: 'var(--color-surface-alt)',
          borderRadius: 'var(--radius-sm)',
          height: '8px',
          overflow: 'hidden'
        }}>
                     <div style={{
             background: getStatusColor(100 - (metrics?.cache || 0)),
             height: '100%',
             width: `${Math.max(0, Math.min(100, 100 - (metrics?.cache || 0)))}%`,
             transition: 'width 0.3s ease'
           }} />
        </div>
      </div>
    </div>
  );

  const renderMetricsSection = () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: 'var(--space-4)',
      marginBottom: 'var(--space-6)'
    }}>
      {/* System Information */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-3)'
        }}>
          <div style={{
            background: 'var(--color-primary)',
            color: 'white',
            padding: 'var(--space-1)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-xs)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Info size={16} weight="fill" />
          </div>
          <h4 style={{
            color: 'var(--color-text)',
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--weight-medium)',
            margin: 0
          }}>
            System Information
          </h4>
        </div>
        <div style={{
          display: 'grid',
          gap: 'var(--space-2)',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-secondary)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: 'var(--space-2)',
            background: 'var(--color-surface-alt)',
            borderRadius: 'var(--radius-sm)'
          }}>
                         <span><strong>Database:</strong></span>
             <span>{metrics?.database ? Math.round(metrics.database) : 0}ms</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: 'var(--space-2)',
            background: 'var(--color-surface-alt)',
            borderRadius: 'var(--radius-sm)'
          }}>
                         <span><strong>Network:</strong></span>
             <span>{metrics?.network ? Math.round(metrics.network) : 0}ms</span>
          </div>
        </div>
      </div>

      {/* Performance Status */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-3)'
        }}>
          <div style={{
            background: 'var(--color-success)',
            color: 'white',
            padding: 'var(--space-1)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-xs)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CheckCircle size={16} weight="fill" />
          </div>
          <h4 style={{
            color: 'var(--color-text)',
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--weight-medium)',
            margin: 0
          }}>
            Performance Status
          </h4>
        </div>
        <div style={{
          background: 'var(--color-success)',
          color: 'white',
          padding: 'var(--space-2) var(--space-3)',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--weight-medium)',
          textAlign: 'center'
        }}>
          All Systems Operational
        </div>
        <p style={{
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--text-sm)',
          marginTop: 'var(--space-2)',
          marginBottom: 0
        }}>
          System performance is within normal parameters. All services are running smoothly.
        </p>
      </div>
    </div>
  );

  const renderAlertsSection = () => (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-4)',
      marginBottom: 'var(--space-6)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        marginBottom: 'var(--space-4)'
      }}>
        <div style={{
          background: 'var(--color-danger)',
          color: 'white',
          padding: 'var(--space-1)',
          borderRadius: 'var(--radius-sm)',
          fontSize: 'var(--text-xs)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Warning size={16} weight="fill" />
        </div>
        <h4 style={{
          color: 'var(--color-text)',
          fontSize: 'var(--text-lg)',
          fontWeight: 'var(--weight-medium)',
          margin: 0
        }}>
          Active Alerts ({alerts.length})
        </h4>
      </div>
      
      {alerts.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-6)',
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--text-sm)'
        }}>
          No active alerts. All systems are running normally.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gap: 'var(--space-3)'
        }}>
          {alerts.map((alert) => (
            <div key={alert.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: 'var(--space-3)',
              background: alert.type === 'critical' ? 'var(--color-danger)' : 'var(--color-warning)',
              color: 'white',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'white'
              }} />
              <span style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--weight-medium)'
              }}>
                {alert.message}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSystemSection = () => (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-4)',
      marginBottom: 'var(--space-6)'
    }}>
      <h4 style={{
        color: 'var(--color-text)',
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--weight-medium)',
        marginBottom: 'var(--space-3)'
      }}>
        System Health Overview
      </h4>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--space-4)'
      }}>
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-3)',
          background: 'var(--color-surface-alt)',
          borderRadius: 'var(--radius-md)'
        }}>
          <div style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--weight-bold)',
            color: 'var(--color-primary)',
            marginBottom: 'var(--space-1)'
          }}>
                         {metrics?.cpu ? Math.round(metrics.cpu) : 0}%
          </div>
          <div style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)'
          }}>
            CPU Usage
          </div>
        </div>
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-3)',
          background: 'var(--color-surface-alt)',
          borderRadius: 'var(--radius-md)'
        }}>
          <div style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--weight-bold)',
            color: 'var(--color-secondary)',
            marginBottom: 'var(--space-1)'
          }}>
                         {metrics?.memory ? Math.round(metrics.memory) : 0}%
          </div>
          <div style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)'
          }}>
            Memory Usage
          </div>
        </div>
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-3)',
          background: 'var(--color-surface-alt)',
          borderRadius: 'var(--radius-md)'
        }}>
          <div style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--weight-bold)',
            color: 'var(--color-info)',
            marginBottom: 'var(--space-1)'
          }}>
                         {metrics?.api ? Math.round(metrics.api) : 0}ms
          </div>
          <div style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)'
          }}>
            API Response
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
        Loading performance dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 'var(--space-4)' }}>
        <div style={{
          background: 'var(--color-danger)',
          color: 'white',
          padding: 'var(--space-3)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-danger)',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-2)'
          }}>
            <Warning size={20} weight="fill" />
            <span style={{ fontWeight: 'var(--weight-medium)' }}>Error</span>
          </div>
          {error}
        </div>
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
          Performance Dashboard
        </h2>
        <button
          onClick={loadPerformanceData}
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
          Refresh Data
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-2)',
        marginBottom: 'var(--space-6)',
        borderBottom: '1px solid var(--color-border)',
        paddingBottom: 'var(--space-2)'
      }}>
        {[
          { key: 'overview', label: 'Overview', icon: <ChartLine size={18} weight="regular" /> },
          { key: 'metrics', label: 'Metrics', icon: <Gauge size={18} weight="regular" /> },
          { key: 'alerts', label: 'Alerts', icon: <Warning size={18} weight="regular" /> },
          { key: 'system', label: 'System', icon: <Gear size={18} weight="regular" /> }
        ].map(({ key, label, icon }) => (
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
                {label}
              </div>
            </button>
        ))}
      </div>

      {/* Content Sections */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        {activeSection === 'overview' && renderOverviewSection()}
        {activeSection === 'metrics' && renderMetricsSection()}
        {activeSection === 'alerts' && renderAlertsSection()}
        {activeSection === 'system' && renderSystemSection()}
      </div>
    </div>
  );
} 