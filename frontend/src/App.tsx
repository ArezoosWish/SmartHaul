import { useState } from 'react'
import './App.css'
import { WorkflowDashboard } from './components/WorkflowDashboard'
import PerformanceDashboard from './components/PerformanceDashboard'
import SystemAdministrative from './components/SystemAdministrative'
import NotificationPanel from './components/NotificationPanel'
import DashboardCharts from './components/DashboardCharts'

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'workflows' | 'system-admin'>('dashboard')

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
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-6)'
            }}>
              <div style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-4)'
              }}>
                <h3 style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--weight-medium)',
                  marginBottom: 'var(--space-3)',
                  color: 'var(--color-primary)'
                }}>
                  📊 Quick Overview
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                  <strong>Status:</strong> ✅ All systems operational
                </p>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                  <strong>Notifications:</strong> Real-time enabled
                </p>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  <strong>Ready for:</strong> Your dashboard plan
                </p>
              </div>

              <div style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-4)'
              }}>
                <h3 style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--weight-medium)',
                  marginBottom: 'var(--space-3)',
                  color: 'var(--color-primary)'
                }}>
                  🎯 Next Steps
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                  <strong>Phase 2:</strong> Document processing
                </p>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                  <strong>OCR Engine:</strong> Ready to implement
                </p>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  <strong>Status:</strong> 🚀 Ready for development
                </p>
              </div>


            </div>
            
            {/* Dashboard Charts */}
            <div style={{ marginTop: 'var(--space-8)' }}>
              <DashboardCharts />
            </div>

          </div>
        ) : activeTab === 'workflows' ? (
          <WorkflowDashboard />
        ) : (
          <SystemAdministrative />
        )}
      </main>
    </div>
  )
}

export default App
