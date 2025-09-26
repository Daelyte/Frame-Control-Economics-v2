# Fix API Key Issue

## 🔧 Quick Fix Required

I've opened your Supabase API Keys page for you. You need to copy the correct anon key to your `.env.local` file.

### Steps:

1. **Get the Real API Key** (page is open):
   - Go to: https://supabase.com/dashboard/project/incldnepzwdrodznroat/settings/api
   - Copy the **anon** key (starts with `eyJhbG...`)
   - Copy the **service_role** key as well

2. **Update .env.local**:
   - Open your `.env.local` file
   - Replace the `VITE_SUPABASE_ANON_KEY` with the real anon key
   - Replace the `SUPABASE_SERVICE_ROLE_KEY` with the real service role key

3. **Test Again**:
   ```bash
   node test-supabase-connection.js
   ```

### Expected .env.local format:

```env
# Frame Economics Environment Configuration

# Node environment (development/production)
NODE_ENV=development

# Arcjet API Key (get from https://app.arcjet.com)
ARCJET_KEY=your_arcjet_key_here

# Development settings
ARCJET_MODE=DRY_RUN

# Supabase Configuration (for community features)
VITE_SUPABASE_URL=https://incldnepzwdrodznroat.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluY2xkbmVwend3ZHJvZHpucm9hdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzI3MjY4NDM4LCJleHAiOjIwNDI4NDQ0Mzh9.REAL_KEY_GOES_HERE

# Server-side only (for Edge Functions)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluY2xkbmVwend3ZHJvZHpucm9hdCIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE3MjcyNjg0MzgsImV4cCI6MjA0Mjg0NDQzOH0.REAL_KEY_GOES_HERE

# Optional: OpenAI API Key for AI-powered moderation and summarization
# OPENAI_API_KEY=your_openai_key_here

# Optional: Admin configuration
# ADMIN_EMAIL=your-email@example.com
```

Once you update the keys, run the test again and it should work!