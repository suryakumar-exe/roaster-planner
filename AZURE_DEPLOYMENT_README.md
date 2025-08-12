# Azure App Service Deployment Guide

This guide will help you deploy your Angular Roaster Planner application to Azure App Service running on Linux with Node.js.

## Prerequisites

1. **Azure Account**: You need an active Azure subscription
2. **Azure CLI**: Install Azure CLI for command-line deployment
3. **Node.js**: Version 18 or higher (for local development)

## Deployment Methods

### Method 1: Azure Portal (Easiest)

1. **Build your application locally:**
   ```bash
   npm run build:prod
   ```

2. **Create Azure App Service:**
   - Go to Azure Portal
   - Create a new App Service
   - Choose Linux as the operating system
   - Select Node.js as the runtime stack
   - Choose Node.js 18 LTS or higher

3. **Deploy via Azure Portal:**
   - Go to your App Service
   - Navigate to "Deployment Center"
   - Choose "Local Git/FTPS credentials"
   - Use the provided Git URL to push your code

### Method 2: Azure CLI

1. **Install Azure CLI and login:**
   ```bash
   az login
   ```

2. **Create App Service (if not exists):**
   ```bash
   az group create --name myResourceGroup --location eastus
   az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku B1 --is-linux
   az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name myRoasterPlanner --runtime "NODE|18-lts"
   ```

3. **Build and deploy:**
   ```bash
   npm run build:prod
   cd dist/roaster-planner
   zip -r ../deployment.zip .
   az webapp deployment source config-zip --resource-group myResourceGroup --name myRoasterPlanner --src ../deployment.zip
   ```

### Method 3: GitHub Actions (Automated)

1. **Set up GitHub Secrets:**
   - Go to your GitHub repository settings
   - Add secret: `AZURE_WEBAPP_PUBLISH_PROFILE`
   - Get the publish profile from Azure App Service

2. **Update the workflow file:**
   - Edit `.github/workflows/azure-deploy.yml`
   - Replace `your-app-service-name` with your actual app service name

3. **Push to main branch:**
   - The workflow will automatically build and deploy on push

## Configuration Files

### web.config
- Handles URL rewriting for Angular routing
- Configures MIME types for static files
- Sets security headers

### startup.sh
- Startup script for Azure App Service
- Installs and runs the `serve` package
- Serves the application on port 8080

### package.json
- Updated with production build script
- Includes Node.js engine requirements
- Added postinstall script for automatic build

## Important Notes

1. **Port Configuration**: Azure App Service expects the app to run on port 8080
2. **Build Output**: The build output goes to `dist/roaster-planner/` folder
3. **Static Files**: All static files (HTML, CSS, JS) are served from the dist folder
4. **Environment Variables**: Configure any environment variables in Azure App Service settings

## Troubleshooting

### Common Issues:

1. **Build Failures:**
   - Check Node.js version (should be 18+)
   - Ensure all dependencies are installed
   - Check for TypeScript compilation errors

2. **Routing Issues:**
   - Ensure `web.config` is in the root of your deployment
   - Check that Angular routes are properly configured

3. **Port Issues:**
   - Verify the app is listening on port 8080
   - Check Azure App Service configuration

4. **Static File Issues:**
   - Ensure all assets are in the dist folder
   - Check MIME type configurations in web.config

## Environment Configuration

For production deployment, consider setting these environment variables in Azure App Service:

- `NODE_ENV=production`
- Any API endpoints or configuration values your app needs

## Monitoring

After deployment, monitor your application using:
- Azure Application Insights
- Azure App Service logs
- Performance metrics in Azure Portal

## Security Considerations

1. **HTTPS**: Azure App Service provides HTTPS by default
2. **Headers**: Security headers are configured in web.config
3. **Environment Variables**: Store sensitive data in Azure App Service settings, not in code

## Support

If you encounter issues:
1. Check Azure App Service logs
2. Review the deployment logs
3. Verify all configuration files are present
4. Ensure the build process completes successfully 