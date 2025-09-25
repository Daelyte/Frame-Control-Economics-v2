# 🚀 Supabase Setup Guide for Frame Economics Community Platform

Follow these steps to set up your Supabase backend and get the community features working.

---

## ✅ **Step 1: Create Supabase Project**

1. **Go to [supabase.com](https://supabase.com)**
2. **Sign up or log in** with your GitHub account
3. **Click "New Project"**
4. **Fill in project details:**
   - **Name**: `frame-economics-community`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your location
   - **Pricing Plan**: Start with Free tier

5. **Wait for project creation** (takes 1-2 minutes)

---

## ✅ **Step 2: Get Your Project Credentials**

Once your project is ready:

1. **Go to Settings → API** in your Supabase dashboard
2. **Copy these values:**
   - **Project URL** (starts with `https://xxx.supabase.co`)
   - **Anon Key** (public key, starts with `eyJhb...`)

---

## ✅ **Step 3: Set Up Local Environment**

1. **Create `.env.local` file** in your project root:
```bash
cp .env.example .env.local
```

2. **Edit `.env.local`** with your Supabase credentials:
```bash
# Replace with your actual Supabase values
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key

# Keep existing Arcjet settings
ARCJET_KEY=your_arcjet_key_here
ARCJET_MODE=DRY_RUN
```

---

## ✅ **Step 4: Create Database Schema**

1. **In your Supabase dashboard, go to SQL Editor**
2. **Click "New Query"**
3. **Copy and paste the entire contents** of `supabase-schema.sql`
4. **Click "RUN"** to execute the script

This will create:
- ✅ User profiles table
- ✅ Stories table  
- ✅ Comments table
- ✅ Likes table
- ✅ Row Level Security policies
- ✅ Database functions and triggers
- ✅ Sample test data

---

## ✅ **Step 5: Configure Authentication Providers**

### **GitHub OAuth Setup:**

1. **In Supabase Dashboard → Authentication → Providers**
2. **Enable GitHub provider**
3. **You'll need to create a GitHub OAuth App:**
   - Go to **GitHub Settings → Developer settings → OAuth Apps**
   - **New OAuth App**
   - **Application name**: `Frame Economics Community`
   - **Homepage URL**: `https://icecoldfroste.com`
   - **Authorization callback URL**: `https://your-project-id.supabase.co/auth/v1/callback`
   - **Click "Register application"**
   - **Copy Client ID and Client Secret to Supabase**

### **Google OAuth Setup:**

1. **In Supabase Dashboard → Authentication → Providers**
2. **Enable Google provider**
3. **You'll need to create a Google OAuth App:**
   - Go to **[Google Cloud Console](https://console.cloud.google.com)**
   - **Create new project** or select existing
   - **APIs & Services → Credentials**
   - **Create OAuth 2.0 Client ID**
   - **Authorized redirect URIs**: `https://your-project-id.supabase.co/auth/v1/callback`
   - **Copy Client ID and Client Secret to Supabase**

---

## ✅ **Step 6: Test Local Development**

1. **Start your development server:**
```bash
npm run dev
```

2. **Open http://localhost:5173**
3. **Click "Join Community"**
4. **Try logging in with GitHub or Google**
5. **Test creating a story, liking, commenting**

---

## ✅ **Step 7: Configure Netlify Environment Variables**

1. **Go to Netlify Dashboard → Your Site → Site Settings → Environment Variables**
2. **Add these variables:**
   ```
   VITE_SUPABASE_URL = https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY = your-anon-key-here
   ```
3. **Click "Deploy site"** to redeploy with new environment variables

---

## 🔍 **Verification Steps**

### **Database Check:**
1. **Go to Supabase Dashboard → Table Editor**
2. **You should see tables:** `users`, `stories`, `comments`, `likes`
3. **Sample data should be visible in stories table**

### **Authentication Check:**
1. **Go to Supabase Dashboard → Authentication → Users**
2. **After testing login, you should see users here**

### **Live Site Check:**
1. **Visit [icecoldfroste.com](https://icecoldfroste.com)**
2. **Community features should work:**
   - ✅ Login with GitHub/Google
   - ✅ View sample stories
   - ✅ Create new stories
   - ✅ Like stories
   - ✅ Add comments

---

## 🚨 **Troubleshooting**

### **"Failed to fetch" errors:**
- Check that environment variables are set correctly
- Verify Supabase URL and key are correct
- Make sure RLS policies were created

### **Authentication not working:**
- Check OAuth provider configuration
- Verify callback URLs are correct
- Check Supabase Auth logs

### **Database permissions errors:**
- Make sure all SQL script ran successfully
- Verify RLS policies are enabled
- Check user has proper permissions

### **Local development issues:**
- Restart dev server after adding environment variables
- Check browser console for errors
- Verify .env.local file is not committed to git

---

## 📞 **Need Help?**

If you encounter issues:
1. **Check Supabase logs** in Dashboard → Logs
2. **Check browser console** for error messages
3. **Verify all steps were completed** in order
4. **Test with sample data first** before creating new content

---

**Once everything is working, you'll have a fully functional community platform with real user authentication, story sharing, and engagement features!** 🎉