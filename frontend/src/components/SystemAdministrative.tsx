import React, { useState } from 'react';
import { WorkflowDashboard } from './WorkflowDashboard';
import PerformanceDashboard from './PerformanceDashboard';
import SystemStatus from './SystemStatus';

type AdminTab = 'n8n' | 'performance' | 'system-status';

const SystemAdministrative: React.FC = () => {
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('n8n');

  return (
    <div>
      <h2 style={{ 
        fontSize: 'var(--text-3xl)',
        fontWeight: 'var(--weight-semibold)',
        marginBottom: 'var(--space-4)',
        textAlign: 'center'
      }}>
        System Administrative
      </h2>
      
      {/* Sub-tab Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        marginBottom: 'var(--space-6)',
        borderBottom: '1px solid var(--color-border)',
        paddingBottom: 'var(--space-4)'
      }}>
        <button
          onClick={() => setActiveAdminTab('n8n')}
          style={{
            background: activeAdminTab === 'n8n' ? 'var(--color-primary)' : 'transparent',
            color: activeAdminTab === 'n8n' ? 'var(--color-on-primary)' : 'var(--color-text)',
            padding: 'var(--space-2) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            cursor: 'pointer',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--weight-medium)',
            minWidth: '120px',
            transition: 'all var(--motion-duration) var(--motion-ease-standard)'
          }}
        >
          🔄 N8N Workflows
        </button>
        
        <button
          onClick={() => setActiveAdminTab('performance')}
          style={{
            background: activeAdminTab === 'performance' ? 'var(--color-primary)' : 'transparent',
            color: activeAdminTab === 'performance' ? 'var(--color-on-primary)' : 'var(--color-text)',
            padding: 'var(--space-2) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            cursor: 'pointer',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--weight-medium)',
            minWidth: '120px',
            transition: 'all var(--motion-duration) var(--motion-ease-standard)'
          }}
        >
          📊 Performance
        </button>
        
        <button
          onClick={() => setActiveAdminTab('system-status')}
          style={{
            background: activeAdminTab === 'system-status' ? 'var(--color-primary)' : 'transparent',
            color: activeAdminTab === 'system-status' ? 'var(--color-on-primary)' : 'var(--color-text)',
            padding: 'var(--space-2) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            cursor: 'pointer',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--weight-medium)',
            minWidth: '120px',
            transition: 'all var(--motion-duration) var(--motion-ease-standard)'
          }}
        >
          🚀 System Status
        </button>
      </div>

      {/* Sub-tab Content */}
      {activeAdminTab === 'n8n' && (
        <div>
          <h3 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--weight-semibold)',
            marginBottom: 'var(--space-4)',
            textAlign: 'center',
            color: 'var(--color-primary)'
          }}>
            N8N Workflow Management
          </h3>
          <p style={{
            fontSize: 'var(--text-lg)',
            color: 'var(--color-text-secondary)',
            textAlign: 'center',
            marginBottom: 'var(--space-6)'
          }}>
            Manage your automation workflows, monitor execution, and configure N8N integration.
          </p>
          <WorkflowDashboard />
        </div>
      )}

      {activeAdminTab === 'performance' && (
        <div>
          <h3 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--weight-semibold)',
            marginBottom: 'var(--space-4)',
            textAlign: 'center',
            color: 'var(--color-primary)'
          }}>
            Performance Monitoring
          </h3>
          <p style={{
            fontSize: 'var(--text-lg)',
            color: 'var(--color-text-secondary)',
            textAlign: 'center',
            marginBottom: 'var(--space-6)'
          }}>
            Monitor system performance, database metrics, and API response times.
          </p>
          <PerformanceDashboard />
        </div>
      )}

      {activeAdminTab === 'system-status' && (
        <div>
          <h3 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--weight-semibold)',
            marginBottom: 'var(--space-4)',
            textAlign: 'center',
            color: 'var(--color-primary)'
          }}>
            System Status Overview
          </h3>
          <p style={{
            fontSize: 'var(--text-lg)',
            color: 'var(--color-text-secondary)',
            textAlign: 'center',
            marginBottom: 'var(--space-6)'
          }}>
            Real-time system health, service status, and operational metrics.
          </p>
          <SystemStatus />
        </div>
      )}
    </div>
  );
};

export default SystemAdministrative;
