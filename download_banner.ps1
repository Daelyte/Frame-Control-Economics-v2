# Download Earth Dragon OG Banner
# Run this to download the generated banner to your public folder

$url = "https://files.oaiusercontent.com/file-VvnJFYdPvMtk2JzTnyaW18?se=2025-09-26T14%3A11%3A47Z&sp=r&sv=2023-11-03&sr=b&rscc=max-age%3D299%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3Dog_frame_economics_earth_dragon.png&sig=9hgFTQd8cI78Ck3FKdQcZy0YEKLmqoVOJVUVbB8qz8Q%3D"
$outputPath = "public/og-earth-dragon.png"

try {
    Write-Host "🐉 Downloading Earth Dragon OG Banner..." -ForegroundColor Green
    
    # Ensure public directory exists
    if (-not (Test-Path "public")) {
        New-Item -ItemType Directory -Path "public" -Force
        Write-Host "📁 Created public directory"
    }
    
    # Download the image
    Invoke-WebRequest -Uri $url -OutFile $outputPath -UseBasicParsing
    
    # Verify the file was created
    if (Test-Path $outputPath) {
        $fileSize = (Get-Item $outputPath).Length
        Write-Host "✅ Earth Dragon banner downloaded successfully!" -ForegroundColor Green
        Write-Host "📁 Saved to: $outputPath" -ForegroundColor Cyan
        Write-Host "📐 File size: $([math]::Round($fileSize/1KB, 2)) KB" -ForegroundColor Yellow
        Write-Host "🎯 Ready for social sharing at 1200x630 pixels!" -ForegroundColor Magenta
    } else {
        Write-Host "❌ Download failed - file not found" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Error downloading banner: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 You can manually save the image from ChatGPT to public/og-earth-dragon.png" -ForegroundColor Yellow
}