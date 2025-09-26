# GitHub OAuth Setup for Supabase

## What you're trying to access
The URL `https://github.com/login/oauth/authorize` is GitHub's OAuth authorization endpoint, but it needs specific parameters to work properly with your Supabase project.

## Complete Setup Process

### 1. Create GitHub OAuth App
1. **Go to GitHub** → Settings → Developer settings → OAuth Apps
2. **Click "New OAuth App"**
3. **Fill in the details:**
   - **Application name**: `Frame Economics Community`
   - **Homepage URL**: `https://your-netlify-domain.netlify.app` (or your domain)
   - **Authorization callback URL**: `https://incldnepzwdrodznroat.supabase.co/auth/v1/callback`
4. **Click "Register application"**
5. **Copy your Client ID and generate a Client Secret**

### 2. Configure Supabase
1. **Go to your Supabase dashboard** → Authentication → Providers
2. **Enable GitHub provider**
3. **Enter your GitHub OAuth credentials:**
   - **Client ID**: From step 1
   - **Client Secret**: From step 1
4. **Save the configuration**

### 3. The Proper OAuth URL
Once configured, your GitHub OAuth URL will look like this:
```
https://github.com/login/oauth/authorize?
client_id=YOUR_GITHUB_CLIENT_ID&
redirect_uri=https://incldnepzwdrodznroat.supabase.co/auth/v1/callback&
scope=user:email&
state=some_random_state
```

### 4. In Your Application
Your Supabase client will handle this automatically:

```typescript
import { supabase } from './lib/supabase';

// This will redirect to GitHub OAuth
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'github',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`
  }
});
```

### 5. Test the OAuth Flow
1. **Update your environment variables** with the working Supabase keys
2. **Configure GitHub OAuth** as described above
3. **Run your app**: `npm run dev`
4. **Click sign in with GitHub** - it should redirect to GitHub OAuth
5. **After authorization**, you'll be redirected back to your app

## Why the direct URL doesn't work
- The OAuth URL requires a registered GitHub app
- It needs proper parameters (client_id, redirect_uri, scope, state)
- It must match the callback URL registered in GitHub
- Supabase handles the OAuth flow automatically when properly configured

## Next Steps
1. Set up the GitHub OAuth app (steps 1-2 above)
2. Fix your Supabase API key (as identified earlier)
3. Test the authentication flow in your app

Would you like me to help you with any specific part of this OAuth setup?