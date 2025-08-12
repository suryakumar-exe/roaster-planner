# GitHub Pages Deployment Script for Roaster Planner (PowerShell)

Write-Host "🚀 Starting GitHub Pages deployment..." -ForegroundColor Green

# Build the application for production with GitHub Pages base href
Write-Host "📦 Building application for GitHub Pages..." -ForegroundColor Yellow
npm run build:gh-pages

# Check if build was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    
    # Deploy to GitHub Pages using angular-cli-ghpages
    Write-Host "🌐 Deploying to GitHub Pages..." -ForegroundColor Yellow
    npx angular-cli-ghpages --dir=dist/roaster-planner/browser --repo=https://github.com/suryakumar-exe/roaster-planner.git
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "🎉 Deployment successful!" -ForegroundColor Green
        Write-Host "📱 Your app is now live at: https://suryakumar-exe.github.io/roaster-planner/" -ForegroundColor Cyan
        Write-Host "⏰ It may take a few minutes for changes to appear." -ForegroundColor Yellow
    } else {
        Write-Host "❌ Deployment failed!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
} 