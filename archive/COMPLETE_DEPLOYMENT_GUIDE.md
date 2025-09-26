# 🚀 Frame Economics Complete Deployment Guide

This guide covers everything needed to deploy the Frame Economics community platform with database, Edge Functions, OAuth, and production setup.

---

## ✅ **Part 1: Database Setup (2 minutes)**

### **Step 1: Run SQL Schema**

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard/projects
2. **Select project**: `incldnepzwdrodznroat`
3. **Navigate to**: SQL Editor
4. **Click**: "New Query"
5. **Copy entire contents** of `frame-economics-complete.sql`
6. **Paste and click**: "RUN"

**Expected result**: Success message "Frame Economics database schema setup complete! 🎉"

### **What this creates:**
- ✅ `profiles` table (extends auth.users)
- ✅ `stories` table (community posts with categories)
- ✅ `comments` table (threaded replies)
- ✅ `likes` table (story/comment likes)
- ✅ `flags` table (content moderation)
- ✅ `bans` table (admin user management)
- ✅ `rate_limit_events` table (abuse prevention)
- ✅ All RLS policies and security measures
- ✅ Database functions for rate limiting
- ✅ Auto-profile creation triggers
- ✅ Sample data for testing

---

## 🔐 **Part 2: OAuth Provider Setup (5 minutes)**

### **GitHub OAuth Setup**

1. **Go to GitHub**: Settings → Developer settings → OAuth Apps
2. **Click**: "New OAuth App"
3. **Fill in**:
   - **Application name**: `Frame Economics Community`
   - **Homepage URL**: `https://icecoldfroste.com`
   - **Authorization callback URL**: `https://incldnepzwdrodznroat.supabase.co/auth/v1/callback`
4. **Copy Client ID and Client Secret**

5. **In Supabase Dashboard**: Authentication → Providers
6. **Enable GitHub provider**
7. **Paste Client ID and Client Secret**
8. **Save**

### **Google OAuth Setup**

1. **Go to Google Cloud Console**: https://console.cloud.google.com
2. **Create or select project**
3. **APIs & Services → Credentials**
4. **Create OAuth 2.0 Client ID**
5. **Configure**:
   - **Application type**: Web application
   - **Authorized redirect URIs**: `https://incldnepzwdrodznroat.supabase.co/auth/v1/callback`
6. **Copy Client ID and Client Secret**

7. **In Supabase Dashboard**: Authentication → Providers
8. **Enable Google provider**
9. **Paste Client ID and Client Secret**
10. **Save**

---

## 🏠 **Part 3: Local Development Setup**

### **Environment Variables**

Your `.env.local` is already configured:
```bash
VITE_SUPABASE_URL=https://incldnepzwdrodznroat.supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]
```

### **Test Local Development**

```bash
npm run dev
```

**Expected results:**
- ✅ Site loads without errors
- ✅ Community tab shows sample stories
- ✅ Authentication works (if OAuth configured)
- ✅ Can create stories/comments when logged in
- ✅ Rate limiting enforces limits

---

## ⚡ **Part 4: Edge Functions Setup (Optional - 10 minutes)**

Edge Functions provide AI-powered moderation and thread summarization.

### **Prerequisites**
- Install Supabase CLI: https://supabase.com/docs/guides/cli
- OpenAI API key (optional, for AI features)

### **Deploy Edge Functions**

1. **Initialize Supabase in your project** (if not already done):
```bash
supabase init
```

2. **Login to Supabase**:
```bash
supabase login
```

3. **Link to your project**:
```bash
supabase link --project-ref incldnepzwdrodznroat
```

4. **Set secrets** (optional for AI features):
```bash
supabase secrets set OPENAI_API_KEY=your_openai_api_key_here
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

5. **Deploy functions**:
```bash
supabase functions deploy moderate-content
supabase functions deploy summarize-thread
```

### **Test Edge Functions**

**Test moderation** (POST to `/functions/v1/moderate-content`):
```json
{
  "content": "This is test content",
  "type": "story",
  "id": 1
}
```

**Test summarization** (POST to `/functions/v1/summarize-thread`):
```json
{
  "story_id": 1,
  "max_length": 200
}
```

---

## 🌐 **Part 5: Production Deployment**

### **Netlify Environment Variables**

1. **Go to Netlify Dashboard**: Your site → Site Settings → Environment Variables
2. **Add these variables**:
   - `VITE_SUPABASE_URL` = `https://incldnepzwdrodznroat.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `[your-anon-key-from-supabase]`

### **Deploy to Production**

```bash
# Build locally first to test
npm run build

# Commit and push
git add .
git commit -m "🚀 Complete community platform with database and Edge Functions"
git push origin main
```

Netlify will automatically deploy from your Git repository.

---

## 🧪 **Part 6: Testing Checklist**

### **Database Testing**
- [ ] Tables exist in Supabase Table Editor
- [ ] Sample data visible (stories, comments, profiles)
- [ ] RLS policies prevent unauthorized access

### **Guest User Testing** (not logged in)
- [ ] Can view stories and comments
- [ ] Cannot create stories or comments
- [ ] Cannot like content
- [ ] Proper authentication prompts

### **Authenticated User Testing** (logged in)
- [ ] Can create stories (respects rate limits)
- [ ] Can comment on stories
- [ ] Can like/unlike stories and comments
- [ ] Can edit/delete own content only
- [ ] Profile auto-created on first login

### **Rate Limiting Testing**
- [ ] Story creation blocked after 5 per hour
- [ ] Comment creation blocked after 20 per hour
- [ ] Proper error messages displayed

### **Security Testing**
- [ ] Cannot access other users' data
- [ ] RLS policies enforced
- [ ] Input sanitization working
- [ ] Error messages don't leak sensitive data

### **Edge Functions Testing** (if deployed)
- [ ] Moderation function flags inappropriate content
- [ ] Summarization function generates summaries
- [ ] Functions handle errors gracefully

---

## 📊 **Part 7: Admin Features**

### **Content Moderation**
```sql
-- View flagged content
SELECT * FROM public.flags 
ORDER BY created_at DESC;

-- Ban a user
INSERT INTO public.bans (user_id, banned_until, reason)
VALUES ('user-uuid-here', '2024-01-01'::timestamp, 'Spam');
```

### **Analytics Queries**
```sql
-- Community stats
SELECT 
  (SELECT COUNT(*) FROM auth.users) as total_users,
  (SELECT COUNT(*) FROM public.stories) as total_stories,
  (SELECT COUNT(*) FROM public.comments) as total_comments,
  (SELECT COUNT(*) FROM public.likes) as total_likes;

-- Most popular stories
SELECT s.title, s.category, COUNT(l.id) as like_count
FROM public.stories s
LEFT JOIN public.likes l ON s.id = l.story_id
GROUP BY s.id, s.title, s.category
ORDER BY like_count DESC
LIMIT 10;
```

---

## 🔧 **Part 8: Advanced Configuration**

### **Rate Limit Customization**

Edit the database functions to adjust rate limits:
```sql
-- 5 stories per hour (current default)
SELECT public.check_rate_limit(user_id, 'story_create', 5, interval '1 hour');

-- 20 comments per hour (current default) 
SELECT public.check_rate_limit(user_id, 'comment_create', 20, interval '1 hour');
```

### **Content Categories**

Current categories: `success`, `challenge`, `insight`, `question`

To add new categories, update the SQL schema:
```sql
ALTER TABLE public.stories DROP CONSTRAINT stories_category_check;
ALTER TABLE public.stories ADD CONSTRAINT stories_category_check 
CHECK (category IN ('success', 'challenge', 'insight', 'question', 'new_category'));
```

### **Moderation Settings**

Configure automatic moderation in Edge Functions by adjusting spam patterns and AI thresholds.

---

## 🚨 **Troubleshooting**

### **Common Issues:**

**"Failed to fetch" errors:**
- Verify Supabase URL and anon key are correct
- Check that RLS policies allow the operation
- Ensure user is authenticated for protected actions

**Rate limiting not working:**
- Verify `rate_limit_events` table exists
- Check database function permissions
- Ensure user is authenticated

**OAuth not working:**
- Verify callback URLs match exactly
- Check provider configuration in Supabase
- Ensure client ID and secret are correct

**Edge Functions failing:**
- Check function logs in Supabase dashboard
- Verify environment secrets are set
- Ensure proper CORS headers

### **Database Issues:**

**Sample data not showing:**
- UUIDs in sample data won't match real auth.users
- Either remove sample data section or replace with real user IDs
- Create test users through authentication flow

---

## 🎉 **Success! Your Frame Economics Community Platform is Live**

### **What You Have:**
- ✅ **Secure Authentication**: OAuth with GitHub/Google
- ✅ **Community Features**: Stories, comments, likes, profiles
- ✅ **Content Moderation**: Admin tools and automatic flagging
- ✅ **Rate Limiting**: Abuse prevention built-in
- ✅ **AI Features**: Content moderation and summarization (optional)
- ✅ **Production Ready**: Deployed on Netlify with proper security

### **User Experience:**
- Users can join with social login
- Share Frame Economics experiences in organized categories
- Engage through likes and threaded discussions
- Build profiles and reputation within the community
- Automatic protection against spam and abuse

### **Admin Control:**
- Flag and ban users as needed
- View community analytics
- Moderate content through database queries
- Monitor rate limiting and security events

**🌟 Your Frame Economics community platform is now enterprise-ready and ready to scale!**