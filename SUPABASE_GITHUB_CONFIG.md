# Configure GitHub OAuth in Supabase

## Your GitHub OAuth App Details:
- **Client ID**: `Ov23liQP2ujUf5QF9lB1`
- **Client Secret**: `b6eed486256e7868d7bbbf4f47bf3eef6f801cfc`
- **Callback URL**: `https://incldnepzwdrodznroat.supabase.co/auth/v1/callback`

## Steps to Configure in Supabase:

### 1. Open Supabase Dashboard
- Go to your Supabase project dashboard
- Navigate to **Authentication** → **Providers**

### 2. Enable GitHub Provider
- Find **GitHub** in the list of providers
- Toggle it **ON** (enabled)

### 3. Enter OAuth Credentials
- **Client ID**: `Ov23liQP2ujUf5QF9lB1`
- **Client Secret**: `b6eed486256e7868d7bbbf4f47bf3eef6f801cfc`
- Leave other settings as default

### 4. Save Configuration
- Click **Save** or **Update**

## What This Enables:
✅ Users can sign in with their GitHub accounts  
✅ Automatic profile creation in your `users` table  
✅ Secure authentication flow handled by Supabase  
✅ User data populated from GitHub (name, avatar, email)  

## Testing the Setup:
Once configured, users will be able to:
1. Click "Sign in with GitHub" in your app
2. Get redirected to GitHub to authorize your app
3. Get redirected back to your app, now logged in
4. Have their profile automatically created in your database

## Next Steps:
1. **Configure these credentials in Supabase** (steps above)
2. **Fix your Supabase API key** (still needed from earlier)
3. **Test authentication** in your app

The authentication flow will work through your existing Supabase client code - no additional changes needed in your app!