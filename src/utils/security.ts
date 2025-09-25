/**
 * Security utilities for input validation and sanitization
 * Prevents XSS, injection attacks, and data leakage
 */

// Content validation patterns
const VALIDATION_PATTERNS = {
  email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
  username: /^[a-zA-Z0-9_-]+$/,
  url: /^https?:\/\/.+/,
  safeText: /^[a-zA-Z0-9\s.,!?'"-]+$/
} as const;

// Content length limits (matching database constraints)
const CONTENT_LIMITS = {
  username: { min: 3, max: 30 },
  fullName: { min: 1, max: 100 },
  bio: { min: 0, max: 500 },
  storyTitle: { min: 5, max: 200 },
  storyContent: { min: 10, max: 5000 },
  commentContent: { min: 1, max: 2000 }
} as const;

// Rate limiting configuration
const RATE_LIMITS = {
  stories: { maxPerHour: 5, maxPerDay: 20 },
  comments: { maxPerMinute: 10, maxPerHour: 100 },
  likes: { maxPerMinute: 60 }
} as const;

/**
 * Sanitize text input to prevent XSS attacks
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/\\/g, '&#x5C;')
    .replace(/`/g, '&#x60;');
}

/**
 * Validate email format
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email) return { valid: false, error: 'Email is required' };
  if (!VALIDATION_PATTERNS.email.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  return { valid: true };
}

/**
 * Validate username
 */
export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username) return { valid: false, error: 'Username is required' };
  
  const { min, max } = CONTENT_LIMITS.username;
  if (username.length < min || username.length > max) {
    return { valid: false, error: `Username must be ${min}-${max} characters` };
  }
  
  if (!VALIDATION_PATTERNS.username.test(username)) {
    return { valid: false, error: 'Username can only contain letters, numbers, hyphens, and underscores' };
  }
  
  return { valid: true };
}

/**
 * Validate story title
 */
export function validateStoryTitle(title: string): { valid: boolean; error?: string } {
  if (!title) return { valid: false, error: 'Title is required' };
  
  const sanitized = sanitizeText(title);
  const { min, max } = CONTENT_LIMITS.storyTitle;
  
  if (sanitized.length < min || sanitized.length > max) {
    return { valid: false, error: `Title must be ${min}-${max} characters` };
  }
  
  // Check for potential spam patterns
  if (hasSpamPatterns(sanitized)) {
    return { valid: false, error: 'Title contains inappropriate content' };
  }
  
  return { valid: true };
}

/**
 * Validate story content
 */
export function validateStoryContent(content: string): { valid: boolean; error?: string } {
  if (!content) return { valid: false, error: 'Content is required' };
  
  const sanitized = sanitizeText(content);
  const { min, max } = CONTENT_LIMITS.storyContent;
  
  if (sanitized.length < min || sanitized.length > max) {
    return { valid: false, error: `Content must be ${min}-${max} characters` };
  }
  
  // Check for potential spam patterns
  if (hasSpamPatterns(sanitized)) {
    return { valid: false, error: 'Content contains inappropriate content' };
  }
  
  return { valid: true };
}

/**
 * Validate comment content
 */
export function validateCommentContent(content: string): { valid: boolean; error?: string } {
  if (!content) return { valid: false, error: 'Comment cannot be empty' };
  
  const sanitized = sanitizeText(content);
  const { min, max } = CONTENT_LIMITS.commentContent;
  
  if (sanitized.length < min || sanitized.length > max) {
    return { valid: false, error: `Comment must be ${min}-${max} characters` };
  }
  
  // Check for potential spam patterns
  if (hasSpamPatterns(sanitized)) {
    return { valid: false, error: 'Comment contains inappropriate content' };
  }
  
  return { valid: true };
}

/**
 * Check for common spam patterns
 */
function hasSpamPatterns(text: string): boolean {
  const spamPatterns = [
    /\b(viagra|cialis|casino|poker|gambling)\b/i,
    /\b(buy now|click here|free money|make money fast)\b/i,
    /http[s]?:\/\/[^\s]+/g, // Prevent URLs in content
    /(.)\1{10,}/, // Repeated characters (more than 10)
    /[A-Z]{10,}/, // Too many consecutive caps
  ];
  
  return spamPatterns.some(pattern => pattern.test(text));
}

/**
 * Rate limiting utility using localStorage
 */
class RateLimiter {
  private getKey(action: string): string {
    return `rateLimit_${action}`;
  }
  
  private getTimestamp(): number {
    return Date.now();
  }
  
  private cleanOldEntries(entries: number[], timeWindow: number): number[] {
    const cutoff = this.getTimestamp() - timeWindow;
    return entries.filter(timestamp => timestamp > cutoff);
  }
  
  public canPerformAction(
    action: keyof typeof RATE_LIMITS, 
    timeWindow: 'minute' | 'hour' | 'day' = 'minute'
  ): { allowed: boolean; error?: string; resetTime?: number } {
    try {
      const key = this.getKey(action);
      const stored = localStorage.getItem(key);
      const entries: number[] = stored ? JSON.parse(stored) : [];
      
      // Calculate time window in milliseconds
      const timeWindowMs = {
        minute: 60 * 1000,
        hour: 60 * 60 * 1000,
        day: 24 * 60 * 60 * 1000
      }[timeWindow];
      
      // Clean old entries
      const recentEntries = this.cleanOldEntries(entries, timeWindowMs);
      
      // Get rate limit for this action
      const limits = RATE_LIMITS[action];
      
      // Safely extract max actions based on time window and available limits
      let maxActions = 1000; // default fallback
      
      if (timeWindow === 'minute' && 'maxPerMinute' in limits) {
        maxActions = limits.maxPerMinute;
      } else if (timeWindow === 'hour') {
        if ('maxPerHour' in limits) {
          maxActions = limits.maxPerHour;
        } else if ('maxPerMinute' in limits) {
          // If only minute limit exists, scale it up for hour
          maxActions = limits.maxPerMinute * 60;
        }
      } else if (timeWindow === 'day') {
        if ('maxPerDay' in limits) {
          maxActions = limits.maxPerDay;
        } else if ('maxPerHour' in limits) {
          // If only hour limit exists, scale it up for day
          maxActions = limits.maxPerHour * 24;
        } else if ('maxPerMinute' in limits) {
          // If only minute limit exists, scale it up for day
          maxActions = limits.maxPerMinute * 60 * 24;
        }
      }
      
      if (recentEntries.length >= maxActions) {
        const oldestEntry = Math.min(...recentEntries);
        const resetTime = oldestEntry + timeWindowMs;
        
        return {
          allowed: false,
          error: `Rate limit exceeded. Try again in ${Math.ceil((resetTime - Date.now()) / 1000)} seconds.`,
          resetTime
        };
      }
      
      // Add current timestamp
      recentEntries.push(this.getTimestamp());
      localStorage.setItem(key, JSON.stringify(recentEntries));
      
      return { allowed: true };
    } catch (error) {
      // If localStorage fails, allow action but log error
      console.warn('Rate limiter error:', error);
      return { allowed: true };
    }
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Secure error handler that prevents data leakage
 */
export function sanitizeError(error: any): string {
  if (!error) return 'An unknown error occurred';
  
  // Never expose sensitive error details to users
  const safeErrors: Record<string, string> = {
    'JWT expired': 'Your session has expired. Please log in again.',
    'Invalid JWT': 'Authentication error. Please log in again.',
    'Row Level Security': 'You do not have permission to perform this action.',
    'duplicate key': 'This item already exists.',
    'foreign key': 'Referenced item not found.',
    'check constraint': 'Invalid data provided.',
    'not null': 'Required field is missing.',
    'permission denied': 'Access denied.'
  };
  
  const errorMessage = typeof error === 'string' ? error : 
                      error.message || error.error_description || 'Unknown error';
  
  // Check for known safe error patterns
  for (const [pattern, safeMessage] of Object.entries(safeErrors)) {
    if (errorMessage.toLowerCase().includes(pattern.toLowerCase())) {
      return safeMessage;
    }
  }
  
  // Generic safe error message for unknown errors
  return 'Something went wrong. Please try again later.';
}

/**
 * Validate environment variables at runtime
 */
export function validateEnvironment(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  const requiredEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];
  
  for (const envVar of requiredEnvVars) {
    const value = import.meta.env[envVar];
    if (!value) {
      errors.push(`Missing required environment variable: ${envVar}`);
      continue;
    }
    
    // Validate Supabase URL format
    if (envVar === 'VITE_SUPABASE_URL' && !value.match(/^https:\/\/[a-zA-Z0-9-]+\.supabase\.co$/)) {
      errors.push('Invalid Supabase URL format');
    }
    
    // Validate anon key format (basic check)
    if (envVar === 'VITE_SUPABASE_ANON_KEY' && !value.startsWith('eyJ')) {
      errors.push('Invalid Supabase anon key format');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Content Security Policy headers for additional protection
 */
export const CSP_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'", // Needed for React
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://*.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),
  
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
} as const;