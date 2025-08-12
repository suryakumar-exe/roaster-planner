# GitHub Pages Deployment Guide

This guide will help you deploy your Angular Roaster Planner application to GitHub Pages.

## 🚀 **Quick Setup**

### 1. **Enable GitHub Pages**
1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Click **Save**

### 2. **Push Your Code**
```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

### 3. **Automatic Deployment**
- GitHub Actions will automatically build and deploy your app
- Your app will be available at: `https://yourusername.github.io/roaster-planner/`

## 📁 **Configuration Files**

### **`.github/workflows/github-pages.yml`**
- Automated build and deployment workflow
- Triggers on push to main branch
- Builds Angular app and deploys to GitHub Pages

### **`404.html` & `redirect.html`**
- Handle Angular routing on GitHub Pages
- Enable SPA (Single Page Application) functionality
- Prevent 404 errors on direct route access

### **`package.json`**
- Added `build:gh-pages` script with correct base href
- Configured for GitHub Pages deployment

## 🔧 **Manual Deployment (Optional)**

If you want to deploy manually:

```bash
# Build for GitHub Pages
npm run build:gh-pages

# The built files will be in dist/roaster-planner/
# Upload these files to GitHub Pages manually
```

## 🌐 **URL Structure**

Your app will be available at:
- **Main URL**: `https://yourusername.github.io/roaster-planner/`
- **Routes**: `https://yourusername.github.io/roaster-planner/dashboard`
- **All Angular routes will work properly**

## ⚙️ **GitHub Pages Settings**

### **Repository Settings**
1. **Pages Source**: GitHub Actions
2. **Custom Domain** (optional): Add your custom domain
3. **HTTPS**: Automatically enabled

### **Branch Protection** (Recommended)
1. Go to **Settings** → **Branches**
2. Add rule for `main` branch
3. Enable **Require status checks to pass before merging**

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **404 Errors on Routes**
   - Ensure `404.html` and `redirect.html` are in the root
   - Check that Angular routing is configured correctly

2. **Build Failures**
   - Check GitHub Actions logs
   - Verify Node.js version (18+)
   - Ensure all dependencies are installed

3. **Assets Not Loading**
   - Check base href in build configuration
   - Verify asset paths are relative

4. **Deployment Not Working**
   - Check GitHub Actions permissions
   - Verify workflow file is in `.github/workflows/`
   - Ensure repository has GitHub Pages enabled

## 📊 **Monitoring**

### **GitHub Actions**
- Monitor builds in **Actions** tab
- Check deployment status
- View build logs for debugging

### **GitHub Pages**
- Check deployment status in **Settings** → **Pages**
- View deployment logs
- Monitor site performance

## 🔒 **Security Considerations**

1. **HTTPS**: GitHub Pages provides HTTPS by default
2. **Environment Variables**: Store sensitive data in GitHub Secrets
3. **API Keys**: Don't commit API keys to repository

## 🎯 **Best Practices**

1. **Test Locally First**
   ```bash
   npm run build:gh-pages
   npx serve -s dist/roaster-planner -l 8080
   ```

2. **Use Semantic Commits**
   ```bash
   git commit -m "feat: add dashboard component"
   git commit -m "fix: resolve routing issue"
   ```

3. **Monitor Performance**
   - Use browser dev tools
   - Check network tab for loading times
   - Monitor bundle sizes

## 🚀 **Advanced Configuration**

### **Custom Domain**
1. Add custom domain in repository settings
2. Update DNS records
3. Add CNAME file to repository

### **Environment Variables**
```yaml
# In .github/workflows/github-pages.yml
env:
  NODE_ENV: production
  API_URL: ${{ secrets.API_URL }}
```

### **Performance Optimization**
- Enable gzip compression
- Use CDN for assets
- Optimize images and fonts

## 📞 **Support**

If you encounter issues:
1. Check GitHub Actions logs
2. Review deployment configuration
3. Verify all files are committed
4. Check GitHub Pages settings

## 🎉 **Success!**

Once deployed, your Roaster Planner app will be live at:
**https://yourusername.github.io/roaster-planner/**

The deployment will automatically update whenever you push changes to the main branch! 