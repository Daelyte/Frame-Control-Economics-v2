/**
 * Web Vitals Performance Monitoring
 * Targets: LCP ≤ 1.8s, CLS < 0.1, INP < 200ms, FCP ≤ 1.2s
 */

export interface WebVitalMetric {
  name: 'CLS' | 'FCP' | 'FID' | 'INP' | 'LCP' | 'TTFB';
  value: number;
  delta: number;
  id: string;
  rating: 'good' | 'needs-improvement' | 'poor';
  navigationType: 'navigate' | 'reload' | 'back-forward' | 'prerender';
}

export interface PerformanceTargets {
  LCP: { good: 1800, poor: 2500 };      // ms
  FCP: { good: 1200, poor: 1800 };      // ms
  CLS: { good: 0.1, poor: 0.25 };       // score
  INP: { good: 200, poor: 500 };        // ms
  FID: { good: 100, poor: 300 };        // ms
  TTFB: { good: 600, poor: 1000 };      // ms
}

const PERFORMANCE_TARGETS: PerformanceTargets = {
  LCP: { good: 1800, poor: 2500 },
  FCP: { good: 1200, poor: 1800 },
  CLS: { good: 0.1, poor: 0.25 },
  INP: { good: 200, poor: 500 },
  FID: { good: 100, poor: 300 },
  TTFB: { good: 600, poor: 1000 }
};

export class WebVitalsMonitor {
  private metrics: Map<string, WebVitalMetric> = new Map();
  private observers: PerformanceObserver[] = [];
  private onMetric?: (metric: WebVitalMetric) => void;
  
  constructor(onMetric?: (metric: WebVitalMetric) => void) {
    this.onMetric = onMetric;
    this.initializeObservers();
  }

  private initializeObservers() {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    try {
      // LCP (Largest Contentful Paint)
      this.observeMetric('largest-contentful-paint', (entry) => {
        this.recordMetric('LCP', entry.renderTime || entry.loadTime);
      });

      // FCP (First Contentful Paint)
      this.observeMetric('first-contentful-paint', (entry) => {
        this.recordMetric('FCP', entry.startTime);
      });

      // CLS (Cumulative Layout Shift)
      this.observeMetric('layout-shift', (entry) => {
        if (!entry.hadRecentInput) {
          const currentCLS = this.metrics.get('CLS')?.value || 0;
          this.recordMetric('CLS', currentCLS + entry.value);
        }
      });

      // INP (Interaction to Next Paint) - newer metric
      if ('PerformanceEventTiming' in window) {
        this.observeMetric('event', (entry) => {
          if (entry.interactionId) {
            this.recordMetric('INP', entry.processingEnd - entry.startTime);
          }
        });
      }

      // FID (First Input Delay) - legacy fallback
      this.observeMetric('first-input', (entry) => {
        this.recordMetric('FID', entry.processingStart - entry.startTime);
      });

      // TTFB (Time to First Byte)
      if ('navigation' in performance) {
        const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navEntry) {
          this.recordMetric('TTFB', navEntry.responseStart - navEntry.requestStart);
        }
      }

    } catch (error) {
      console.warn('Failed to initialize Web Vitals observers:', error);
    }
  }

  private observeMetric(entryType: string, callback: (entry: any) => void) {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(callback);
      });
      
      observer.observe({ type: entryType, buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn(`Failed to observe ${entryType}:`, error);
    }
  }

  private recordMetric(name: WebVitalMetric['name'], value: number) {
    const targets = PERFORMANCE_TARGETS[name];
    const rating: WebVitalMetric['rating'] = 
      value <= targets.good ? 'good' : 
      value <= targets.poor ? 'needs-improvement' : 'poor';

    const prevValue = this.metrics.get(name)?.value || 0;
    const delta = value - prevValue;

    const metric: WebVitalMetric = {
      name,
      value,
      delta,
      id: `${name}-${Date.now()}`,
      rating,
      navigationType: this.getNavigationType()
    };

    this.metrics.set(name, metric);
    this.onMetric?.(metric);

    // Log performance issues
    if (rating === 'poor') {
      console.warn(`🚨 Poor ${name}: ${value}ms (target: ≤${targets.good}ms)`);
    }
  }

  private getNavigationType(): WebVitalMetric['navigationType'] {
    if ('navigation' in performance) {
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return navEntry?.type as WebVitalMetric['navigationType'] || 'navigate';
    }
    return 'navigate';
  }

  getMetrics(): WebVitalMetric[] {
    return Array.from(this.metrics.values());
  }

  getMetric(name: WebVitalMetric['name']): WebVitalMetric | undefined {
    return this.metrics.get(name);
  }

  getPerformanceScore(): {
    score: number;
    passing: number;
    total: number;
    breakdown: Record<string, boolean>;
  } {
    const metrics = this.getMetrics();
    const breakdown: Record<string, boolean> = {};
    let passing = 0;

    metrics.forEach(metric => {
      const isPassing = metric.rating === 'good';
      breakdown[metric.name] = isPassing;
      if (isPassing) passing++;
    });

    return {
      score: metrics.length > 0 ? Math.round((passing / metrics.length) * 100) : 0,
      passing,
      total: metrics.length,
      breakdown
    };
  }

  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }
}

/**
 * Report metrics to analytics endpoint
 */
export function reportWebVitals(metric: WebVitalMetric) {
  // Console logging for development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Web Vital:', {
      metric: metric.name,
      value: metric.value,
      rating: metric.rating,
      target: PERFORMANCE_TARGETS[metric.name].good
    });
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    try {
      // Replace with your analytics endpoint
      fetch('/api/vitals', {
        method: 'POST',
        keepalive: true,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...metric,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          connectionType: (navigator as any).connection?.effectiveType,
          deviceMemory: (navigator as any).deviceMemory
        })
      }).catch(err => {
        console.warn('Failed to report Web Vitals:', err);
      });
    } catch (error) {
      console.warn('Failed to report Web Vitals:', error);
    }
  }
}

/**
 * Hook for React components to monitor Web Vitals
 */
export function useWebVitals() {
  const [vitals, setVitals] = React.useState<WebVitalMetric[]>([]);
  const [score, setScore] = React.useState(0);
  
  React.useEffect(() => {
    const monitor = new WebVitalsMonitor((metric) => {
      setVitals(prev => {
        const updated = prev.filter(m => m.name !== metric.name);
        return [...updated, metric];
      });
      
      reportWebVitals(metric);
    });

    const updateScore = () => {
      const performanceScore = monitor.getPerformanceScore();
      setScore(performanceScore.score);
    };

    const interval = setInterval(updateScore, 1000);
    
    return () => {
      monitor.destroy();
      clearInterval(interval);
    };
  }, []);

  return { vitals, score };
}

// For environments without React
declare const React: any;