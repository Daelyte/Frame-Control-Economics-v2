# Database Setup Guide

This guide will help you set up the Supabase database for Frame Economics community features.

## Prerequisites

1. A Supabase account (free tier is sufficient)
2. Node.js 18+ installed
3. Access to your Supabase project dashboard

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in/sign up
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: `frame-economics`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be ready (2-3 minutes)

## Step 2: Configure Authentication

1. In your Supabase dashboard, go to **Authentication > Settings**
2. Under **Auth Providers**, enable:
   - **GitHub**: Add your GitHub OAuth app credentials
   - **Google**: Add your Google OAuth app credentials

### GitHub OAuth Setup
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: `Frame Economics Community`
   - **Homepage URL**: `https://your-domain.com` (or localhost for development)
   - **Authorization callback URL**: `https://your-supabase-project.supabase.co/auth/v1/callback`
4. Copy the **Client ID** and **Client Secret** to Supabase

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials > Create Credentials > OAuth 2.0 Client IDs
5. Fill in:
   - **Application type**: Web application
   - **Authorized redirect URIs**: `https://your-supabase-project.supabase.co/auth/v1/callback`
6. Copy the **Client ID** and **Client Secret** to Supabase

## Step 3: Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `database/schema.sql`
3. Paste it into the SQL Editor
4. Click "Run" to execute the schema

This will create:
- `profiles` table (user profiles)
- `stories` table (community posts)
- `comments` table (threaded comments)
- `likes` table (likes for stories/comments)
- `activity_logs` table (user activity tracking)
- All necessary RLS policies for security
- Triggers for automated counter updates

## Step 4: Environment Variables

1. In Supabase dashboard, go to **Settings > API**
2. Copy your **Project URL** and **anon public key**
3. Create a `.env.local` file in your project root:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 5: Test the Setup

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Navigate to the Community tab
4. Try signing in with GitHub or Google
5. Create a test story to verify everything works

## Database Structure

### Tables Overview

- **profiles**: User information and preferences
- **stories**: Community posts with categories and tags
- **comments**: Threaded comments on stories
- **likes**: User likes for stories and comments
- **activity_logs**: User activity for analytics

### Security

- Row Level Security (RLS) is enabled on all tables
- Users can only edit/delete their own content
- Public read access for community content
- Authenticated users can create content

### Automatic Features

- Like/comment counters are automatically updated via triggers
- User profiles are automatically created on signup
- Updated timestamps are maintained automatically

## Troubleshooting

### Common Issues

1. **Authentication not working**:
   - Check OAuth app settings and callback URLs
   - Verify client IDs and secrets in Supabase
   - Ensure redirect URLs match exactly

2. **Database errors**:
   - Check that the schema was run successfully
   - Verify RLS policies are in place
   - Check browser console for specific error messages

3. **Environment variables not loaded**:
   - Restart the development server after adding .env.local
   - Check that variable names start with `VITE_`
   - Verify the file is named `.env.local` (not `.env`)

### Support

If you encounter issues:

1. Check the browser console for error messages
2. Check the Supabase logs in the dashboard
3. Review the RLS policies in the Table Editor
4. Test API connections in the Supabase dashboard

## Production Deployment

For production deployment:

1. Set environment variables in your hosting platform (Netlify/Vercel)
2. Update OAuth callback URLs to production domains
3. Consider upgrading Supabase plan for higher limits
4. Enable additional security features in Supabase

The community features are now ready to use! Users can sign in, create stories, like and comment on posts, and engage with the Frame Economics learning community.