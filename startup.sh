#!/bin/bash

# Navigate to the dist folder
cd /home/site/wwwroot

# Install serve globally if not already installed
npm install -g serve

# Serve the Angular app on port 8080 (Azure App Service default)
serve -s . -l 8080 