import React, { useState, useEffect, useRef } from 'react';
import './NotificationPanel.css';

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
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const connectWebSocket = () => {
    try {
      const ws = new WebSocket('ws://localhost:8000/api/notifications/ws/notifications');
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setConnectionStatus('Connected');
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
        setConnectionStatus('Disconnected');
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
        setConnectionStatus('Error');
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setConnectionStatus('Failed to connect');
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
      case 'critical': return '🚨';
      case 'error': return '⚠️';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
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

  return (
    <div className="notification-panel">
      <div className="notification-header">
        <h3>🔔 Real-time Notifications</h3>
        <div className="notification-controls">
          <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            {connectionStatus}
          </span>
          <button 
            onClick={clearNotifications}
            className="clear-btn"
            disabled={notifications.length === 0}
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="notification-list">
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <p>No notifications yet</p>
            <small>Notifications from N8N workflows will appear here</small>
          </div>
        ) : (
          notifications.map((notification, index) => (
            <div 
              key={index} 
              className="notification-item"
              style={{ borderLeftColor: getSeverityColor(notification.severity) }}
            >
              <div className="notification-icon">
                {getSeverityIcon(notification.severity)}
              </div>
              <div className="notification-content">
                <div className="notification-message">
                  {notification.message}
                </div>
                <div className="notification-meta">
                  <span className="notification-type">
                    {notification.type.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="notification-time">
                    {formatTimestamp(notification.timestamp)}
                  </span>
                  {notification.shipment_id && (
                    <span className="notification-id">
                      Shipment: {notification.shipment_id}
                    </span>
                  )}
                  {notification.truck_id && (
                    <span className="notification-id">
                      Truck: {notification.truck_id}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <div className="notification-footer">
          <small>{notifications.length} notification(s)</small>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
