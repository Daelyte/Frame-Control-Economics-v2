#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const WORKFLOW_LOG = 'DEVELOPMENT_WORKFLOW.md';
const DEPLOY_URL = 'https://frame-control.netlify.app';

function log(message) {
  console.log(`🚀 [DEPLOY] ${message}`);
}

function execCommand(command, description) {
  log(description);
  try {
    const result = execSync(command, { encoding: 'utf-8', stdio: 'inherit' });
    return result;
  } catch (error) {
    console.error(`❌ Failed: ${description}`);
    console.error(error.message);
    process.exit(1);
  }
}

function updateWorkflowLog(status, files, commit, notes) {
  const timestamp = new Date().toISOString();
  const entry = `
### ${timestamp.split('T')[0]} ${timestamp.split('T')[1].split('.')[0]} - Deployment Cycle
**Status**: ${status}
**Files Changed**: 
${files.map(f => `- ${f}`).join('\n')}

**Git Commit**: ${commit}
**Netlify Deploy**: ${DEPLOY_URL}
**Notes**: 
${notes.map(n => `- ${n}`).join('\n')}

**Verification**:
- [x] Code builds successfully
- [x] Git pushed to main
- [ ] Netlify deployment successful (verifying...)
- [ ] Visual/functional verification pending

---

`;

  const workflowPath = path.resolve(WORKFLOW_LOG);
  let content = fs.readFileSync(workflowPath, 'utf-8');
  
  // Insert after the "Change History Template" section
  const insertPoint = content.indexOf('---\n\n*This document is automatically updated');
  if (insertPoint > -1) {
    content = content.slice(0, insertPoint) + entry + content.slice(insertPoint);
    fs.writeFileSync(workflowPath, content);
  }
  
  log('Updated development workflow log');
}

function getChangedFiles() {
  try {
    const result = execSync('git diff --name-only HEAD~1..HEAD', { encoding: 'utf-8' });
    return result.trim().split('\n').filter(f => f.length > 0);
  } catch (error) {
    // If no previous commit, get all staged files
    try {
      const staged = execSync('git diff --cached --name-only', { encoding: 'utf-8' });
      return staged.trim().split('\n').filter(f => f.length > 0);
    } catch (e) {
      return ['Initial commit - all files'];
    }
  }
}

function waitForDeployment(maxWaitMinutes = 5) {
  log(`Waiting for Netlify deployment to complete (max ${maxWaitMinutes} minutes)...`);
  
  let attempts = 0;
  const maxAttempts = maxWaitMinutes * 6; // Check every 10 seconds
  
  const checkDeployment = () => {
    attempts++;
    log(`Checking deployment status (attempt ${attempts}/${maxAttempts})...`);
    
    try {
      // Simple HTTP check to see if site is responding
      execSync(`curl -f -s -o /dev/null ${DEPLOY_URL}`, { stdio: 'pipe' });
      log('✅ Deployment verified successfully!');
      return true;
    } catch (error) {
      if (attempts >= maxAttempts) {
        log('⚠️  Max wait time reached. Please verify deployment manually.');
        return false;
      }
      
      setTimeout(checkDeployment, 10000); // Wait 10 seconds before next check
      return null;
    }
  };
  
  return checkDeployment();
}

async function main() {
  log('Starting deployment workflow...');
  
  // 1. Pre-deploy validation
  log('Step 1: Pre-deployment validation');
  execCommand('npm run lint', 'Running ESLint...');
  execCommand('npm run build', 'Building project...');
  
  // 2. Get current status
  const changedFiles = getChangedFiles();
  const timestamp = new Date().toISOString();
  const commitMessage = `Deploy: ${timestamp.split('T')[0]} - Workflow automation update`;
  
  // 3. Git operations
  log('Step 2: Git operations');
  execCommand('git add .', 'Staging all changes...');
  
  let commitHash;
  try {
    execCommand(`git commit -m "${commitMessage}"`, 'Committing changes...');
    commitHash = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim().slice(0, 8);
  } catch (error) {
    log('No changes to commit, continuing...');
    commitHash = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim().slice(0, 8);
  }
  
  execCommand('git push origin main', 'Pushing to main branch...');
  
  // 4. Update workflow log
  log('Step 3: Updating workflow log');
  updateWorkflowLog(
    'DEPLOYED',
    changedFiles,
    commitHash,
    [
      'Automated deployment workflow executed',
      'All pre-deployment checks passed',
      'Changes pushed to main branch',
      'Waiting for Netlify deployment confirmation'
    ]
  );
  
  // 5. Wait for and verify deployment
  log('Step 4: Verifying deployment');
  const deploymentSuccess = waitForDeployment();
  
  if (deploymentSuccess) {
    log('✅ Deployment workflow completed successfully!');
    log(`🌐 Site available at: ${DEPLOY_URL}`);
  } else {
    log('⚠️  Deployment workflow completed with warnings. Please verify manually.');
  }
  
  log('📝 Development log updated with latest changes.');
  log('🚀 Ready for next development cycle!');
}

main().catch(error => {
  console.error('❌ Deployment workflow failed:', error.message);
  process.exit(1);
});