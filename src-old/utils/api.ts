// Client-side API utilities for protected endpoints
// These functions handle communication with Arcjet-protected Netlify Functions

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  blocked?: boolean;
  reason?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    // Use environment variable for base URL, fallback to current origin
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;
  }

  private async makeRequest<T = any>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (response.status === 403 && data.blocked) {
        // Handle Arcjet blocks gracefully
        console.warn('Request blocked by security policy:', data.reason);
        return {
          success: false,
          error: data.message || 'Request blocked by security policy',
          blocked: true,
          reason: data.reason,
        };
      }

      if (response.status === 429) {
        // Handle rate limiting
        console.warn('Rate limit exceeded');
        return {
          success: false,
          error: 'Too many requests. Please wait before trying again.',
          blocked: true,
          reason: 'rate-limit',
        };
      }

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Request failed',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Analytics endpoint
  async trackEvent(event: string, data?: any): Promise<ApiResponse> {
    return this.makeRequest('/api/analytics', {
      method: 'POST',
      body: JSON.stringify({ event, data }),
    });
  }

  // Feedback endpoint
  async submitFeedback(type: string, message: string, email?: string): Promise<ApiResponse> {
    return this.makeRequest('/api/feedback', {
      method: 'POST',
      body: JSON.stringify({ type, message, email }),
    });
  }

  // Get analytics service info
  async getAnalyticsInfo(): Promise<ApiResponse> {
    return this.makeRequest('/api/analytics', { method: 'GET' });
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Convenience functions for common operations
export const analytics = {
  // Track when a user completes a rule
  trackRuleCompleted: (ruleId: number) => 
    apiClient.trackEvent('rule_completed', { ruleId, timestamp: Date.now() }),

  // Track section views
  trackSectionViewed: (sectionId: string) => 
    apiClient.trackEvent('section_viewed', { sectionId, timestamp: Date.now() }),

  // Track progress milestones
  trackProgress: (completedRules: number, totalRules: number) => 
    apiClient.trackEvent('progress_tracked', { 
      completedRules, 
      totalRules, 
      percentage: Math.round((completedRules / totalRules) * 100),
      timestamp: Date.now(),
    }),

  // Track guide printing
  trackGuidePrint: () => 
    apiClient.trackEvent('guide_printed', { timestamp: Date.now() }),
};

export const feedback = {
  // Submit bug report
  reportBug: (message: string, email?: string) => 
    apiClient.submitFeedback('bug', message, email),

  // Request feature
  requestFeature: (message: string, email?: string) => 
    apiClient.submitFeedback('feature', message, email),

  // General feedback
  general: (message: string, email?: string) => 
    apiClient.submitFeedback('general', message, email),

  // Submit testimonial
  testimonial: (message: string, email?: string) => 
    apiClient.submitFeedback('testimonial', message, email),
};

// Error handling utility
export const handleApiError = (response: ApiResponse): string => {
  if (response.blocked) {
    switch (response.reason) {
      case 'bot':
        return 'Access denied. Please disable any automation tools and try again.';
      case 'rate-limit':
        return 'Too many requests. Please wait a moment before trying again.';
      case 'shield':
        return 'Security policy violation. Please check your input and try again.';
      default:
        return 'Request blocked for security reasons.';
    }
  }
  
  return response.error || 'An unexpected error occurred.';
};