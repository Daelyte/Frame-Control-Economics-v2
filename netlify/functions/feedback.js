// Protected feedback endpoint for Frame Economics
const { aj, handleArcjetDecision, isDeveloperRequest } = require("./arcjet-config.js");

const handler = async (event, context) => {
  // Skip Arcjet for developer requests
  if (!isDeveloperRequest(event)) {
    // Apply Arcjet protection with stricter rate limiting for feedback
    const decision = await aj.protect(event, {
      ip: event.headers["x-forwarded-for"] || event.headers["client-ip"],
      method: event.httpMethod,
      protocol: "http",
      host: event.headers.host,
      path: event.path,
      headers: event.headers,
      "user-agent": event.headers["user-agent"],
    });

    // Handle blocked requests
    const blockResponse = handleArcjetDecision(decision, event, context);
    if (blockResponse) {
      return blockResponse;
    }
  }

  // Only allow POST for feedback submission
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json",
        "Allow": "POST",
      },
      body: JSON.stringify({
        error: "Method not allowed",
        message: "Only POST requests are allowed for feedback submission",
      }),
    };
  }

  return handleFeedbackSubmission(event, context);
};

async function handleFeedbackSubmission(event, context) {
  try {
    const body = JSON.parse(event.body || "{}");
    
    // Validate required fields
    const requiredFields = ["type", "message"];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Missing required fields",
          message: "Required fields: " + missingFields.join(", "),
        }),
      };
    }

    // Validate feedback type
    const validTypes = ["bug", "feature", "improvement", "general", "testimonial"];
    if (!validTypes.includes(body.type)) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Invalid feedback type",
          message: "Type must be one of: " + validTypes.join(", "),
        }),
      };
    }

    // Validate message length
    if (body.message.length < 10 || body.message.length > 2000) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Invalid message length",
          message: "Message must be between 10 and 2000 characters",
        }),
      };
    }

    // Basic content filtering (you could use more sophisticated filtering)
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /data:text\/html/i,
    ];

    const containsSuspiciousContent = suspiciousPatterns.some(pattern => 
      pattern.test(body.message) || (body.email && pattern.test(body.email))
    );

    if (containsSuspiciousContent) {
      console.log("Suspicious content detected in feedback", {
        ip: event.headers["x-forwarded-for"] || "unknown",
        userAgent: event.headers["user-agent"],
        type: body.type,
      });

      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Content rejected",
          message: "Feedback contains invalid content",
        }),
      };
    }

    // Process the feedback (in production, save to database/send email)
    const feedbackId = generateFeedbackId();
    
    console.log("Feedback submitted:", {
      id: feedbackId,
      type: body.type,
      message: body.message.substring(0, 100) + "...", // Log first 100 chars
      email: body.email ? "provided" : "not provided",
      timestamp: new Date().toISOString(),
      ip: event.headers["x-forwarded-for"] || "unknown",
      userAgent: event.headers["user-agent"],
    });

    // In production, you might:
    // - Save to a database
    // - Send to Slack/Discord webhook
    // - Email to support team
    // - Create GitHub issue for bugs/features

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({
        success: true,
        message: "Thank you for your feedback! We'll review it shortly.",
        feedbackId: feedbackId,
        estimatedReviewTime: "2-3 business days",
      }),
    };
  } catch (error) {
    console.error("Feedback processing error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Internal server error",
        message: "Failed to process feedback. Please try again later.",
      }),
    };
  }
}

function generateFeedbackId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 8);
  return `fb_${timestamp}_${random}`;
}

module.exports = { handler };
