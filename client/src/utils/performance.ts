// Performance optimization utilities

// 1. Image optimization
export function getOptimizedImageUrl(url: string, width: number, quality: number = 80) {
  // Use image CDN or local optimization
  return `${url}?w=${width}&q=${quality}&fm=webp`;
}

// 2. Lazy loading images
export function setupLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach((img) => {
      imageObserver.observe(img);
    });
  }
}

// 3. Debounce function for search
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 4. Throttle function for scroll events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// 5. Prefetch links
export function prefetchLinks() {
  document.querySelectorAll('a[data-prefetch]').forEach((link) => {
    const href = link.getAttribute('href');
    if (href) {
      const prefetch = document.createElement('link');
      prefetch.rel = 'prefetch';
      prefetch.href = href;
      document.head.appendChild(prefetch);
    }
  });
}

// 6. Measure Core Web Vitals
export function measureCoreWebVitals() {
  // Largest Contentful Paint (LCP)
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log('LCP:', entry);
    }
  });
  observer.observe({ entryTypes: ['largest-contentful-paint'] });

  // First Input Delay (FID)
  const fidObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log('FID:', entry);
    }
  });
  fidObserver.observe({ entryTypes: ['first-input'] });

  // Cumulative Layout Shift (CLS)
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        clsValue += (entry as any).value;
        console.log('CLS:', clsValue);
      }
    }
  });
  clsObserver.observe({ entryTypes: ['layout-shift'] });
}

// 7. Request idle callback polyfill
export function scheduleIdleTask(callback: () => void) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback);
  } else {
    setTimeout(callback, 1);
  }
}

// 8. Cache API responses
export function cacheResponse(key: string, data: any, ttl: number = 3600000) {
  const cached = {
    data,
    timestamp: Date.now(),
    ttl,
  };
  localStorage.setItem(`cache_${key}`, JSON.stringify(cached));
}

export function getCachedResponse(key: string) {
  const cached = localStorage.getItem(`cache_${key}`);
  if (!cached) return null;

  const { data, timestamp, ttl } = JSON.parse(cached);
  if (Date.now() - timestamp > ttl) {
    localStorage.removeItem(`cache_${key}`);
    return null;
  }

  return data;
}

// 9. Optimize bundle size
export function analyzeBundle() {
  if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    console.log('Bundle metrics:', {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      transferSize: navigation.transferSize,
      decodedBodySize: navigation.decodedBodySize,
    });
  }
}

// 10. Minimize main thread work
export function minimizeMainThreadWork() {
  // Break long tasks into smaller chunks
  const tasks: (() => void)[] = [];

  function processTasks() {
    const deadline = performance.now() + 5; // 5ms time slice
    while (tasks.length > 0 && performance.now() < deadline) {
      const task = tasks.shift();
      task?.();
    }
    if (tasks.length > 0) {
      setTimeout(processTasks, 0);
    }
  }

  return {
    addTask: (task: () => void) => {
      tasks.push(task);
      if (tasks.length === 1) {
        processTasks();
      }
    },
  };
}
