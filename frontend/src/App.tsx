import { useState } from 'react'
import './App.css'
import { WorkflowDashboard } from './components/WorkflowDashboard'
import PerformanceDashboard from './components/PerformanceDashboard'
import SystemAdministrative from './components/SystemAdministrative'
import NotificationPanel from './components/NotificationPanel'
import DashboardCharts from './components/DashboardCharts'
import FleetDashboard from './components/FleetDashboard'
import ShipmentDashboard from './components/ShipmentDashboard'

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'workflows' | 'system-admin' | 'fleet' | 'shipments'>('dashboard')

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'var(--color-bg)',
      color: 'var(--color-text)'
    }}>
      <header style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--space-4)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ 
          color: 'var(--color-primary)',
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--weight-bold)',
          margin: 0
        }}>
          SmartHaul
        </h1>
        
        <nav style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              background: activeTab === 'dashboard' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'dashboard' ? 'var(--color-on-primary)' : 'var(--color-text)',
              padding: 'var(--space-2) var(--space-3)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-medium)',
              transition: 'all var(--motion-duration) var(--motion-ease-standard)'
            }}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('workflows')}
            style={{
              background: activeTab === 'workflows' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'workflows' ? 'var(--color-on-primary)' : 'var(--color-text)',
              padding: 'var(--space-2) var(--space-3)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-medium)',
              transition: 'all var(--motion-duration) var(--motion-ease-standard)'
            }}
          >
            Workflows
          </button>
          <button
            onClick={() => setActiveTab('system-admin')}
            style={{
              background: activeTab === 'system-admin' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'system-admin' ? 'var(--color-on-primary)' : 'var(--color-text)',
              padding: 'var(--space-2) var(--space-3)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-medium)',
              transition: 'all var(--motion-duration) var(--motion-ease-standard)'
            }}
          >
            System Administrative
          </button>
          
          <button
            onClick={() => setActiveTab('fleet')}
            style={{
              background: activeTab === 'fleet' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'fleet' ? 'var(--color-on-primary)' : 'var(--color-text)',
              padding: 'var(--space-2) var(--space-3)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-medium)',
              transition: 'all var(--motion-duration) var(--motion-ease-standard)'
            }}
          >
            Fleet Management
          </button>
          
          <button
            onClick={() => setActiveTab('shipments')}
            style={{
              background: activeTab === 'shipments' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'shipments' ? 'var(--color-on-primary)' : 'var(--color-text)',
              padding: 'var(--space-2) var(--space-3)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-medium)',
              transition: 'all var(--motion-duration) var(--motion-ease-standard)'
            }}
          >
            Shipments
          </button>
          
          {/* Notifications in top bar */}
          <div style={{ marginLeft: 'auto' }}>
            <NotificationPanel />
          </div>
        </nav>
      </header>

      <main style={{ padding: 'var(--space-6)' }}>
        {activeTab === 'dashboard' ? (
          <div>
            <h2 style={{ 
              fontSize: 'var(--text-3xl)',
              fontWeight: 'var(--weight-semibold)',
              marginBottom: 'var(--space-4)',
              textAlign: 'center'
            }}>
              Welcome to SmartHaul
            </h2>
            <p style={{ 
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '600px',
              margin: '0 auto var(--space-6)',
              textAlign: 'center'
            }}>
              Intelligent document & delivery management system ready for your custom dashboard implementation.
            </p>
            

            
            {/* Dashboard Charts */}
            <div style={{ marginTop: 'var(--space-8)' }}>
              <DashboardCharts />
            </div>

          </div>
        ) : activeTab === 'workflows' ? (
          <WorkflowDashboard />
        ) : activeTab === 'fleet' ? (
          <FleetDashboard />
        ) : activeTab === 'shipments' ? (
          <ShipmentDashboard />
        ) : (
          <SystemAdministrative />
        )}
      </main>
    </div>
  )
}

export default App
