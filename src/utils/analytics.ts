// Analytics utility for tracking user interactions
// This can be extended with Google Analytics, Plausible, or other analytics platforms

export type AnalyticsEvent = 
  | 'cta_click' 
  | 'lead_submit' 
  | 'scroll_75' 
  | 'scroll_50'
  | 'outbound_click' 
  | 'page_view'
  | 'rule_view'
  | 'assessment_start'
  | 'assessment_complete';

export interface AnalyticsEventData {
  event: AnalyticsEvent;
  properties?: Record<string, any>;
}

// Basic analytics tracking function
export function track(event: AnalyticsEvent, properties: Record<string, any> = {}): void {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics:', event, properties);
  }

  // Add timestamp
  const eventData: AnalyticsEventData = {
    event,
    properties: {
      ...properties,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      referrer: document.referrer,
    }
  };

  // Send to analytics service (placeholder for future implementation)
  // This is where you'd integrate with Google Analytics, Plausible, etc.
  sendToAnalyticsService(eventData);
}

// Placeholder for analytics service integration
function sendToAnalyticsService(data: AnalyticsEventData): void {
  // Example: Google Analytics 4
  // if (window.gtag) {
  //   window.gtag('event', data.event, data.properties);
  // }

  // Example: Plausible
  // if (window.plausible) {
  //   window.plausible(data.event, { props: data.properties });
  // }

  // Store in localStorage for now (development)
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('fe_analytics') || '[]';
    const events = JSON.parse(stored);
    events.push(data);
    
    // Keep only last 100 events
    if (events.length > 100) {
      events.shift();
    }
    
    localStorage.setItem('fe_analytics', JSON.stringify(events));
  }
}

// Track scroll depth
export function setupScrollTracking(): void {
  let scroll50Tracked = false;
  let scroll75Tracked = false;

  const handleScroll = () => {
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;

    if (!scroll50Tracked && scrollPercent >= 50) {
      scroll50Tracked = true;
      track('scroll_50');
    }

    if (!scroll75Tracked && scrollPercent >= 75) {
      scroll75Tracked = true;
      track('scroll_75');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Return cleanup function
  () => {
    window.removeEventListener('scroll', handleScroll);
  };
}

// Track outbound links
export function setupOutboundLinkTracking(): void {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const link = target.closest('a');

    if (link && link.hostname !== window.location.hostname) {
      track('outbound_click', {
        url: link.href,
        text: link.textContent?.trim() || '',
        hostname: link.hostname,
      });
    }
  });
}

// Track CTA clicks
export function trackCTA(ctaId: string, ctaText: string, location: string): void {
  track('cta_click', {
    cta_id: ctaId,
    cta_text: ctaText,
    location: location,
  });
}

// Track page views (for SPA routing)
export function trackPageView(path: string, title: string): void {
  track('page_view', {
    path,
    title,
  });
}

// Initialize analytics
export function initAnalytics(): void {
  // Track initial page view
  trackPageView(window.location.pathname, document.title);

  // Setup automatic tracking
  setupScrollTracking();
  setupOutboundLinkTracking();

  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics initialized');
  }
}