# REACH2025 Frontend Deployment Guide

## Coolify Deployment

This React application is ready for deployment with Coolify using Docker.

### Prerequisites
- Coolify instance running
- Git repository with your code
- Backend API deployed and accessible

### Deployment Steps

#### 1. **Prepare Environment Variables**
In Coolify, set these environment variables:
```
REACT_APP_API_URL=https://your-backend-api-url.com
```

#### 2. **Coolify Configuration**
- **Build Pack**: Docker
- **Dockerfile**: `./Dockerfile` (in root of frontend folder)
- **Port**: 80
- **Health Check**: `/` (root path)

#### 3. **Domain Setup**
- Set your custom domain in Coolify
- SSL certificates will be automatically handled

### Application Features
- **Individual Registration**: Multiple accommodation options with early bird pricing
- **Group Registration**: Automatic group discounts (10% for 11+, 20% for 21+)
- **Couple Registration**: Family pricing with children support
- **Payment Integration**: Multi Ministries donation portal
- **Admin Dashboard**: Complete registration management
- **Responsive Design**: Works on all devices

### Environment Variables Explained
- `REACT_APP_API_URL`: Your backend API URL (required)

### Build Process
The Dockerfile uses a multi-stage build:
1. **Build Stage**: Installs dependencies and builds React app
2. **Production Stage**: Serves built app with Nginx

### Performance Features
- **Gzip Compression**: Enabled for all text assets
- **Static Asset Caching**: 1-year cache for images, CSS, JS
- **Security Headers**: XSS protection, content type sniffing protection
- **React Router Support**: Proper SPA routing with fallback to index.html

### Health Check
The application serves on port 80 and responds to health checks at `/`.

### Troubleshooting
1. **Build Fails**: Check that all dependencies are in package.json
2. **API Connection Issues**: Verify REACT_APP_API_URL is set correctly
3. **Routing Issues**: Nginx config handles React Router properly

### Support
For deployment issues, check:
- Coolify logs for build/deployment errors
- Browser console for frontend errors
- Network tab for API connection issues
