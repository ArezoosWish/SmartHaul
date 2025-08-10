import { useState } from 'react'
import './App.css'
import { WorkflowDashboard } from './components/WorkflowDashboard'
import PerformanceDashboard from './components/PerformanceDashboard'

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'workflows' | 'performance'>('dashboard')

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
        
        <nav style={{ display: 'flex', gap: 'var(--space-4)' }}>
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
              fontWeight: 'var(--weight-medium)'
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
              fontWeight: 'var(--weight-medium)'
            }}
          >
            Workflows
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            style={{
              background: activeTab === 'performance' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'performance' ? 'var(--color-on-primary)' : 'var(--color-text)',
              padding: 'var(--space-2) var(--space-3)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-medium)'
            }}
          >
            Performance
          </button>
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
              Intelligent document & delivery management system with embedded N8N workflow automation.
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
                  📊 Database Status
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                  <strong>Shipments:</strong> 3 active shipments
                </p>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                  <strong>Events:</strong> 3 delivery events tracked
                </p>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  <strong>Status:</strong> ✅ Connected to PostgreSQL
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
                  🔄 N8N Workflows
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                  <strong>Active:</strong> 2 workflows running
                </p>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                  <strong>Executions:</strong> 26 total executions
                </p>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  <strong>Status:</strong> ✅ Connected to N8N Cloud
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
                  🚀 System Status
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                  <strong>Frontend:</strong> ✅ Running on port 5173
                </p>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                  <strong>Backend:</strong> ✅ Running on port 8000
                </p>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  <strong>Overall:</strong> ✅ All systems operational
                </p>
              </div>
            </div>

            <div style={{ 
              padding: 'var(--space-6)',
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              textAlign: 'center'
            }}>
              <h3 style={{ 
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--weight-medium)',
                marginBottom: 'var(--space-4)'
              }}>
                N8N Integration Demo
              </h3>
              <p style={{ 
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-4)'
              }}>
                Click "Workflows" to see the embedded N8N workflow editor and manage your automation workflows.
              </p>
              <button
                onClick={() => setActiveTab('workflows')}
                style={{
                  background: 'var(--color-primary)',
                  color: 'var(--color-on-primary)',
                  padding: 'var(--space-3) var(--space-6)',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 'var(--text-md)',
                  fontWeight: 'var(--weight-medium)'
                }}
              >
                Open Workflow Editor
              </button>
            </div>
          </div>
        ) : activeTab === 'workflows' ? (
          <WorkflowDashboard />
        ) : (
          <PerformanceDashboard />
        )}
      </main>
    </div>
  )
}

export default App
