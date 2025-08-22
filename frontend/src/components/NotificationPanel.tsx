import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle, Warning, XCircle, Info } from '@phosphor-icons/react';

interface Notification {
  type: string;
  message: string;
  timestamp: string;
  shipment_id?: number;
  truck_id?: number;
  statistics?: any;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

const NotificationPanel: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isExpanded && !target.closest('.notification-bell-container')) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  const connectWebSocket = () => {
    try {
      const ws = new WebSocket('ws://localhost:8000/api/notifications/ws/notifications');
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        console.log('WebSocket connected to SmartHaul notifications');
      };

      ws.onmessage = (event) => {
        try {
          const notification: Notification = JSON.parse(event.data);
          
          // Don't add connection messages to notifications
          if (notification.type !== 'connection') {
            setNotifications(prev => [notification, ...prev.slice(0, 49)]); // Keep last 50
          }
        } catch (error) {
          console.error('Failed to parse notification:', error);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket disconnected');
        
        // Try to reconnect after 5 seconds
        setTimeout(() => {
          if (!isConnected) {
            connectWebSocket();
          }
        }, 5000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc3545';
      case 'error': return '#fd7e14';
      case 'warning': return '#ffc107';
      case 'info': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle size={20} weight="fill" />;
      case 'error': return <Warning size={20} weight="fill" />;
      case 'warning': return <Warning size={20} weight="fill" />;
      case 'info': return <Info size={20} weight="fill" />;
      default: return <Info size={20} weight="fill" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString();
    } catch {
      return timestamp;
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const toggleNotifications = () => {
    setIsExpanded(!isExpanded);
  };

  const getUnreadCount = () => {
    return notifications.length;
  };

  return (
    <div className="notification-bell-container" style={{ position: 'relative' }}>
      {/* Bell Button */}
      <button
        onClick={toggleNotifications}
        className="notification-bell"
        style={{
          position: 'relative',
          background: 'transparent',
          border: '1px solid var(--color-border)',
          cursor: 'pointer',
          padding: 'var(--space-2) var(--space-3)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-text)',
          transition: 'all var(--motion-duration) var(--motion-ease-standard)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Bell size={20} weight="regular" />
        {/* Notification Badge */}
        {getUnreadCount() > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              background: 'var(--color-danger)',
              color: 'var(--color-on-danger)',
              borderRadius: 'var(--radius-pill)',
              fontSize: 'var(--text-xs)',
              padding: '2px 6px',
              minWidth: '18px',
              textAlign: 'center',
              fontWeight: 'var(--weight-bold)'
            }}
          >
            {getUnreadCount() > 99 ? '99+' : getUnreadCount()}
          </span>
        )}
      </button>

      {/* Expanded Notifications Panel */}
      {isExpanded && (
        <div
          className="notification-dropdown"
          style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            minWidth: '350px',
            maxWidth: '450px',
            maxHeight: '500px',
            overflow: 'hidden',
            zIndex: 1000,
            marginTop: 'var(--space-2)'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: 'var(--space-4)',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <h4
              style={{
                margin: 0,
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--color-text)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)'
              }}
            >
              <Bell size={20} weight="regular" />
              Notifications
            </h4>
            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  color: isConnected ? 'var(--color-success)' : 'var(--color-danger)',
                  fontWeight: 'var(--weight-medium)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-1)'
                }}
              >
                {isConnected ? <CheckCircle size={12} weight="fill" /> : <XCircle size={12} weight="fill" />} 
                {isConnected ? 'Live' : 'Offline'}
              </span>
              <button
                onClick={clearNotifications}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--space-1) var(--space-2)',
                  fontSize: 'var(--text-xs)',
                  cursor: 'pointer',
                  color: 'var(--color-text-secondary)',
                  transition: 'all var(--motion-duration) var(--motion-ease-standard)'
                }}
                disabled={notifications.length === 0}
              >
                Clear
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div
            style={{
              maxHeight: '400px',
              overflowY: 'auto'
            }}
          >
            {notifications.length === 0 ? (
              <div
                style={{
                  padding: 'var(--space-6)',
                  textAlign: 'center',
                  color: 'var(--color-text-secondary)'
                }}
              >
                <p style={{ margin: '0 0 var(--space-2) 0' }}>No notifications yet</p>
                <small>Notifications from N8N workflows will appear here</small>
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div
                  key={index}
                  style={{
                    padding: 'var(--space-3) var(--space-4)',
                    borderBottom: '1px solid var(--color-border)',
                    borderLeft: `4px solid ${getSeverityColor(notification.severity)}`,
                    background: index % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-alt)'
                  }}
                >
                  <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      minWidth: '20px'
                    }}>
                      {getSeverityIcon(notification.severity)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--weight-medium)',
                          marginBottom: 'var(--space-1)',
                          color: 'var(--color-text)'
                        }}
                      >
                        {notification.message}
                      </div>
                      <div
                        style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--color-text-secondary)',
                          display: 'flex',
                          gap: 'var(--space-2)',
                          flexWrap: 'wrap'
                        }}
                      >
                        <span style={{ textTransform: 'uppercase', fontWeight: 'var(--weight-medium)' }}>
                          {notification.type.replace('_', ' ')}
                        </span>
                        <span>{formatTimestamp(notification.timestamp)}</span>
                        {notification.shipment_id && (
                          <span>Shipment: {notification.shipment_id}</span>
                        )}
                        {notification.truck_id && (
                          <span>Truck: {notification.truck_id}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div
              style={{
                padding: 'var(--space-3) var(--space-4)',
                borderTop: '1px solid var(--color-border)',
                background: 'var(--color-surface-alt)',
                textAlign: 'center',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-secondary)'
              }}
            >
              {notifications.length} notification(s)
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
