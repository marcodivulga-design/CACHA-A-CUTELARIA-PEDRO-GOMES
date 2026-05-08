import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAnalytics } from '../hooks/useAnalytics';

export function AnalyticsTracker() {
  const [location] = useLocation();
  const { trackEvent } = useAnalytics();

  // Track page changes
  useEffect(() => {
    trackEvent({
      event: 'page_view',
      category: 'navigation',
      label: location,
    });
  }, [location, trackEvent]);

  // Track scroll depth
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        const scrollPercent = scrollHeight > 0 ? Math.round((scrolled / scrollHeight) * 100) : 0;

        if (scrollPercent > 0 && scrollPercent % 25 === 0) {
          trackEvent({
            event: 'scroll_depth',
            category: 'engagement',
            label: `${scrollPercent}%`,
            value: scrollPercent,
          });
        }
      }, 1000);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [trackEvent]);

  // Track time on page
  useEffect(() => {
    const startTime = Date.now();

    return () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000);
      if (timeOnPage > 5) {
        trackEvent({
          event: 'time_on_page',
          category: 'engagement',
          label: location,
          value: timeOnPage,
        });
      }
    };
  }, [location, trackEvent]);

  return null; // This component doesn't render anything
}
