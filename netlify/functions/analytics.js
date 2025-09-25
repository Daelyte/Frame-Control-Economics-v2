// Protected analytics endpoint for Frame Economics
import { aj, handleArcjetDecision } from "./arcjet-config.js";

export const handler = async (event, context) => {
  // Apply Arcjet protection
  const decision = await aj.protect(event, {
    ip: event.headers["x-forwarded-for"] || event.headers["client-ip"],
    method: event.httpMethod,
    protocol: "http",
    host: event.headers.host,
    path: event.path,
    headers: event.headers,
    // Add user agent for bot detection
    "user-agent": event.headers["user-agent"],
  });

  // Handle blocked requests
  const blockResponse = handleArcjetDecision(decision, event, context);
  if (blockResponse) {
    return blockResponse;
  }

  // Handle different HTTP methods
  switch (event.httpMethod) {
    case "POST":
      return handleAnalyticsPost(event, context);
    case "GET":
      return handleAnalyticsGet(event, context);
    default:
      return {
        statusCode: 405,
        headers: {
          "Content-Type": "application/json",
          "Allow": "GET, POST",
        },
        body: JSON.stringify({
          error: "Method not allowed",
          message: `${event.httpMethod} is not supported`,
        }),
      };
  }
};

async function handleAnalyticsPost(event, context) {
  try {
    const body = JSON.parse(event.body || "{}");
    
    // Validate the analytics data
    const validEvents = ["rule_completed", "section_viewed", "progress_tracked", "guide_printed"];
    if (!body.event || !validEvents.includes(body.event)) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Invalid event",
          message: "Event type must be one of: " + validEvents.join(", "),
        }),
      };
    }

    // Log analytics (in production, you'd save to a database)
    console.log("Analytics event received:", {
      event: body.event,
      data: body.data,
      timestamp: new Date().toISOString(),
      ip: event.headers["x-forwarded-for"] || "unknown",
      userAgent: event.headers["user-agent"],
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({
        success: true,
        message: "Analytics event recorded",
        eventId: generateEventId(),
      }),
    };
  } catch (error) {
    console.error("Analytics error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Internal server error",
        message: "Failed to process analytics event",
      }),
    };
  }
}

async function handleAnalyticsGet(event, context) {
  // Return basic analytics info (you could expand this)
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      service: "Frame Economics Analytics",
      version: "1.0.0",
      protected: true,
      endpoints: {
        POST: "Record analytics events",
        GET: "Service information",
      },
      supportedEvents: ["rule_completed", "section_viewed", "progress_tracked", "guide_printed"],
    }),
  };
}

function generateEventId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}