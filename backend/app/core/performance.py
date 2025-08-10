"""
Performance optimization and monitoring for SmartHaul backend.
Handles caching, connection pooling, and performance metrics.
"""

import time
import asyncio
from functools import wraps
from typing import Any, Dict, List, Optional
try:
    import redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False
    print("Warning: Redis not available. Using in-memory cache fallback.")

from fastapi import Request, Response
from fastapi.middleware.gzip import GZipMiddleware
from sqlalchemy import create_engine, event
from sqlalchemy.pool import QueuePool
import psutil
import logging

# Performance monitoring
logger = logging.getLogger(__name__)

class PerformanceMonitor:
    """Real-time performance monitoring for SmartHaul."""
    
    def __init__(self):
        self.metrics = {
            'api_calls': 0,
            'avg_response_time': 0,
            'error_rate': 0,
            'db_queries': 0,
            'cache_hits': 0,
            'cache_misses': 0
        }
        self.start_time = time.time()
    
    def record_api_call(self, response_time: float, status_code: int):
        """Record API call metrics."""
        self.metrics['api_calls'] += 1
        self.metrics['avg_response_time'] = (
            (self.metrics['avg_response_time'] * (self.metrics['api_calls'] - 1) + response_time) 
            / self.metrics['api_calls']
        )
        if status_code >= 400:
            self.metrics['error_rate'] = (
                (self.metrics['error_rate'] * (self.metrics['api_calls'] - 1) + 1) 
                / self.metrics['api_calls']
            )
    
    def record_db_query(self):
        """Record database query."""
        self.metrics['db_queries'] += 1
    
    def record_cache_hit(self):
        """Record cache hit."""
        self.metrics['cache_hits'] += 1
    
    def record_cache_miss(self):
        """Record cache miss."""
        self.metrics['cache_misses'] += 1
    
    def get_system_metrics(self) -> Dict[str, Any]:
        """Get current system metrics."""
        return {
            'cpu_percent': psutil.cpu_percent(interval=1),
            'memory_percent': psutil.virtual_memory().percent,
            'disk_usage': psutil.disk_usage('/').percent,
            'uptime': time.time() - self.start_time,
            **self.metrics
        }

# Global performance monitor
performance_monitor = PerformanceMonitor()

class InMemoryCache:
    """In-memory caching fallback when Redis is not available."""
    
    def __init__(self):
        self.cache = {}
        self.default_ttl = 300  # 5 minutes
    
    async def get(self, key: str) -> Optional[str]:
        """Get value from cache."""
        if key in self.cache:
            value, expiry = self.cache[key]
            if time.time() < expiry:
                performance_monitor.record_cache_hit()
                return value
            else:
                del self.cache[key]
        performance_monitor.record_cache_miss()
        return None
    
    async def set(self, key: str, value: str, ttl: int = None) -> bool:
        """Set value in cache."""
        try:
            ttl = ttl or self.default_ttl
            expiry = time.time() + ttl
            self.cache[key] = (value, expiry)
            return True
        except Exception as e:
            logger.error(f"In-memory cache set error: {e}")
            return False
    
    async def delete(self, key: str) -> bool:
        """Delete value from cache."""
        try:
            if key in self.cache:
                del self.cache[key]
            return True
        except Exception as e:
            logger.error(f"In-memory cache delete error: {e}")
            return False

class RedisCache:
    """Redis caching layer for performance optimization."""
    
    def __init__(self, redis_url: str = "redis://localhost:6379"):
        if REDIS_AVAILABLE:
            try:
                self.redis = redis.from_url(redis_url, decode_responses=True)
                self.default_ttl = 300  # 5 minutes
            except Exception as e:
                logger.error(f"Redis connection failed: {e}")
                raise
        else:
            raise ImportError("Redis not available")
    
    async def get(self, key: str) -> Optional[str]:
        """Get value from cache."""
        try:
            value = self.redis.get(key)
            if value:
                performance_monitor.record_cache_hit()
                return value
            else:
                performance_monitor.record_cache_miss()
                return None
        except Exception as e:
            logger.error(f"Redis get error: {e}")
            return None
    
    async def set(self, key: str, value: str, ttl: int = None) -> bool:
        """Set value in cache."""
        try:
            ttl = ttl or self.default_ttl
            return self.redis.setex(key, ttl, value)
        except Exception as e:
            logger.error(f"Redis set error: {e}")
            return False
    
    async def delete(self, key: str) -> bool:
        """Delete value from cache."""
        try:
            return bool(self.redis.delete(key))
        except Exception as e:
            logger.error(f"Redis delete error: {e}")
            return False

# Global cache instance - use Redis if available, otherwise fallback to in-memory
try:
    if REDIS_AVAILABLE:
        cache = RedisCache()
    else:
        cache = InMemoryCache()
except Exception as e:
    logger.warning(f"Failed to initialize Redis cache: {e}. Using in-memory fallback.")
    cache = InMemoryCache()

def cache_response(ttl: int = 300):
    """Decorator to cache API responses."""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Create cache key from function name and arguments
            cache_key = f"{func.__name__}:{hash(str(args) + str(kwargs))}"
            
            # Try to get from cache first
            cached_result = await cache.get(cache_key)
            if cached_result:
                return cached_result
            
            # Execute function and cache result
            result = await func(*args, **kwargs)
            await cache.set(cache_key, str(result), ttl)
            return result
        return wrapper
    return decorator

def monitor_performance(func):
    """Decorator to monitor function performance."""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start_time = time.time()
        try:
            result = await func(*args, **kwargs)
            response_time = time.time() - start_time
            performance_monitor.record_api_call(response_time, 200)
            return result
        except Exception as e:
            response_time = time.time() - start_time
            performance_monitor.record_api_call(response_time, 500)
            raise e
    return wrapper

class DatabaseOptimizer:
    """Database performance optimization utilities."""
    
    @staticmethod
    def create_optimized_engine(database_url: str) -> Any:
        """Create optimized database engine with connection pooling."""
        engine = create_engine(
            database_url,
            poolclass=QueuePool,
            pool_size=20,  # Number of connections to maintain
            max_overflow=30,  # Additional connections when pool is full
            pool_pre_ping=True,  # Validate connections before use
            pool_recycle=3600,  # Recycle connections every hour
            echo=False  # Set to True for SQL logging
        )
        
        # Add performance monitoring
        @event.listens_for(engine, "before_cursor_execute")
        def before_cursor_execute(conn, cursor, statement, parameters, context, executemany):
            conn.info.setdefault('query_start_time', []).append(time.time())
            performance_monitor.record_db_query()
        
        @event.listens_for(engine, "after_cursor_execute")
        def after_cursor_execute(conn, cursor, statement, parameters, context, executemany):
            total = time.time() - conn.info['query_start_time'].pop(-1)
            if total > 1.0:  # Log slow queries
                logger.warning(f"Slow query detected: {total:.2f}s - {statement[:100]}")
        
        return engine

# Performance middleware
from starlette.middleware.base import BaseHTTPMiddleware

class PerformanceMiddleware(BaseHTTPMiddleware):
    """Middleware to monitor request performance."""
    
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Add performance headers
        response = await call_next(request)
        
        # Calculate response time
        response_time = time.time() - start_time
        
        # Add performance headers
        response.headers["X-Response-Time"] = str(response_time)
        response.headers["X-Cache-Hit-Ratio"] = str(
            performance_monitor.metrics['cache_hits'] / 
            max(performance_monitor.metrics['cache_hits'] + performance_monitor.metrics['cache_misses'], 1)
        )
        
        # Record metrics
        performance_monitor.record_api_call(response_time, response.status_code)
        
        return response

# Rate limiting
class RateLimiter:
    """Simple rate limiting implementation."""
    
    def __init__(self, requests_per_minute: int = 100):
        self.requests_per_minute = requests_per_minute
        self.requests = {}
    
    def is_allowed(self, client_id: str) -> bool:
        """Check if request is allowed."""
        now = time.time()
        minute_ago = now - 60
        
        # Clean old requests
        if client_id in self.requests:
            self.requests[client_id] = [req_time for req_time in self.requests[client_id] if req_time > minute_ago]
        else:
            self.requests[client_id] = []
        
        # Check rate limit
        if len(self.requests[client_id]) >= self.requests_per_minute:
            return False
        
        # Add current request
        self.requests[client_id].append(now)
        return True

# Global rate limiter
rate_limiter = RateLimiter() 