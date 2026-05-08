import { useEffect } from 'react';
import { trpc } from '../lib/trpc';

interface PageViewEvent {
  page: string;
  referrer?: string;
}

interface CustomEvent {
  event: string;
  category: string;
  label?: string;
  value?: number;
}

export function useAnalytics() {
  const trackPageViewMutation = trpc.analytics.trackPageView.useMutation();
  const trackEventMutation = trpc.analytics.trackEvent.useMutation();

  // Track page view on mount and URL change
  useEffect(() => {
    const pageViewEvent: PageViewEvent = {
      page: window.location.pathname,
      referrer: document.referrer,
    };

    trackPageViewMutation.mutate({
      ...pageViewEvent,
      timestamp: Date.now(),
    });
  }, [window.location.pathname]);

  // Track custom event
  const trackEvent = (event: CustomEvent) => {
    trackEventMutation.mutate({
      ...event,
      timestamp: Date.now(),
    });
  };

  // Track button click
  const trackClick = (label: string, category: string = 'button') => {
    trackEvent({
      event: 'click',
      category,
      label,
    });
  };

  // Track form submission
  const trackFormSubmit = (formName: string) => {
    trackEvent({
      event: 'form_submit',
      category: 'form',
      label: formName,
    });
  };

  // Track product view
  const trackProductView = (productId: string, productName: string) => {
    trackEvent({
      event: 'view_item',
      category: 'product',
      label: productName,
      value: 1,
    });
  };

  // Track add to cart
  const trackAddToCart = (productId: string, productName: string, price: number) => {
    trackEvent({
      event: 'add_to_cart',
      category: 'cart',
      label: productName,
      value: price,
    });
  };

  // Track purchase
  const trackPurchase = (orderId: string, total: number, itemCount: number) => {
    trackEvent({
      event: 'purchase',
      category: 'transaction',
      label: orderId,
      value: total,
    });
  };

  // Track search
  const trackSearch = (query: string, resultCount: number) => {
    trackEvent({
      event: 'search',
      category: 'search',
      label: query,
      value: resultCount,
    });
  };

  // Track page scroll
  const trackScroll = (depth: number) => {
    trackEvent({
      event: 'scroll',
      category: 'engagement',
      label: `${depth}%`,
      value: depth,
    });
  };

  // Track video play
  const trackVideoPlay = (videoId: string, videoTitle: string) => {
    trackEvent({
      event: 'video_play',
      category: 'video',
      label: videoTitle,
    });
  };

  // Track error
  const trackError = (errorMessage: string, errorType: string = 'error') => {
    trackEvent({
      event: 'error',
      category: errorType,
      label: errorMessage,
    });
  };

  return {
    trackEvent,
    trackClick,
    trackFormSubmit,
    trackProductView,
    trackAddToCart,
    trackPurchase,
    trackSearch,
    trackScroll,
    trackVideoPlay,
    trackError,
  };
}
