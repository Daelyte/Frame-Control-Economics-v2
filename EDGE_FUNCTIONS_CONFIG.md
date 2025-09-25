# Edge Functions Configuration Guide

## 🔧 Environment Variables Setup

### Required Environment Variables for Edge Functions

Your Edge Functions (`moderate-content` and `summarize-thread`) need these environment variables to work with OpenAI:

1. **OPENAI_API_KEY** - For content moderation and thread summarization
2. **SUPABASE_URL** - Automatically provided
3. **SUPABASE_SERVICE_ROLE_KEY** - Automatically provided

### Method 1: Configure via Supabase Dashboard (Recommended)

**I've opened your Supabase Functions page. Follow these steps:**

1. Go to: https://supabase.com/dashboard/project/incldnepzwdrodznroat/functions
2. Click on **Environment Variables** or **Settings**
3. Add the following environment variables:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: `your-openai-api-key-here` (get from https://platform.openai.com/api-keys)
4. Click **Save**

### Method 2: Configure via CLI (Alternative)

If you prefer using the CLI, you can set secrets with:

```bash
# Set OpenAI API key
supabase secrets set OPENAI_API_KEY=your-openai-api-key-here

# Verify secrets are set
supabase secrets list
```

### Getting Your OpenAI API Key

1. Go to: https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key (it starts with `sk-`)
4. Keep it secure - treat it like a password

### 🔒 Edge Functions Environment Variables

Your deployed Edge Functions will automatically have access to:

- `SUPABASE_URL` - Your project URL
- `SUPABASE_SERVICE_ROLE_KEY` - For database operations
- `OPENAI_API_KEY` - For AI features (once you add it)

### 🧪 Testing Edge Functions

After configuring the environment variables, you can test your functions:

1. **Test Moderation Function**:
   ```bash
   curl -X POST https://incldnepzwdrodznroat.supabase.co/functions/v1/moderate-content \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     -H "Content-Type: application/json" \
     -d '{"content":"Test content","type":"story","id":1}'
   ```

2. **Test Summarization Function**:
   ```bash
   curl -X POST https://incldnepzwdrodznroat.supabase.co/functions/v1/summarize-thread \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     -H "Content-Type: application/json" \
     -d '{"story_id":1,"max_length":200}'
   ```

### 📊 Function Status

Your deployed Edge Functions:
- ✅ **moderate-content** - AI-powered content moderation
- ✅ **summarize-thread** - Thread summarization with OpenAI

Both functions are deployed and ready to use once you configure the OpenAI API key!

### 💰 OpenAI Usage Notes

- The functions use OpenAI's moderation API (free) and GPT-3.5-turbo for summaries
- Monitor usage in your OpenAI dashboard
- Set usage limits if needed
- Functions will gracefully fall back if OpenAI is unavailable

### 🔄 Redeployment

If you make changes to environment variables, the functions will automatically use the new values. No redeployment needed for environment variable changes!