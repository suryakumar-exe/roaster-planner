#!/bin/bash

# Azure App Service Deployment Script
echo "Starting Azure App Service deployment..."

# Build the Angular application for production
echo "Building Angular application..."
npm run build:prod

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build successful! Application is ready for deployment."
    echo "You can now deploy the contents of the 'dist' folder to Azure App Service."
    echo ""
    echo "Deployment options:"
    echo "1. Use Azure CLI: az webapp deployment source config-zip --resource-group <resource-group> --name <app-name> --src dist.zip"
    echo "2. Use Azure DevOps Pipelines"
    echo "3. Use GitHub Actions"
    echo "4. Use Azure Portal (drag and drop dist folder contents)"
else
    echo "Build failed! Please check the error messages above."
    exit 1
fi 