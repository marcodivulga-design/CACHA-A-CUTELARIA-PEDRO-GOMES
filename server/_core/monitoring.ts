import { Request, Response } from 'express';

interface MetricEvent {
  timestamp: Date;
  name: string;
  value: number;
  tags?: Record<string, string>;
}

interface Alert {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  severity: 'critical' | 'warning' | 'info';
  triggered: boolean;
  lastTriggered?: Date;
}

class MonitoringService {
  private metrics: MetricEvent[] = [];
  private alerts: Alert[] = [];
  private maxMetricsHistory = 10000;

  // Record a metric
  recordMetric(name: string, value: number, tags?: Record<string, string>) {
    const event: MetricEvent = {
      timestamp: new Date(),
      name,
      value,
      tags,
    };

    this.metrics.push(event);

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetricsHistory) {
      this.metrics = this.metrics.slice(-this.maxMetricsHistory);
    }

    // Check alerts
    this.checkAlerts(name, value);
  }

  // Record request metrics
  recordRequestMetric(req: Request, res: Response, duration: number) {
    this.recordMetric('http_request_duration_ms', duration, {
      method: req.method,
      path: req.path,
      status: res.statusCode.toString(),
    });

    if (res.statusCode >= 400) {
      this.recordMetric('http_error_total', 1, {
        method: req.method,
        path: req.path,
        status: res.statusCode.toString(),
      });
    }
  }

  // Record database metrics
  recordDatabaseMetric(query: string, duration: number, success: boolean) {
    this.recordMetric('db_query_duration_ms', duration, {
      query: query.substring(0, 50),
      success: success.toString(),
    });

    if (!success) {
      this.recordMetric('db_error_total', 1, {
        query: query.substring(0, 50),
      });
    }
  }

  // Record cache metrics
  recordCacheMetric(key: string, hit: boolean, duration: number) {
    this.recordMetric('cache_access_duration_ms', duration, {
      key: key.substring(0, 50),
      hit: hit.toString(),
    });

    if (hit) {
      this.recordMetric('cache_hit_total', 1);
    } else {
      this.recordMetric('cache_miss_total', 1);
    }
  }

  // Record error
  recordError(error: Error, context: string) {
    this.recordMetric('error_total', 1, {
      error: error.name,
      context,
    });

    console.error({
      timestamp: new Date().toISOString(),
      error: error.message,
      context,
      stack: error.stack,
    });
  }

  // Get metrics summary
  getMetricsSummary(name: string, timeWindow: number = 60000) {
    const now = Date.now();
    const recentMetrics = this.metrics.filter(
      m => m.name === name && now - m.timestamp.getTime() < timeWindow
    );

    if (recentMetrics.length === 0) {
      return null;
    }

    const values = recentMetrics.map(m => m.value);
    return {
      count: values.length,
      sum: values.reduce((a, b) => a + b, 0),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      p95: this.calculatePercentile(values, 95),
      p99: this.calculatePercentile(values, 99),
    };
  }

  // Calculate percentile
  private calculatePercentile(values: number[], percentile: number): number {
    const sorted = values.sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }

  // Create alert
  createAlert(name: string, condition: string, threshold: number, severity: 'critical' | 'warning' | 'info' = 'warning') {
    const alert: Alert = {
      id: 'alert-' + Date.now(),
      name,
      condition,
      threshold,
      severity,
      triggered: false,
    };

    this.alerts.push(alert);
    return alert;
  }

  // Check alerts
  private checkAlerts(metricName: string, value: number) {
    this.alerts.forEach(alert => {
      if (alert.name === metricName) {
        const triggered = this.evaluateCondition(alert.condition, value, alert.threshold);

        if (triggered && !alert.triggered) {
          alert.triggered = true;
          alert.lastTriggered = new Date();
          this.handleAlert(alert, value);
        } else if (!triggered && alert.triggered) {
          alert.triggered = false;
        }
      }
    });
  }

  // Evaluate alert condition
  private evaluateCondition(condition: string, value: number, threshold: number): boolean {
    switch (condition) {
      case 'greater_than':
        return value > threshold;
      case 'less_than':
        return value < threshold;
      case 'equal':
        return value === threshold;
      case 'not_equal':
        return value !== threshold;
      default:
        return false;
    }
  }

  // Handle alert
  private handleAlert(alert: Alert, value: number) {
    const message = `Alert: ${alert.name} (${alert.severity}) - Value: ${value}, Threshold: ${alert.threshold}`;

    console.warn({
      timestamp: new Date().toISOString(),
      alert: alert.name,
      severity: alert.severity,
      value,
      threshold: alert.threshold,
    });

    // Send notification (email, Slack, etc.)
    this.sendNotification(alert, message);
  }

  // Send notification
  private sendNotification(alert: Alert, message: string) {
    // Implement notification logic
    // - Send email
    // - Send Slack message
    // - Send SMS
    // - Create incident in monitoring service
    console.log(`Sending notification for alert: ${alert.name}`);
  }

  // Get health status
  getHealthStatus() {
    const requestMetrics = this.getMetricsSummary('http_request_duration_ms');
    const errorMetrics = this.getMetricsSummary('http_error_total');
    const dbMetrics = this.getMetricsSummary('db_query_duration_ms');

    return {
      status: 'healthy',
      timestamp: new Date(),
      metrics: {
        requests: requestMetrics,
        errors: errorMetrics,
        database: dbMetrics,
      },
      alerts: this.alerts.filter(a => a.triggered),
    };
  }

  // Get metrics for dashboard
  getMetricsDashboard() {
    return {
      totalRequests: this.metrics.filter(m => m.name === 'http_request_duration_ms').length,
      totalErrors: this.metrics.filter(m => m.name === 'http_error_total').length,
      averageResponseTime: this.getMetricsSummary('http_request_duration_ms')?.avg || 0,
      errorRate: this.calculateErrorRate(),
      cacheHitRate: this.calculateCacheHitRate(),
      activeAlerts: this.alerts.filter(a => a.triggered).length,
    };
  }

  // Calculate error rate
  private calculateErrorRate(): number {
    const total = this.metrics.filter(m => m.name === 'http_request_duration_ms').length;
    const errors = this.metrics.filter(m => m.name === 'http_error_total').length;
    return total > 0 ? (errors / total) * 100 : 0;
  }

  // Calculate cache hit rate
  private calculateCacheHitRate(): number {
    const hits = this.metrics.filter(m => m.name === 'cache_hit_total').length;
    const misses = this.metrics.filter(m => m.name === 'cache_miss_total').length;
    const total = hits + misses;
    return total > 0 ? (hits / total) * 100 : 0;
  }

  // Export metrics
  exportMetrics(format: 'json' | 'prometheus' = 'json') {
    if (format === 'prometheus') {
      return this.exportPrometheus();
    }
    return this.metrics;
  }

  // Export in Prometheus format
  private exportPrometheus(): string {
    let output = '';

    // Request metrics
    const requestMetrics = this.getMetricsSummary('http_request_duration_ms');
    if (requestMetrics) {
      output += `http_request_duration_ms{quantile="0.5"} ${requestMetrics.avg}\n`;
      output += `http_request_duration_ms{quantile="0.95"} ${requestMetrics.p95}\n`;
      output += `http_request_duration_ms{quantile="0.99"} ${requestMetrics.p99}\n`;
    }

    // Error metrics
    const errorCount = this.metrics.filter(m => m.name === 'http_error_total').length;
    output += `http_error_total ${errorCount}\n`;

    // Cache metrics
    const cacheHits = this.metrics.filter(m => m.name === 'cache_hit_total').length;
    const cacheMisses = this.metrics.filter(m => m.name === 'cache_miss_total').length;
    output += `cache_hits_total ${cacheHits}\n`;
    output += `cache_misses_total ${cacheMisses}\n`;

    return output;
  }

  // Clear old metrics
  clearOldMetrics(maxAge: number = 3600000) {
    const now = Date.now();
    this.metrics = this.metrics.filter(m => now - m.timestamp.getTime() < maxAge);
  }
}

export const monitoring = new MonitoringService();

// Middleware to record request metrics
export function monitoringMiddleware(req: Request, res: Response, next: Function) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    monitoring.recordRequestMetric(req, res, duration);
  });

  next();
}
