// Arcjet configuration for Frame Economics
import arcjet, { shield, detectBot, rateLimit } from "@arcjet/node";

export const aj = arcjet({
  // ARCJET_KEY automatically set by the Netlify integration
  // Log in at https://app.arcjet.com to get your key
  key: process.env.ARCJET_KEY,
  rules: [
    // Block common attacks e.g. SQL injection, XSS, CSRF
    shield({
      // Will block requests. Use "DRY_RUN" to log only
      mode: "LIVE",
    }),
    // Detect bots
    detectBot({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      // Block all bots except search engine crawlers. See the full list of bots
      // for other options: https://arcjet.com/bot-list
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
    // Rate limiting for API endpoints
    rateLimit({
      mode: "LIVE",
      characteristics: ["ip"],
      window: "1m",
      max: 60, // 60 requests per minute
    }),
  ],
});

// Helper function to handle Arcjet decisions
export const handleArcjetDecision = (decision, event, context) => {
  if (decision.isDenied()) {
    const reason = decision.reason;
    
    if (reason.isBot()) {
      console.log("Request blocked: Bot detected", {
        ip: event.headers["x-forwarded-for"] || event.headers["client-ip"],
        userAgent: event.headers["user-agent"],
        botDetails: reason.results,
      });
      
      return {
        statusCode: 403,
        headers: {
          "Content-Type": "application/json",
          "X-Blocked-Reason": "Bot detected",
        },
        body: JSON.stringify({
          error: "Access denied",
          message: "Automated requests are not allowed",
          blocked: true,
          reason: "bot",
        }),
      };
    }

    if (reason.isRateLimit()) {
      console.log("Request blocked: Rate limit exceeded", {
        ip: event.headers["x-forwarded-for"] || event.headers["client-ip"],
        rateLimit: reason.results,
      });
      
      return {
        statusCode: 429,
        headers: {
          "Content-Type": "application/json",
          "X-Blocked-Reason": "Rate limit exceeded",
          "Retry-After": "60",
        },
        body: JSON.stringify({
          error: "Too many requests",
          message: "Please wait before making another request",
          blocked: true,
          reason: "rate-limit",
        }),
      };
    }

    if (reason.isShield()) {
      console.log("Request blocked: Security shield", {
        ip: event.headers["x-forwarded-for"] || event.headers["client-ip"],
        userAgent: event.headers["user-agent"],
        shieldResults: reason.results,
      });
      
      return {
        statusCode: 403,
        headers: {
          "Content-Type": "application/json",
          "X-Blocked-Reason": "Security violation",
        },
        body: JSON.stringify({
          error: "Request blocked",
          message: "Security policy violation detected",
          blocked: true,
          reason: "shield",
        }),
      };
    }
  }
  
  return null; // Allow the request to continue
};