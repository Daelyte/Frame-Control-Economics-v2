# 🚀 Frame Economics Deployment Rulebook

## Executive Summary
After multiple deployment failures costing 5+ hours, this rulebook provides bulletproof deployment strategies from first principles.

## 🔍 Root Causes Analysis

### Historical Issues Encountered:
1. **Netlify Plugin Failures**
   - `netlify-plugin-ghost-markdown` missing required inputs
   - `netlify-plugin-fetch-feeds` missing required inputs
   - Plugins enabled in Netlify UI without proper configuration

2. **TypeScript Compilation Errors**
   - Unused imports causing build failures
   - Missing type annotations
   - Incorrect property access on interfaces

3. **Git Hook Failures** 
   - Windows compatibility issues with shell scripts
   - Fork errors preventing pushes
   - Pre-push validation hanging

4. **Build Process Issues**
   - Missing dependencies in package.json
   - Environment variable misconfigurations
   - ES modules vs CommonJS conflicts

## 🛡️ Prevention Strategy

### 1. Plugin Management
```toml
# netlify.toml - ALWAYS disable problematic plugins
[build.environment]
  NETLIFY_SKIP_PLUGIN_INSTALL = "true"
  NETLIFY_DISABLE_PLUGIN_GHOST_MARKDOWN = "true"
  NETLIFY_DISABLE_PLUGIN_FETCH_FEEDS = "true"

# Explicitly disable with dummy inputs
[[plugins]]
package = "netlify-plugin-ghost-markdown"
enabled = false
  [plugins.inputs]
  ghostURL = "disabled"
  ghostKey = "disabled"

[[plugins]]
package = "netlify-plugin-fetch-feeds" 
enabled = false
  [plugins.inputs]
  dataDir = "disabled"
  feeds = []
```

### 2. Build Validation Pipeline
```json
{
  "scripts": {
    "validate:quick": "node scripts/validate.cjs",
    "validate:full": "node scripts/validate-full.cjs",
    "deploy-safe": "npm run validate:full && git push",
    "fix-and-deploy": "npm run quick-fix && npm run validate:quick && git push --no-verify"
  }
}
```

### 3. TypeScript Strictness
- Always run `npx tsc --noEmit` before deployment
- Fix unused imports immediately
- Use proper type annotations for all parameters
- Test builds locally with `npm run build`

### 4. Git Hook Strategy
- Use `.cjs` scripts for better compatibility
- Implement Windows-specific alternatives
- Always provide `--no-verify` escape hatch
- Keep validation scripts simple and fast

## 🎯 Deployment Checklist

### Pre-Deployment (Automated)
- [ ] TypeScript compilation check
- [ ] Build test passes
- [ ] No unused imports
- [ ] Plugin configuration valid
- [ ] Environment variables set

### Manual Verification
- [ ] Test key features in local dev
- [ ] Check mobile responsiveness
- [ ] Verify asset loading (images, fonts)
- [ ] Test form submissions if applicable

### Post-Deployment
- [ ] Verify site loads correctly
- [ ] Check console for errors
- [ ] Test on multiple devices
- [ ] Monitor Netlify deployment logs

## 🚨 Emergency Procedures

### Deployment Failing?
1. **Quick Fix**: `npm run fix-and-deploy`
2. **Plugin Issues**: Check netlify.toml for disabled plugins
3. **TypeScript Errors**: Run `npx tsc --noEmit` and fix
4. **Git Hook Issues**: Use `git push --no-verify`

### Rollback Strategy
```bash
# Revert to last working commit
git log --oneline -10  # Find last good commit
git revert HEAD        # Or specific commit hash
git push --no-verify
```

## 📋 Platform-Specific Notes

### Windows Development
- Use PowerShell-compatible scripts
- Avoid bash-specific commands in hooks
- Test Git hooks with Windows Git
- Use `.cjs` extensions for Node scripts

### Netlify Deployment
- Disable all unnecessary plugins
- Set NODE_VERSION = "18" 
- Use environment variables for sensitive data
- Monitor build logs for new plugin additions

## 🔧 Tools and Scripts

### Essential Scripts
1. `validate.cjs` - Cross-platform validation
2. `quick-fix.cjs` - Auto-fix common issues  
3. `deploy-check.cjs` - Pre-deployment verification
4. `rollback.cjs` - Emergency rollback utility

### Monitoring
- Netlify deployment status webhook
- Error tracking for build failures
- Performance monitoring post-deployment

---

## 📖 Learning from Failures

**Key Principle**: Every deployment failure should add a new automated check to prevent recurrence.

**Rule of thumb**: If it failed once, it will fail again unless prevented systematically.

**Success Metric**: Zero-touch deployments with confidence in success.