# Taskager - Production Deployment Guide

## 📋 Overview
This guide covers deploying the Taskager Task Manager app to production:
- **Backend**: Deploy to Render
- **Frontend**: Deploy to Vercel
- **Database**: MongoDB Atlas (already configured)

---

## 🚀 Backend Deployment (Render)

### Step 1: Prepare Backend for Deployment

1. **Verify package.json scripts**:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

2. **Check Node version** (add to package.json if needed):
```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub account
3. Connect your GitHub repository

### Step 3: Create New Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `Task-Manager-`
3. Configure deployment:
   - **Name**: `taskager-api`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### Step 4: Add Environment Variables

In Render dashboard, go to "Environment" tab and add:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://mdsayemsaif:kZNyp6hbwgF2GX4L@cluster0.qfbor5e.mongodb.net/taskager
JWT_SECRET=your_super_secret_jwt_key_2024_production_taskager_app
JWT_EXPIRE=30d
CLIENT_URL=https://your-app-name.vercel.app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

**Generate strong JWT_SECRET**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Deploy

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Note your backend URL: `https://taskager-api.onrender.com`

### Step 6: Test Backend

```bash
curl https://taskager-api.onrender.com/api/health
```

Should return: `{"success":true,"message":"Server is healthy"}`

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Create Production Environment File

Create `.env.production` in root directory:

```env
VITE_API_URL=https://taskager-api.onrender.com/api
VITE_APP_NAME=Taskager
VITE_NODE_ENV=production
```

### Step 2: Update Build Config

Verify `package.json` has:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Step 3: Deploy to Vercel

**Option A: Using Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Option B: Using Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Import your repository: `Task-Manager-`
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave empty)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add Environment Variables:
   ```
   VITE_API_URL=https://taskager-api.onrender.com/api
   VITE_APP_NAME=Taskager
   VITE_NODE_ENV=production
   ```
7. Click "Deploy"

### Step 4: Update Backend CORS

After frontend is deployed, update Render environment variable:
```
CLIENT_URL=https://your-actual-app.vercel.app
```

Redeploy backend for changes to take effect.

---

## 🔐 Environment Variables Reference

### Backend (Render)
| Variable | Description | Example |
|----------|-------------|---------|
| NODE_ENV | Environment mode | production |
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb+srv://... |
| JWT_SECRET | Secret for JWT tokens | 64-char random string |
| JWT_EXPIRE | Token expiration | 30d |
| CLIENT_URL | Frontend URL | https://app.vercel.app |
| EMAIL_HOST | SMTP host | smtp.gmail.com |
| EMAIL_PORT | SMTP port | 587 |
| EMAIL_USER | Email address | youremail@gmail.com |
| EMAIL_PASSWORD | Gmail app password | 16-char password |

### Frontend (Vercel)
| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | https://api.onrender.com/api |
| VITE_APP_NAME | Application name | Taskager |
| VITE_NODE_ENV | Environment | production |

---

## ✅ Post-Deployment Checklist

### Backend
- [ ] Deployment successful on Render
- [ ] Health check endpoint working
- [ ] MongoDB connection successful
- [ ] CORS configured for frontend domain
- [ ] Environment variables set correctly
- [ ] SSL certificate active (automatic on Render)

### Frontend
- [ ] Deployment successful on Vercel
- [ ] Environment variables set
- [ ] Can access login page
- [ ] Can register new user
- [ ] Can create/read/update/delete tasks
- [ ] API calls working
- [ ] No CORS errors in console

### Database
- [ ] MongoDB Atlas cluster running
- [ ] IP whitelist includes Render's IPs (or use 0.0.0.0/0)
- [ ] Database user has correct permissions
- [ ] Connection string in backend env vars

---

## 🔧 Troubleshooting

### Backend Issues

**"Failed to connect to MongoDB"**
- Check MongoDB Atlas IP whitelist (add 0.0.0.0/0 for all IPs)
- Verify MONGODB_URI is correct
- Check database user permissions

**CORS Errors**
- Verify CLIENT_URL matches exact frontend URL
- Check frontend is using HTTPS
- Redeploy backend after changing CORS settings

**500 Internal Server Error**
- Check Render logs for error details
- Verify all environment variables are set
- Check JWT_SECRET is defined

### Frontend Issues

**"Failed to fetch" errors**
- Verify VITE_API_URL is correct (with /api suffix)
- Check backend is running
- Open browser DevTools → Network tab for details

**Blank page after deployment**
- Check Vercel build logs
- Verify build command is correct
- Check environment variables are set

**API calls work locally but not in production**
- Verify VITE_API_URL uses production backend URL
- Check backend CORS allows frontend domain
- Ensure environment variables are set in Vercel

---

## 📝 Updating Your App

### Backend Updates
```bash
git add .
git commit -m "Update backend"
git push origin main
```
Render will auto-deploy on push to main branch.

### Frontend Updates
```bash
git add .
git commit -m "Update frontend"
git push origin main
```
Vercel will auto-deploy on push to main branch.

---

## 🌐 Custom Domain (Optional)

### Render Custom Domain
1. Go to Settings → Custom Domain
2. Add your domain
3. Update DNS records as instructed

### Vercel Custom Domain  
1. Go to Settings → Domains
2. Add your domain  
3. Configure DNS records
4. Update backend CLIENT_URL to new domain

---

## 📊 Monitoring

### Render
- View logs: Dashboard → Logs
- View metrics: Dashboard → Metrics
- Set up health checks (automatic)

### Vercel
- View deployments: Dashboard → Deployments
- Analytics: Dashboard → Analytics
- Function logs: Dashboard → Functions

---

## 💰 Costs

### Free Tier Limits
- **Render**: 750 hours/month (1 service), sleeps after 15 min inactivity
- **Vercel**: Unlimited deployments, 100 GB bandwidth/month
- **MongoDB Atlas**: 512 MB storage (shared cluster)

### Notes:
- Render free tier services sleep after inactivity (first request ~1 min)
- Consider paid plans for production apps with traffic
- MongoDB Atlas free tier sufficient for small apps

---

## 🎉 Success!

Your app should now be live at:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://taskager-api.onrender.com

Share your Task Manager with the world! 🚀
