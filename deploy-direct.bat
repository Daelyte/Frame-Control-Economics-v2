@echo off
echo 🚀 Direct Deployment - Bypassing Plugin Issues
echo.

echo 📦 Building site...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo ✅ Build successful!
echo.
echo 🌐 Deploying to Netlify...
echo.

REM Deploy using direct file upload method
call netlify deploy --prod --dir dist --open

echo.
echo ✅ Deployment complete!
echo 🌍 Your site should now be live at: https://icecoldfroste.com
echo.
pause