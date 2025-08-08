import React, { useEffect, useRef, useState } from 'react';
import { config } from '../config';

interface N8NWorkflowEditorProps {
  workflowId?: string;
  readOnly?: boolean;
  height?: string;
  onWorkflowChange?: (workflow: any) => void;
}

export const N8NWorkflowEditor: React.FC<N8NWorkflowEditorProps> = ({
  workflowId,
  readOnly = false,
  height = '600px',
  onWorkflowChange
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Construct N8N workflow editor URL
    const n8nUrl = new URL('/workflow', config.n8nBaseUrl);
    if (workflowId) {
      n8nUrl.searchParams.set('id', workflowId);
    }
    if (readOnly) {
      n8nUrl.searchParams.set('readonly', 'true');
    }

    // Set up message listener for communication with N8N
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== config.n8nBaseUrl) return;
      
      const { type, data } = event.data;
      
      switch (type) {
        case 'n8n:workflow:loaded':
          setIsLoaded(true);
          break;
        case 'n8n:workflow:changed':
          onWorkflowChange?.(data.workflow);
          break;
        case 'n8n:workflow:executed':
          console.log('Workflow executed:', data);
          break;
        case 'n8n:error':
          setError(data.message);
          break;
      }
    };

    window.addEventListener('message', handleMessage);

    // Load N8N workflow editor
    iframe.src = n8nUrl.toString();

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [workflowId, readOnly, onWorkflowChange]);

  // Function to send messages to N8N iframe (for future use)
  // const sendMessageToN8N = (type: string, data?: any) => {
  //   const iframe = iframeRef.current;
  //   if (iframe && iframe.contentWindow) {
  //     iframe.contentWindow.postMessage({ type, data }, config.n8nBaseUrl);
  //   }
  // };

  return (
    <div style={{ 
      border: '1px solid var(--color-border)', 
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden'
    }}>
      {error && (
        <div style={{
          padding: 'var(--space-3)',
          backgroundColor: 'var(--color-danger)',
          color: 'var(--color-on-danger)',
          fontSize: 'var(--text-sm)'
        }}>
          Error: {error}
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        style={{
          width: '100%',
          height,
          border: 'none',
          backgroundColor: 'var(--color-surface)'
        }}
        title="N8N Workflow Editor"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
      
      {!isLoaded && !error && (
        <div style={{
          padding: 'var(--space-4)',
          textAlign: 'center',
          color: 'var(--color-text-muted)'
        }}>
          Loading N8N Workflow Editor...
        </div>
      )}
    </div>
  );
}; 