#!/bin/bash

# GitHub Pages Deployment Script for Roaster Planner

echo "🚀 Starting GitHub Pages deployment..."

# Build the application for production with GitHub Pages base href
echo "📦 Building application for GitHub Pages..."
npm run build:gh-pages

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Deploy to GitHub Pages using angular-cli-ghpages
    echo "🌐 Deploying to GitHub Pages..."
    npx angular-cli-ghpages --dir=dist/roaster-planner/browser --repo=https://github.com/suryakumar-exe/roaster-planner.git
    
    if [ $? -eq 0 ]; then
        echo "🎉 Deployment successful!"
        echo "📱 Your app is now live at: https://suryakumar-exe.github.io/roaster-planner/"
        echo "⏰ It may take a few minutes for changes to appear."
    else
        echo "❌ Deployment failed!"
        exit 1
    fi
else
    echo "❌ Build failed!"
    exit 1
fi 