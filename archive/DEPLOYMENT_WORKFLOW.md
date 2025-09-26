# 🚀 Deployment Workflow & Rules

## 📋 **MANDATORY DEPLOYMENT PROCESS**

> **RULE**: Always follow this exact sequence for any code changes or updates.

---

## 🧪 **PHASE 1: Test Environment**

### 1.1 **Local Development & Testing**
```bash
# Start development server
npm run dev

# Verify changes work locally
# Test all functionality
# Check responsive design
# Validate user experience
```

### 1.2 **Build Verification**
```bash
# Ensure clean TypeScript build
npm run build

# Check for build errors
# Verify dist folder generation
# Test production build locally if needed
npm run preview
```

### 1.3 **Code Quality Check**
```bash
# Check git status
git status

# Review all changes
git diff

# Stage appropriate files
git add [files]
```

---

## 🔄 **PHASE 2: Version Control (Git)**

### 2.1 **Branch Management**
```bash
# Work on feature branch (if applicable)
git checkout -b feature/description

# Or ensure main is current
git checkout main
git pull origin main
```

### 2.2 **Commit Process**
```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "✨ Description of changes

- Specific change 1
- Specific change 2  
- Fix any issues addressed"

# Push to repository
git push origin main
```

---

## 🌐 **PHASE 3: Netlify Deployment Audit**

### 3.1 **Pre-Deployment Checklist**
- ✅ Ensure `public/` directory is properly tracked in git
- ✅ Verify static assets (images, fonts, etc.) are committed
- ✅ Check `netlify.toml` configuration is correct
- ✅ Confirm build command: `npm run build`
- ✅ Confirm publish directory: `dist`

### 3.2 **Deployment Monitoring**
1. **Monitor Netlify Dashboard**
   - Visit [app.netlify.com](https://app.netlify.com/)
   - Navigate to Frame Economics project
   - Check "Deploys" tab for build status

2. **Verify Build Process**
   - ✅ Build starts automatically after git push
   - ✅ Build completes without errors
   - ✅ Deploy finishes successfully
   - ✅ Site preview shows changes

### 3.3 **Post-Deployment Verification**
1. **Test Live Site**
   - Visit [icecoldfroste.com](https://icecoldfroste.com/)
   - Test new features/changes
   - Verify responsive design
   - Check all links and assets load

2. **Performance Check**
   - Page load speed
   - Image loading
   - Interactive elements
   - Mobile responsiveness

---

## 📝 **PHASE 4: Documentation & Audit Trail**

### 4.1 **Create Deployment Record**
For each deployment, create a record in `DEPLOYMENT_LOG.md`:

```markdown
## Deployment [YYYY-MM-DD HH:MM]

**Commit**: [commit-hash]
**Changes**: 
- Brief description of what was changed
- Key features added/modified
- Issues resolved

**Testing**:
- ✅ Local development server
- ✅ Production build
- ✅ TypeScript compilation
- ✅ Responsive design

**Git Process**:
- ✅ Changes committed to main branch
- ✅ Push successful: [commit-hash]

**Netlify Deployment**:
- ✅ Build triggered automatically
- ✅ Build completed: [timestamp]
- ✅ Deploy successful: [deployment-url]
- ✅ Live site updated: [verification-timestamp]

**Verification**:
- ✅ Site loads correctly
- ✅ New features working
- ✅ No broken links/assets
- ✅ Mobile responsive
- ✅ Performance acceptable

**Issues Encountered**: [None/Description]
**Resolution**: [N/A/How resolved]
```

### 4.2 **Update Project Documentation**
- Update README.md if new features added
- Document any configuration changes
- Update environment variables if changed
- Note any dependency updates

---

## 🚨 **TROUBLESHOOTING CHECKLIST**

### Common Issues & Solutions

**Issue**: Netlify shows local Windows path
- **Fix**: Ensure `public/` directory is tracked in git
- **Fix**: Remove `public` from `.gitignore` for Vite projects

**Issue**: Images not loading on live site
- **Fix**: Verify images are in `public/` directory
- **Fix**: Check images are committed to repository
- **Fix**: Use correct path format in code (`/image.png` not `./image.png`)

**Issue**: Build fails on Netlify
- **Fix**: Check `netlify.toml` build command
- **Fix**: Verify `package.json` scripts
- **Fix**: Check for TypeScript errors locally first

**Issue**: Site not updating after deployment
- **Fix**: Clear browser cache
- **Fix**: Check deployment actually completed
- **Fix**: Verify correct branch is being deployed

---

## 🎯 **SUCCESS CRITERIA**

A deployment is considered successful when:

✅ **Local Testing**: All features work in development  
✅ **Build Process**: Clean TypeScript compilation and build  
✅ **Git Process**: Changes committed and pushed successfully  
✅ **Netlify Build**: Automated build completes without errors  
✅ **Live Site**: All changes visible and functional on production  
✅ **Performance**: Site loads quickly and responds well  
✅ **Documentation**: Deployment logged and documented  

---

## 🔄 **AUTOMATION OPPORTUNITIES**

Future improvements to consider:
- [ ] GitHub Actions for automated testing
- [ ] Automated lighthouse performance checks
- [ ] Slack/Discord notifications for deployments
- [ ] Automated rollback on failed deployments
- [ ] Integration testing automation

---

**This workflow ensures reliable, documented deployments every time.**