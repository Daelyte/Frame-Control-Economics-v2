// Arcjet configuration for Frame Economics
const arcjet = require("@arcjet/node").default;
const { shield, detectBot, rateLimit } = require("@arcjet/node");

const aj = arcjet({
  // ARCJET_KEY automatically set by the Netlify integration
  // Log in at https://app.arcjet.com to get your key
  key: process.env.ARCJET_KEY,
  rules: [
    // Block common attacks e.g. SQL injection, XSS, CSRF
    shield({
      // Use DRY_RUN for development, LIVE for production
      mode: process.env.NODE_ENV === "production" ? "LIVE" : "DRY_RUN",
    }),
    // Detect bots
    detectBot({
      // Use DRY_RUN for development to allow testing tools
      mode: process.env.NODE_ENV === "production" ? "LIVE" : "DRY_RUN",
      // Allow search engines, legitimate tools, and development access
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "CATEGORY:PREVIEW",
        "CATEGORY:MONITOR",
        // Allow specific user agents for development
        "curl",
        "Postman",
        "Insomnia",
        "HTTPie",
      ],
    }),
    // Rate limiting for API endpoints - more generous for development
    rateLimit({
      mode: process.env.NODE_ENV === "production" ? "LIVE" : "DRY_RUN",
      characteristics: ["ip"],
      window: "1m",
      max: process.env.NODE_ENV === "production" ? 60 : 200, // Higher limit for dev
    }),
  ],
});

// Developer allowlist - IPs that should bypass all restrictions
const DEVELOPER_ALLOWLIST = [
  '127.0.0.1',
  'localhost',
  // Add your IP addresses here for development
  // '192.168.1.100', // Example: your local IP
  // '10.0.0.50',     // Example: VPN IP
];

// Check if request is from an allowed developer IP
const isDeveloperRequest = (event) => {
  const ip = event.headers["x-forwarded-for"] || event.headers["client-ip"] || event.headers["x-real-ip"];
  const userAgent = event.headers["user-agent"] || '';
  
  // Allow local development
  if (ip && DEVELOPER_ALLOWLIST.some(allowedIp => ip.includes(allowedIp))) {
    return true;
  }
  
  // Allow development tools and browsers in non-production
  if (process.env.NODE_ENV !== "production") {
    const devUserAgents = [
      'chrome', 'firefox', 'safari', 'edge',
      'curl', 'postman', 'insomnia', 'httpie',
      'vscode', 'axios', 'fetch'
    ];
    
    if (devUserAgents.some(agent => userAgent.toLowerCase().includes(agent))) {
      return true;
    }
  }
  
  return false;
};

// Helper function to handle Arcjet decisions
const handleArcjetDecision = (decision, event, context) => {
  // Skip Arcjet checks for developer requests
  if (isDeveloperRequest(event)) {
    console.log('Developer request detected - bypassing Arcjet protection', {
      ip: event.headers["x-forwarded-for"] || event.headers["client-ip"],
      userAgent: event.headers["user-agent"],
    });
    return null; // Allow the request
  }
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

module.exports = {
  aj,
  isDeveloperRequest,
  handleArcjetDecision
};
