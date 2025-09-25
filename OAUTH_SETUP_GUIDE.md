# OAuth Setup Guide for Frame Economics

## 📋 OAuth Configuration Steps

### 1. GitHub OAuth Setup

**I've opened GitHub Developer Settings for you. Follow these steps:**

1. **Create GitHub OAuth App**:
   - Go to: https://github.com/settings/developers
   - Click "New OAuth App"
   - Fill in:
     - **Application name**: `Frame Economics Community`
     - **Homepage URL**: `https://your-netlify-site.netlify.app` (replace with your actual Netlify URL)
     - **Authorization callback URL**: `https://incldnepzwdrodznroat.supabase.co/auth/v1/callback`
   - Click "Register application"

2. **Get GitHub Credentials**:
   - Copy the **Client ID**
   - Generate a **Client Secret** and copy it
   - Keep these safe - you'll need them for Supabase

### 2. Google OAuth Setup

**I've opened Google Console for you. Follow these steps:**

1. **Create Google OAuth App**:
   - Go to: https://console.developers.google.com/apis/credentials
   - Select your project or create a new one
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Fill in:
     - **Name**: `Frame Economics Community`
     - **Authorized JavaScript origins**: `https://your-netlify-site.netlify.app`
     - **Authorized redirect URIs**: `https://incldnepzwdrodznroat.supabase.co/auth/v1/callback`
   - Click "Create"

2. **Get Google Credentials**:
   - Copy the **Client ID**
   - Copy the **Client Secret**
   - Keep these safe for Supabase configuration

### 3. Configure in Supabase Dashboard

**I've opened your Supabase Auth Providers page. Configure each provider:**

1. **GitHub Provider**:
   - Enable GitHub provider
   - Enter your GitHub Client ID
   - Enter your GitHub Client Secret
   - Save changes

2. **Google Provider**:
   - Enable Google provider
   - Enter your Google Client ID
   - Enter your Google Client Secret
   - Save changes

### 4. Important URLs to Remember

- **Supabase Project URL**: `https://incldnepzwdrodznroat.supabase.co`
- **Callback URL**: `https://incldnepzwdrodznroat.supabase.co/auth/v1/callback`
- **Your Site URL**: Update this in Supabase → Settings → Auth → Site URL

### 5. Update Site URL in Supabase

1. Go to Supabase Dashboard → Settings → Auth
2. Update **Site URL** to your actual Netlify deployment URL
3. Add **Additional Redirect URLs** if you have multiple environments

## ✅ Verification Steps

After setup, test OAuth by:
1. Going to your deployed site
2. Clicking "Sign in with GitHub" 
3. Clicking "Sign in with Google"
4. Verify users appear in Supabase → Authentication → Users

## 🔐 Security Notes

- Never commit OAuth secrets to your repository
- Use environment variables for all sensitive data
- Regularly rotate your OAuth secrets
- Monitor authentication logs in Supabase dashboard

## 📞 Need Help?

If you encounter issues:
1. Check Supabase logs in Dashboard → Logs
2. Verify callback URLs match exactly
3. Ensure OAuth apps are properly configured
4. Test with different browsers/incognito mode