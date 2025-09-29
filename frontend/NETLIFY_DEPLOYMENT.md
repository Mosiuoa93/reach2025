# REACH2025 Frontend - Netlify Deployment Guide

## 🚀 Quick Deployment Steps

### Option 1: Deploy via Git (Recommended)

#### 1. **Push to GitHub/GitLab**
```bash
# If not already in git
git init
git add .
git commit -m "Prepare REACH2025 for Netlify deployment"

# Push to your repository
git remote add origin https://github.com/yourusername/reach2025.git
git push -u origin main
```

#### 2. **Deploy on Netlify**
1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click **"New site from Git"**
3. Choose your Git provider (GitHub/GitLab/Bitbucket)
4. Select your **REACH2025** repository
5. Configure build settings:
   - **Base directory**: `frontend` (if repo contains both frontend/backend)
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
6. Click **"Deploy site"**

#### 3. **Set Environment Variables**
In Netlify dashboard → Site settings → Environment variables:
```
REACT_APP_API_URL=https://your-backend-api-url.com
```

### Option 2: Manual Deploy (Drag & Drop)

#### 1. **Build Locally**
```bash
cd /Users/mosiuoamolefi/CascadeProjects/REACH2025/frontend
npm run build
```

#### 2. **Deploy to Netlify**
1. Go to [netlify.com](https://netlify.com)
2. Drag the `build` folder to the deploy area
3. Set environment variables in site settings

## 🎯 Your REACH2025 Features

### ✅ **Registration Types**
- **Individual Registration**: Guesthouse, Dormitory, Day Pass options
- **Group Registration**: Automatic discounts (10% for 11+, 20% for 21+)
- **Couple Registration**: Family pricing with children support

### ✅ **Pricing System**
- **Early Bird Pricing**: Automatic until Feb 28, 2026
- **Real-time Calculations**: Backend API integration
- **Payment Integration**: Multi Ministries donation portal

### ✅ **Admin Features**
- **Dashboard**: Complete registration management
- **Data Export**: CSV downloads
- **Real-time Updates**: Live registration data

## 🔧 Configuration Details

### **Build Settings**
- **Node.js Version**: 18
- **Build Command**: `npm run build`
- **Publish Directory**: `build`
- **Environment**: Production optimized

### **Performance Features**
- **React Router**: Proper SPA routing with redirects
- **Static Asset Caching**: 1-year cache for optimal performance
- **Security Headers**: XSS protection, content type sniffing protection
- **Gzip Compression**: Automatic by Netlify

### **Environment Variables**
```bash
# Required
REACT_APP_API_URL=https://your-backend-api-url.com

# Optional (for analytics, etc.)
# REACT_APP_ANALYTICS_ID=your-analytics-id
```

## 🌐 Custom Domain Setup

### **Add Custom Domain**
1. In Netlify dashboard → Domain settings
2. Add custom domain: `reach2025.yourdomain.com`
3. Update DNS records as instructed
4. SSL certificate will be automatically provisioned

### **DNS Configuration**
Point your domain to Netlify:
```
Type: CNAME
Name: reach2025 (or www)
Value: your-netlify-subdomain.netlify.app
```

## 🚀 Deployment Workflow

### **Automatic Deployments**
- **Main Branch**: Auto-deploys to production
- **Pull Requests**: Creates deploy previews
- **Build Time**: ~2-3 minutes
- **Global CDN**: Instant worldwide availability

### **Deploy Previews**
- Every PR gets a unique URL for testing
- Perfect for reviewing changes before merging
- Same environment as production

## 📊 Monitoring & Analytics

### **Netlify Analytics**
- Built-in traffic analytics
- Performance monitoring
- Error tracking

### **Build Notifications**
- Email notifications for deploy status
- Slack/Discord integration available
- GitHub status checks

## 🔍 Troubleshooting

### **Common Issues**
1. **Build Fails**: Check Node.js version (should be 18)
2. **API Connection**: Verify REACT_APP_API_URL is set
3. **Routing Issues**: netlify.toml handles React Router redirects
4. **Environment Variables**: Must start with REACT_APP_

### **Build Logs**
Check Netlify deploy logs for detailed error information.

## 🎉 Success!

Once deployed, your REACH2025 registration system will be:
- ✅ **Live on the internet** with HTTPS
- ✅ **Globally distributed** via CDN
- ✅ **Auto-deploying** from Git
- ✅ **Production optimized** for performance

Your users can register at: `https://your-site.netlify.app`
