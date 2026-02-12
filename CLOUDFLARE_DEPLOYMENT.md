# Deploying to Cloudflare (Pages + Workers)

This guide covers deploying both the frontend (Cloudflare Pages) and backend (Cloudflare Workers) to Cloudflare's edge network.

## 🚀 Overview

- **Frontend**: Cloudflare Pages (React + Vite)
- **Backend**: Cloudflare Workers (Hono + MongoDB)
- **Database**: MongoDB Atlas (same as before)

## Prerequisites

1. Cloudflare account (free tier works!)
2. GitHub repository with your code
3. MongoDB Atlas cluster (already configured)
4. Wrangler CLI (already installed in backend)

---

## Part 1: Deploy Backend to Cloudflare Workers

### Step 1: Install Wrangler Globally (Optional)

```bash
npm install -g wrangler
```

### Step 2: Login to Cloudflare

```bash
cd backend
wrangler login
```

This will open a browser for authentication.

### Step 3: Set Environment Secrets

**IMPORTANT**: Never commit secrets to Git. Use Wrangler to set them:

```bash
# Set MongoDB URI
wrangler secret put MONGODB_URI
# When prompted, paste: mongodb+srv://mdsayemsaif:kZNyp6hbwgF2GX4L@cluster0.qfbor5e.mongodb.net/taskager

# Set JWT Secret (use a strong random string)
wrangler secret put JWT_SECRET
# When prompted, paste a strong secret (32+ characters)

# Set Client URL (will update after frontend deployment)
wrangler secret put CLIENT_URL
# For now use: https://your-app.pages.dev

# Optional: Email credentials for verification
wrangler secret put EMAIL_USER
wrangler secret put EMAIL_PASSWORD

# Set Node environment
wrangler secret put NODE_ENV
# Enter: production
```

### Step 4: Deploy to Workers

```bash
npm run deploy
```

This will:
- Build your worker
- Upload to Cloudflare
- Provide a URL like: `https://task-manager-api.your-subdomain.workers.dev`

**Save this URL!** You'll need it for the frontend.

### Step 5: Test the Worker

```bash
curl https://task-manager-api.your-subdomain.workers.dev/api/health
```

Should return: `{"status":"OK","timestamp":"..."}`

---

## Part 2: Deploy Frontend to Cloudflare Pages

### Step 1: Create Cloudflare Pages Project

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click **Pages** in the left sidebar
3. Click **Create a project**
4. Click **Connect to Git**
5. Select your GitHub repository: `Task-Manager-`
6. Configure build settings:

**Build Configuration:**
```
Framework preset: Vite
Build command: npm run build
Build output directory: dist
Root directory: /
```

### Step 2: Set Environment Variables

In Cloudflare Pages project settings → Environment variables:

**Production:**
```
VITE_API_URL = https://task-manager-api.your-subdomain.workers.dev/api
```

Replace `task-manager-api.your-subdomain.workers.dev` with your actual Worker URL from Part 1.

### Step 3: Deploy

1. Click **Save and Deploy**
2. Cloudflare will build and deploy your site
3. You'll get a URL like: `https://task-manager-xyz.pages.dev`

### Step 4: Update Backend CLIENT_URL

Now update the backend's CLIENT_URL with your Pages URL:

```bash
cd backend
wrangler secret put CLIENT_URL
# Enter: https://task-manager-xyz.pages.dev
```

Then redeploy the worker:

```bash
npm run deploy
```

---

## Part 3: Custom Domain (Optional)

### For Frontend (Pages):

1. In Pages project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain: `taskmanager.yourdomain.com`
4. Follow DNS instructions (Cloudflare will auto-configure if domain is on Cloudflare)

### For Backend (Worker):

1. Add a route in `backend/wrangler.toml`:

```toml
[env.production]
routes = [
  { pattern = "api.yourdomain.com/*", zone_name = "yourdomain.com" }
]
```

2. Deploy: `npm run deploy:prod`

3. Update frontend .env:
```
VITE_API_URL=https://api.yourdomain.com/api
```

---

## Part 4: Deployment via GitHub (Auto-Deploy)

### Frontend Auto-Deploy

Cloudflare Pages automatically redeploys on every push to `main` branch!

### Backend Auto-Deploy (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches:
      - main
    paths:
      - 'backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: cd backend && npm ci
      
      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          workingDirectory: 'backend'
```

**Setup**:
1. Get Cloudflare API Token:
   - Dashboard → My Profile → API Tokens
   - Create Token → Edit Cloudflare Workers
   - Copy the token

2. Add to GitHub Secrets:
   - Repository → Settings → Secrets → New repository secret
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: Your API token

Now every push to `main` auto-deploys both frontend and backend!

---

## 📊 Monitoring & Logs

### Worker Logs

```bash
wrangler tail
```

Or view in Cloudflare Dashboard → Workers → Your Worker → Logs

### Pages Deployment Logs

Cloudflare Dashboard → Pages → Your Project → Deployments → View build logs

---

## 🔧 Local Development with Cloudflare

### Test Worker Locally

```bash
cd backend
npm run cf:dev
```

This runs your worker locally at `http://localhost:8787`

### Test with Local Frontend

Update `.env`:
```
VITE_API_URL=http://localhost:8787/api
```

Then run:
```bash
npm run dev
```

---

## 🚨 Troubleshooting

### Worker Deployment Fails

**Error**: "Authentication error"
```bash
wrangler logout
wrangler login
```

**Error**: "Module not found"
- Check `wrangler.toml` has `node_compat = true`
- Verify `worker.js` exists in backend folder

### Frontend Build Fails

**Error**: "VITE_API_URL is undefined"
- Set environment variable in Cloudflare Pages dashboard
- Wait 1-2 minutes after setting variables

### CORS Errors

- Ensure backend CLIENT_URL matches frontend URL exactly
- Check worker logs: `wrangler tail`

### MongoDB Connection Issues

**Error**: "Connection timeout"
- Verify MongoDB Atlas allows connections from `0.0.0.0/0`
- Check MONGODB_URI is correct in worker secrets
- MongoDB Atlas → Network Access → Allow access from anywhere

### API Returns 401 Unauthorized

- Check JWT_SECRET is set in worker: `wrangler secret list`
- Verify token is being sent in Authorization header
- Check worker logs for JWT errors

---

## 💰 Pricing

### Cloudflare Pages (Frontend)
- **Free Tier**: 500 builds/month, unlimited requests
- **Paid**: $20/month for 5,000 builds/month

### Cloudflare Workers (Backend)
- **Free Tier**: 100,000 requests/day, 10ms CPU time per request
- **Paid**: $5/month for 10M requests, 50ms CPU time

### MongoDB Atlas
- **Free Tier**: 512MB storage, shared cluster
- **Paid**: From $9/month for dedicated clusters

Your app will work perfectly on **100% free tier**! 🎉

---

## 🔐 Security Best Practices

1. **Never commit secrets**
   - Use `wrangler secret` for all sensitive data
   - Keep `.env` in `.gitignore`

2. **Use strong JWT secret**
   - Generate: `openssl rand -base64 32`

3. **Enable 2FA on Cloudflare**
   - Dashboard → My Profile → Authentication

4. **Restrict MongoDB access**
   - Consider IP whitelisting instead of 0.0.0.0/0

5. **Use custom domains with HTTPS**
   - Cloudflare provides free SSL certificates

---

## 📚 Useful Commands

```bash
# Backend (Cloudflare Workers)
wrangler login              # Authenticate
wrangler whoami             # Check logged in user
wrangler dev                # Run locally
wrangler deploy             # Deploy to production
wrangler tail               # Stream logs
wrangler secret list        # List secrets (not values)
wrangler secret put <KEY>   # Set a secret
wrangler secret delete <KEY> # Remove a secret

# Frontend (Cloudflare Pages)
# All done via GitHub or Dashboard
# Just push to main branch!
```

---

## 🎯 Quick Start Summary

1. **Backend**: `cd backend` → `wrangler login` → Set secrets → `npm run deploy`
2. **Frontend**: Connect GitHub repo to Cloudflare Pages → Set `VITE_API_URL` → Deploy
3. **Update**: Set `CLIENT_URL` in worker → Redeploy worker
4. **Test**: Visit your Pages URL and create a task!

---

## 📞 Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare Discord](https://discord.cloudflare.com)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)

---

**🎉 Congratulations!** Your Task Manager is now running on Cloudflare's global edge network with blazing-fast performance!
