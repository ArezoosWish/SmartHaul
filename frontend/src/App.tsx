import { useState } from 'react'
import './App.css'
import { WorkflowDashboard } from './components/WorkflowDashboard'

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'workflows'>('dashboard')

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
        </nav>
      </header>

      <main style={{ padding: 'var(--space-6)' }}>
        {activeTab === 'dashboard' ? (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ 
              fontSize: 'var(--text-3xl)',
              fontWeight: 'var(--weight-semibold)',
              marginBottom: 'var(--space-4)'
            }}>
              Welcome to SmartHaul
            </h2>
            <p style={{ 
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Intelligent document & delivery management system with embedded N8N workflow automation.
            </p>
            <div style={{ 
              marginTop: 'var(--space-8)',
              padding: 'var(--space-6)',
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)'
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
        ) : (
          <WorkflowDashboard />
        )}
      </main>
    </div>
  )
}

export default App
