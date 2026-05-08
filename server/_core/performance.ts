import { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import Redis from 'ioredis';

// Initialize Redis for caching
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  db: parseInt(process.env.REDIS_DB || '0'),
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

interface CacheOptions {
  ttl: number; // Time to live in seconds
  key: string;
}

// Cache middleware
export function cacheMiddleware(options: CacheOptions) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      return next();
    }

    try {
      const cachedData = await redis.get(options.key);
      if (cachedData) {
        res.set('X-Cache', 'HIT');
        return res.json(JSON.parse(cachedData));
      }

      res.set('X-Cache', 'MISS');

      // Intercept response
      const originalJson = res.json.bind(res);
      res.json = function (data: any) {
        redis.setex(options.key, options.ttl, JSON.stringify(data)).catch(err => {
          console.error('Cache set error:', err);
        });
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
}

// Get cached data
export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

// Set cached data
export async function setCachedData<T>(key: string, data: T, ttl: number = 3600): Promise<void> {
  try {
    await redis.setex(key, ttl, JSON.stringify(data));
  } catch (error) {
    console.error('Cache set error:', error);
  }
}

// Delete cached data
export async function deleteCachedData(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (error) {
    console.error('Cache delete error:', error);
  }
}

// Clear all cache
export async function clearCache(): Promise<void> {
  try {
    await redis.flushdb();
  } catch (error) {
    console.error('Cache flush error:', error);
  }
}

// Compression middleware
export function compressionMiddleware() {
  return compression({
    level: 6,
    threshold: 1024, // Only compress responses larger than 1KB
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
  });
}

// Connection pooling for database
class ConnectionPool {
  private connections: any[] = [];
  private maxSize: number;
  private currentSize: number = 0;

  constructor(maxSize: number = 10) {
    this.maxSize = maxSize;
  }

  async getConnection(): Promise<any> {
    if (this.connections.length > 0) {
      return this.connections.pop();
    }

    if (this.currentSize < this.maxSize) {
      this.currentSize++;
      return this.createConnection();
    }

    // Wait for connection to be available
    return new Promise(resolve => {
      const interval = setInterval(() => {
        if (this.connections.length > 0) {
          clearInterval(interval);
          resolve(this.connections.pop());
        }
      }, 100);
    });
  }

  releaseConnection(connection: any): void {
    if (this.connections.length < this.maxSize) {
      this.connections.push(connection);
    } else {
      connection.close();
      this.currentSize--;
    }
  }

  private async createConnection(): Promise<any> {
    // Create database connection
    return {};
  }
}

export const connectionPool = new ConnectionPool(10);

// Query optimization
export class QueryOptimizer {
  static addIndexes(): string[] {
    return [
      'CREATE INDEX idx_products_category ON products(category)',
      'CREATE INDEX idx_orders_user_id ON orders(user_id)',
      'CREATE INDEX idx_orders_status ON orders(status)',
      'CREATE INDEX idx_payments_order_id ON payments(order_id)',
      'CREATE INDEX idx_users_email ON users(email)',
    ];
  }

  static optimizeQuery(query: string): string {
    // Add EXPLAIN to analyze query
    return `EXPLAIN ${query}`;
  }

  static getSlowQueryThreshold(): number {
    return 1000; // milliseconds
  }
}

// Response optimization
export function optimizeResponse(data: any): any {
  // Remove unnecessary fields
  // Compress data structures
  // Implement pagination
  return data;
}

// Image optimization
export class ImageOptimizer {
  static getOptimizedUrl(originalUrl: string, width: number, height: number, quality: number = 80): string {
    // Use image CDN or local image processing
    return `${originalUrl}?w=${width}&h=${height}&q=${quality}`;
  }

  static shouldLazyLoad(element: string): boolean {
    return element === 'img' || element === 'iframe';
  }
}

// Lazy loading middleware
export function lazyLoadingMiddleware(req: Request, res: Response, next: NextFunction) {
  res.locals.lazyLoad = true;
  next();
}

// Prefetch middleware
export function prefetchMiddleware(req: Request, res: Response, next: NextFunction) {
  res.set('Link', '</api/products>; rel=prefetch, </api/categories>; rel=prefetch');
  next();
}

// HTTP/2 Server Push
export function serverPushMiddleware(req: Request, res: Response, next: NextFunction) {
  if (res.push) {
    res.push('/css/style.css', {
      status: 200,
      method: 'GET',
      request: {
        accept: '*/*',
      },
      response: {
        'content-type': 'text/css',
      },
    });
  }
  next();
}

// Monitoring performance
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  getMetrics(name: string) {
    const values = this.metrics.get(name) || [];
    return {
      count: values.length,
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      p95: this.calculatePercentile(values, 95),
      p99: this.calculatePercentile(values, 99),
    };
  }

  private calculatePercentile(values: number[], percentile: number): number {
    const sorted = values.sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }

  clearMetrics(): void {
    this.metrics.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Database query caching
export async function cachedQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  const cached = await getCachedData<T>(key);
  if (cached) {
    return cached;
  }

  const result = await queryFn();
  await setCachedData(key, result, ttl);
  return result;
}

// Batch operations
export class BatchProcessor {
  private queue: any[] = [];
  private batchSize: number;
  private processFn: (batch: any[]) => Promise<void>;

  constructor(batchSize: number, processFn: (batch: any[]) => Promise<void>) {
    this.batchSize = batchSize;
    this.processFn = processFn;
  }

  add(item: any): void {
    this.queue.push(item);
    if (this.queue.length >= this.batchSize) {
      this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.queue.length === 0) return;

    const batch = this.queue.splice(0, this.batchSize);
    await this.processFn(batch);
  }
}

// Graceful shutdown
export async function gracefulShutdown() {
  console.log('Starting graceful shutdown...');

  // Close Redis connection
  await redis.quit();

  // Close database connections
  // Close other resources

  console.log('Graceful shutdown completed');
  process.exit(0);
}

// Setup performance monitoring
export function setupPerformanceMonitoring() {
  // Monitor memory usage
  setInterval(() => {
    const memUsage = process.memoryUsage();
    performanceMonitor.recordMetric('memory_rss', memUsage.rss);
    performanceMonitor.recordMetric('memory_heap_used', memUsage.heapUsed);
    performanceMonitor.recordMetric('memory_heap_total', memUsage.heapTotal);
  }, 60000); // Every minute

  // Monitor CPU usage
  // Monitor event loop lag
  // Monitor GC pauses
}
