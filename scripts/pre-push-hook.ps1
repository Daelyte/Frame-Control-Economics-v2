# PowerShell Pre-Push Hook for Windows
# Install with: Copy this to .git/hooks/pre-push.ps1 and create a pre-push file that calls it

param(
    [string]$remote,
    [string]$url
)

Write-Host "🔍 Running deployment validation before pushing to main..." -ForegroundColor Blue
Write-Host "This will prevent Ghost plugin and build errors on Netlify." -ForegroundColor Blue
Write-Host ""

# Check if pushing to main branch
$input = @()
while ($line = [Console]::ReadLine()) {
    if (-not $line) { break }
    $input += $line
}

$pushingToMain = $false
foreach ($line in $input) {
    $parts = $line -split '\s+'
    if ($parts.Length -ge 3) {
        $remoteRef = $parts[2]
        if ($remoteRef -eq "refs/heads/main" -or $remoteRef -eq "refs/heads/master") {
            $pushingToMain = $true
            break
        }
    }
}

if (-not $pushingToMain) {
    Write-Host "✅ Not pushing to main branch, skipping validation." -ForegroundColor Green
    exit 0
}

# Run validation
try {
    if (Get-Command node -ErrorAction SilentlyContinue) {
        Write-Host "Running validation..." -ForegroundColor Yellow
        $result = node scripts/validate.cjs
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host ""
            Write-Host "❌ Pre-push validation failed!" -ForegroundColor Red
            Write-Host "Fix the errors above before pushing to main." -ForegroundColor Red
            Write-Host ""
            Write-Host "💡 Emergency options:" -ForegroundColor Yellow
            Write-Host "  - npm run fix-and-deploy" -ForegroundColor Cyan
            Write-Host "  - git push --no-verify (not recommended)" -ForegroundColor Cyan
            exit 1
        }
        
        Write-Host ""
        Write-Host "✅ Deployment validation passed. Proceeding with push..." -ForegroundColor Green
    } else {
        Write-Host "❌ Node.js not found. Please install Node.js to run deployment validation." -ForegroundColor Red
        Write-Host "🚨 Emergency deploy: npm run fix-and-deploy" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "⚠️ Validation script failed: $_" -ForegroundColor Yellow
    Write-Host "Proceeding with push (manual validation required)" -ForegroundColor Yellow
}

exit 0