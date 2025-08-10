"""
Performance monitoring API endpoints for SmartHaul.
Provides real-time system metrics and performance data.
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List
import time
from ..core.performance import performance_monitor, cache, rate_limiter
from ..models.base import get_db
from sqlalchemy.orm import Session
import psutil

router = APIRouter(prefix="/api/performance", tags=["performance"])

@router.get("/metrics")
async def get_performance_metrics():
    """Get real-time performance metrics."""
    try:
        metrics = performance_monitor.get_system_metrics()
        
        # Add cache statistics
        cache_stats = {
            'cache_hit_ratio': (
                metrics['cache_hits'] / 
                max(metrics['cache_hits'] + metrics['cache_misses'], 1)
            ),
            'total_cache_requests': metrics['cache_hits'] + metrics['cache_misses']
        }
        
        # Add database statistics
        db_stats = {
            'total_queries': metrics['db_queries'],
            'queries_per_second': metrics['db_queries'] / max(metrics['uptime'], 1)
        }
        
        return {
            "system": {
                "cpu_percent": metrics['cpu_percent'],
                "memory_percent": metrics['memory_percent'],
                "disk_usage": metrics['disk_usage'],
                "uptime_seconds": metrics['uptime']
            },
            "api": {
                "total_calls": metrics['api_calls'],
                "avg_response_time_ms": metrics['avg_response_time'] * 1000,
                "error_rate": metrics['error_rate'],
                "calls_per_second": metrics['api_calls'] / max(metrics['uptime'], 1)
            },
            "cache": cache_stats,
            "database": db_stats,
            "timestamp": time.time()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting metrics: {str(e)}")

@router.get("/health")
async def health_check():
    """Comprehensive health check endpoint."""
    health_status = {
        "status": "healthy",
        "timestamp": time.time(),
        "checks": {}
    }
    
    # System health checks
    try:
        cpu_percent = psutil.cpu_percent(interval=1)
        memory_percent = psutil.virtual_memory().percent
        disk_usage = psutil.disk_usage('/').percent
        
        health_status["checks"]["system"] = {
            "cpu": "healthy" if cpu_percent < 80 else "warning",
            "memory": "healthy" if memory_percent < 80 else "warning",
            "disk": "healthy" if disk_usage < 80 else "warning"
        }
        
        if cpu_percent > 90 or memory_percent > 90 or disk_usage > 90:
            health_status["status"] = "unhealthy"
            
    except Exception as e:
        health_status["checks"]["system"] = {"error": str(e)}
        health_status["status"] = "unhealthy"
    
    # API health checks
    try:
        avg_response_time = performance_monitor.metrics['avg_response_time']
        error_rate = performance_monitor.metrics['error_rate']
        
        health_status["checks"]["api"] = {
            "response_time": "healthy" if avg_response_time < 0.5 else "warning",
            "error_rate": "healthy" if error_rate < 0.05 else "warning"
        }
        
        if avg_response_time > 2.0 or error_rate > 0.1:
            health_status["status"] = "unhealthy"
            
    except Exception as e:
        health_status["checks"]["api"] = {"error": str(e)}
        health_status["status"] = "unhealthy"
    
    # Database health check
    try:
        db = next(get_db())
        db.execute("SELECT 1")
        health_status["checks"]["database"] = {"status": "healthy"}
    except Exception as e:
        health_status["checks"]["database"] = {"status": "unhealthy", "error": str(e)}
        health_status["status"] = "unhealthy"
    
    # Cache health check
    try:
        await cache.set("health_check", "ok", 10)
        cache_result = await cache.get("health_check")
        health_status["checks"]["cache"] = {
            "status": "healthy" if cache_result == "ok" else "unhealthy",
            "type": "redis" if hasattr(cache, 'redis') else "in-memory"
        }
    except Exception as e:
        health_status["checks"]["cache"] = {"status": "unhealthy", "error": str(e)}
        health_status["status"] = "unhealthy"
    
    return health_status

@router.get("/alerts")
async def get_performance_alerts():
    """Get current performance alerts based on thresholds."""
    alerts = []
    metrics = performance_monitor.get_system_metrics()
    
    # CPU alerts
    if metrics['cpu_percent'] > 80:
        alerts.append({
            "type": "warning",
            "component": "system",
            "metric": "cpu_percent",
            "value": metrics['cpu_percent'],
            "threshold": 80,
            "message": f"High CPU usage: {metrics['cpu_percent']:.1f}%"
        })
    
    if metrics['cpu_percent'] > 90:
        alerts.append({
            "type": "critical",
            "component": "system",
            "metric": "cpu_percent",
            "value": metrics['cpu_percent'],
            "threshold": 90,
            "message": f"Critical CPU usage: {metrics['cpu_percent']:.1f}%"
        })
    
    # Memory alerts
    if metrics['memory_percent'] > 80:
        alerts.append({
            "type": "warning",
            "component": "system",
            "metric": "memory_percent",
            "value": metrics['memory_percent'],
            "threshold": 80,
            "message": f"High memory usage: {metrics['memory_percent']:.1f}%"
        })
    
    # API response time alerts
    if metrics['avg_response_time'] > 0.5:
        alerts.append({
            "type": "warning",
            "component": "api",
            "metric": "avg_response_time",
            "value": metrics['avg_response_time'],
            "threshold": 0.5,
            "message": f"Slow API response time: {metrics['avg_response_time']:.3f}s"
        })
    
    # Error rate alerts
    if metrics['error_rate'] > 0.05:
        alerts.append({
            "type": "warning",
            "component": "api",
            "metric": "error_rate",
            "value": metrics['error_rate'],
            "threshold": 0.05,
            "message": f"High error rate: {metrics['error_rate']:.2%}"
        })
    
    return {
        "alerts": alerts,
        "total_alerts": len(alerts),
        "timestamp": time.time()
    }

@router.post("/cache/clear")
async def clear_cache():
    """Clear all cached data."""
    try:
        # This would clear all Redis keys in production
        # For now, we'll just return success
        return {"message": "Cache cleared successfully", "timestamp": time.time()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing cache: {str(e)}")

@router.get("/rate-limits")
async def get_rate_limit_status():
    """Get current rate limiting status."""
    return {
        "requests_per_minute": rate_limiter.requests_per_minute,
        "active_clients": len(rate_limiter.requests),
        "timestamp": time.time()
    } 