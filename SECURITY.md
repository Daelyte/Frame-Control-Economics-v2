# 🔒 Security Implementation with Arcjet

Frame Economics is protected by **Arcjet**, providing comprehensive security against bots, attacks, and abuse.

## 🛡️ Security Features

### **Multi-Layer Protection**
- **Shield Protection**: Blocks SQL injection, XSS, CSRF, and other common attacks
- **Bot Detection**: Identifies and blocks malicious bots while allowing search engines
- **Rate Limiting**: Prevents abuse with configurable request limits
- **Content Filtering**: Validates and sanitizes user input
- **Security Headers**: Enhanced browser security policies

### **Arcjet Rules Applied**
```javascript
rules: [
  shield({ mode: "LIVE" }),                    // Block common attacks
  detectBot({ 
    mode: "LIVE", 
    allow: ["CATEGORY:SEARCH_ENGINE"] 
  }),                                         // Block bots except search engines
  rateLimit({
    mode: "LIVE",
    characteristics: ["ip"],
    window: "1m",
    max: 60                                   // 60 requests per minute per IP
  })
]
```

## 🔧 Setup Instructions

### 1. **Get Your Arcjet API Key**
1. Visit [app.arcjet.com](https://app.arcjet.com)
2. Create an account or sign in
3. Create a new site/project
4. Copy your API key

### 2. **Configure Environment Variables**
Add your Arcjet key to Netlify environment variables:

**In Netlify Dashboard:**
- Go to Site Settings → Environment Variables
- Add: `ARCJET_KEY` = `your_arcjet_api_key_here`

**For Local Development:**
Create `.env.local`:
```bash
ARCJET_KEY=your_arcjet_api_key_here
```

### 3. **Deploy to Netlify**
The functions are automatically deployed with your site. No additional configuration needed!

## 📡 Protected Endpoints

### **Analytics API** (`/api/analytics`)
- **GET**: Service information
- **POST**: Record analytics events
- **Protected by**: Shield, Bot detection, Rate limiting
- **Rate Limit**: 60 requests/minute per IP

**Supported Events:**
- `rule_completed` - User masters a rule
- `section_viewed` - User visits a section
- `progress_tracked` - Progress milestone
- `guide_printed` - User prints guide

### **Feedback API** (`/api/feedback`)
- **POST**: Submit user feedback
- **Protected by**: Shield, Bot detection, Rate limiting, Content filtering
- **Rate Limit**: 60 requests/minute per IP

**Feedback Types:**
- `bug` - Bug reports
- `feature` - Feature requests  
- `improvement` - Suggestions
- `general` - General feedback
- `testimonial` - User testimonials

## 💻 Client-Side Integration

### **Import the API utilities:**
```typescript
import { analytics, feedback, handleApiError } from './utils/api';
```

### **Track Analytics:**
```typescript
// Track rule completion
analytics.trackRuleCompleted(1);

// Track section views
analytics.trackSectionViewed('introduction');

// Track progress
analytics.trackProgress(5, 10); // 5 of 10 rules completed
```

### **Submit Feedback:**
```typescript
// Report a bug
const result = await feedback.reportBug('Found an issue with rule 3');

if (!result.success) {
  const errorMessage = handleApiError(result);
  console.error(errorMessage);
}
```

### **Handle Security Blocks:**
The client automatically handles Arcjet blocks:
```typescript
const result = await analytics.trackRuleCompleted(1);

if (result.blocked) {
  switch (result.reason) {
    case 'bot':
      // Show bot detection message
      break;
    case 'rate-limit': 
      // Show rate limit message
      break;
    case 'shield':
      // Show security policy message
      break;
  }
}
```

## 🚨 Security Responses

### **Bot Detection (403)**
```json
{
  "error": "Access denied",
  "message": "Automated requests are not allowed", 
  "blocked": true,
  "reason": "bot"
}
```

### **Rate Limiting (429)**
```json
{
  "error": "Too many requests",
  "message": "Please wait before making another request",
  "blocked": true, 
  "reason": "rate-limit"
}
```

### **Shield Protection (403)**
```json
{
  "error": "Request blocked",
  "message": "Security policy violation detected",
  "blocked": true,
  "reason": "shield"
}
```

## 📊 Monitoring & Logs

### **Netlify Function Logs**
View real-time security events in:
- Netlify Dashboard → Functions → View logs
- Shows blocked requests, reasons, and IP addresses

### **Arcjet Dashboard**
Monitor security events at [app.arcjet.com](https://app.arcjet.com):
- Real-time attack detection
- Bot traffic analysis  
- Rate limiting stats
- Detailed request logs

## 🔧 Configuration Options

### **Adjust Rate Limits**
In `netlify/functions/arcjet-config.js`:
```javascript
rateLimit({
  mode: "LIVE",
  characteristics: ["ip"], 
  window: "1m",           // Time window
  max: 60                 // Max requests
})
```

### **Bot Detection Settings**
```javascript
detectBot({
  mode: "LIVE",
  allow: [
    "CATEGORY:SEARCH_ENGINE",  // Google, Bing, etc.
    "CATEGORY:MONITOR",        // Uptime monitors
    // Add specific bots: "GOOGLE_BOT", "BING_BOT"
  ]
})
```

### **Shield Sensitivity**
```javascript
shield({
  mode: "LIVE",        // or "DRY_RUN" for logging only
  // Additional shield configuration options available
})
```

## 🧪 Testing Security

### **Test Rate Limiting**
```bash
# Make rapid requests (will be blocked after 60/minute)
for i in {1..65}; do
  curl -X POST https://yoursite.netlify.app/api/analytics \\
    -H "Content-Type: application/json" \\
    -d '{"event":"test","data":{}}' 
done
```

### **Test Bot Detection**
```bash
# Request with bot user agent (will be blocked)
curl -X GET https://yoursite.netlify.app/api/analytics \\
  -H "User-Agent: BadBot/1.0"
```

### **Test Shield Protection**
```bash
# Request with malicious payload (will be blocked)  
curl -X POST https://yoursite.netlify.app/api/feedback \\
  -H "Content-Type: application/json" \\
  -d '{"type":"bug","message":"<script>alert(1)</script>"}'
```

## 🔐 Security Best Practices

### **Environment Variables**
- Never commit API keys to version control
- Use different keys for development/production
- Rotate keys regularly

### **Content Validation**
- All user input is validated server-side
- XSS prevention through content filtering
- Length limits on all text fields

### **Rate Limiting Strategy**
- Different limits for different endpoints
- IP-based limiting prevents individual abuse
- Graceful degradation when limits hit

### **Monitoring**
- Regular review of Arcjet dashboard
- Alert on unusual traffic patterns
- Log analysis for attack trends

## 🚀 Deployment Checklist

- [ ] Arcjet API key configured in Netlify
- [ ] Functions directory set in `netlify.toml`
- [ ] Security headers configured
- [ ] Client-side error handling implemented
- [ ] Rate limits tested and appropriate
- [ ] Bot detection rules reviewed
- [ ] Shield protection tested

## 📞 Support & Troubleshooting

### **Common Issues**

**Functions not deploying:**
- Check `netlify.toml` has `functions = "netlify/functions"`
- Verify function files are in correct directory
- Check build logs for errors

**API key not working:**
- Verify key is correct in Netlify environment variables
- Check key hasn't been rotated in Arcjet dashboard
- Ensure key has proper permissions

**Too many false positives:**
- Switch rules to `"DRY_RUN"` mode temporarily
- Review Arcjet logs for pattern analysis
- Adjust bot detection allow list

### **Resources**
- [Arcjet Documentation](https://docs.arcjet.com)
- [Netlify Functions Guide](https://docs.netlify.com/functions/overview/)
- [Frame Economics GitHub Issues](https://github.com/Daelyte/frame-economics/issues)

---

**Security is not just about blocking bad actors—it's about creating a trusted environment where users can focus on learning without worry.** 🛡️✨