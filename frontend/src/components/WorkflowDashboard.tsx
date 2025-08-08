import React, { useState, useEffect } from 'react';
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

export const WorkflowDashboard: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch workflows from N8N API
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const response = await fetch(`${config.n8nBaseUrl}/api/v1/workflows`);
      if (response.ok) {
        const data = await response.json();
        setWorkflows(data.map((wf: any) => ({
          id: wf.id,
          name: wf.name,
          status: wf.active ? 'active' : 'inactive',
          lastExecuted: wf.updatedAt,
          executionCount: wf.executionCount || 0,
          successRate: wf.successRate || 0
        })));
      }
    } catch (error) {
      console.error('Failed to fetch workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'var(--color-success)';
      case 'inactive': return 'var(--color-text-muted)';
      case 'error': return 'var(--color-danger)';
      default: return 'var(--color-text-muted)';
    }
  };

  const handleWorkflowSelect = (workflowId: string) => {
    setSelectedWorkflow(workflowId);
    setShowEditor(true);
  };

  const handleWorkflowChange = (workflow: any) => {
    console.log('Workflow changed:', workflow);
    // Update local state or sync with backend
  };

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
        Loading workflows...
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
          Workflow Dashboard
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
          Create New Workflow
        </button>
      </div>

      {!showEditor ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 'var(--space-4)'
        }}>
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-4)',
                cursor: 'pointer',
                transition: 'box-shadow var(--motion-duration-fast) var(--motion-ease-standard)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={() => handleWorkflowSelect(workflow.id)}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 'var(--space-2)'
              }}>
                <h3 style={{ 
                  color: 'var(--color-text)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--weight-medium)',
                  margin: 0
                }}>
                  {workflow.name}
                </h3>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: getStatusColor(workflow.status)
                }} />
              </div>
              
              <div style={{ 
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--text-sm)',
                marginBottom: 'var(--space-2)'
              }}>
                Status: {workflow.status}
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--space-2)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-muted)'
              }}>
                <div>Executions: {workflow.executionCount}</div>
                <div>Success Rate: {workflow.successRate}%</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 'var(--space-4)'
          }}>
            <button
              onClick={() => setShowEditor(false)}
              style={{
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                cursor: 'pointer',
                fontSize: 'var(--text-sm)'
              }}
            >
              ← Back to Dashboard
            </button>
            <div style={{ color: 'var(--color-text-secondary)' }}>
              {selectedWorkflow ? 'Editing Workflow' : 'Creating New Workflow'}
            </div>
          </div>
          
          <N8NWorkflowEditor
            workflowId={selectedWorkflow || undefined}
            height="700px"
            onWorkflowChange={handleWorkflowChange}
          />
        </div>
      )}
    </div>
  );
}; 