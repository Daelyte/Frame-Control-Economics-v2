@echo off
echo Checking for dragon image...
if exist "public\dragon-og.png" (
    echo Found dragon-og.png, committing changes...
    git add public/dragon-og.png
    git commit -m "🐲 Add actual dragon OG image - FINAL dragon theme complete!"
    git push origin main
    echo Dragon theme is now LIVE! 🎉
) else (
    echo Please save your dragon image as public\dragon-og.png first
)
pause