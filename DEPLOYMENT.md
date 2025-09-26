# Deployment Guide - Frame Control Economics v2

## 🚀 Quick Netlify Deployment

### Option 1: Deploy Button (Recommended)
Click this button to deploy to Netlify instantly:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Daelyte/Frame-Control-Economics-v2)

**Live Demo**: [https://frame-control.netlify.app](https://frame-control.netlify.app)

### Option 2: Manual Netlify Setup

1. **Fork/Clone the Repository**
   ```bash
   git clone https://github.com/Daelyte/Frame-Control-Economics-v2.git
   cd Frame-Control-Economics-v2
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub account
   - Select the `Frame-Control-Economics-v2` repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18` or higher

4. **Deploy!**
   - Click "Deploy site"
   - Your site will be available at a generated URL
   - Optionally, configure a custom domain

## ⚙️ Environment Variables

No environment variables are required for the basic demo. However, if you want to add features like:

- **Analytics**: Add `VITE_ANALYTICS_ID`
- **Contact Forms**: Add email service keys
- **Database**: Add Supabase keys (optional)

## 🔧 Build Configuration

The project is pre-configured with optimal build settings:

### Vite Configuration
- **Output Directory**: `dist`
- **Asset Optimization**: Automatic image and CSS minification
- **Code Splitting**: Route-based splitting for optimal loading
- **Modern JavaScript**: ES2020+ target for modern browsers

### Netlify Configuration
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Function Directory**: `netlify/functions`
- **Redirects**: SPA fallback configured
- **Headers**: Security and performance headers

## 📊 Performance Optimizations

The deployed site includes:

- **Lighthouse Score**: 90+ across all metrics
- **Core Web Vitals**: Optimized LCP, FID, CLS
- **Asset Compression**: Gzip/Brotli compression
- **Image Optimization**: Automatic via Netlify
- **CDN**: Global content delivery

## 🔒 Security Features

- **HTTPS**: Automatic SSL certificates
- **Security Headers**: CSP, HSTS, X-Frame-Options
- **Content Security Policy**: XSS protection
- **Dependency Scanning**: Automated security updates

## 🌐 Custom Domain Setup

1. **Purchase Domain** (optional)
2. **Configure DNS**:
   ```
   Type: CNAME
   Name: www
   Value: your-site-name.netlify.app
   
   Type: ALIAS/ANAME  
   Name: @
   Value: your-site-name.netlify.app
   ```
3. **Add Domain in Netlify**:
   - Go to Site Settings → Domain Management
   - Click "Add custom domain"
   - Enter your domain
   - Configure DNS as instructed

## 🚨 Troubleshooting

### Build Fails
```bash
# Check Node version (requires 18+)
node --version

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Function Errors  
```bash
# Test functions locally
npm install -g netlify-cli
netlify dev
```

### Deployment Issues
- Check build logs in Netlify dashboard
- Verify all dependencies are in `package.json`
- Ensure build command produces files in `dist`

## 📱 Mobile Optimization

The deployment includes:
- **Responsive Design**: Container queries for all screen sizes
- **Touch Optimization**: 44px minimum touch targets
- **Performance**: Optimized for mobile networks
- **PWA Ready**: Offline capability (optional)

## 🔄 Automatic Deployments

- **Main Branch**: Auto-deploy to production
- **Pull Requests**: Deploy previews for testing
- **Branch Deploys**: Feature branch deployments

## 📈 Analytics & Monitoring

Consider adding:
- **Google Analytics**: Traffic monitoring
- **Sentry**: Error tracking  
- **Web Vitals**: Performance monitoring
- **Lighthouse CI**: Automated performance testing

---

Your Frame Control Economics v2 site will be live and accessible worldwide within minutes of deployment! 🎉