# Cloud Deployment Guide

## 🚀 Quick Start - Deploy in 15 Minutes

This guide walks you through deploying your Agentic RFP Platform to the cloud using **Vercel** (frontend) and **Render** (backend).

---

## Prerequisites

✅ GitHub account  
✅ Vercel account (sign up at [vercel.com](https://vercel.com))  
✅ Render account (sign up at [render.com](https://render.com))  
✅ Your `GEMINI_API_KEY` ready

---

## Part 1: Deploy Backend to Render (10 min)

### Step 1: Push to GitHub

Ensure your latest code is on GitHub:

```bash
git add .
git commit -m "Add cloud deployment configuration"
git push origin main
```

### Step 2: Create Render Service

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `SrishtiPandey0714/agentic-rfp-platform`
4. Configure the service:

   | Field | Value |
   |-------|-------|
   | **Name** | `agentic-rfp-backend` |
   | **Region** | Choose closest to you |
   | **Branch** | `main` |
   | **Root Directory** | `backend` |
   | **Runtime** | `Python 3` |
   | **Build Command** | `pip install -r requirements.txt` |
   | **Start Command** | `uvicorn api.main:app --host 0.0.0.0 --port $PORT` |

5. Click **"Advanced"** → Add Environment Variable:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `AIzaSyDafo_VGv9Ip14MuurrWgGW-s4M5YAdjgo`

6. Select **Free** plan
7. Click **"Create Web Service"**

### Step 3: Wait for Deploy

- Render will build and deploy your backend (~5 min)
- Once deployed, you'll get a URL like: `https://agentic-rfp-backend.onrender.com`
- **Copy this URL** - you'll need it for frontend deployment

### Step 4: Test Backend

Visit: `https://your-backend-url.onrender.com/`

You should see: `{"status": "ok"}`

---

## Part 2: Deploy Frontend to Vercel (5 min)

### Step 1: Create Vercel Project

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository: `SrishtiPandey0714/agentic-rfp-platform`
4. Configure project:

   | Field | Value |
   |-------|-------|
   | **Framework Preset** | Next.js |
   | **Root Directory** | `rfp-frontend` |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `.next` |

### Step 2: Add Environment Variables

In the **Environment Variables** section, add:

- **Key**: `NEXT_PUBLIC_API_URL`
- **Value**: `https://your-backend-url.onrender.com` (from Step 3 above)

### Step 3: Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy (~3 min)
3. You'll get a URL like: `https://your-project.vercel.app`

---

## Part 3: Verify Deployment ✅

### Test 1: Backend Health Check

```bash
curl https://your-backend-url.onrender.com/
```

Expected: `{"status": "ok"}`

### Test 2: Frontend Access

1. Visit your Vercel URL: `https://your-project.vercel.app`
2. You should see the RFP platform dashboard
3. Check browser console (F12) - should be no CORS errors

### Test 3: Full Workflow

1. Navigate to **Main Agent** page
2. Click **"Scan RFP Sources"**
3. Verify technical analysis appears
4. Check **Technical Agent**, **Sales Agent**, **Pricing Agent** pages
5. Confirm AI insights are working

---

## 🎉 Success!

Your application is now live:

- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-backend-url.onrender.com`

---

## Troubleshooting

### Issue: CORS Errors

**Solution**: Update `backend/api/main.py` CORS settings to include your Vercel URL:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-project.vercel.app"  # Add this
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Then commit and push - Render will auto-redeploy.

### Issue: Backend Build Fails

**Check**:
- `backend/requirements.txt` exists
- All Python dependencies are listed
- Python version is 3.11

### Issue: Frontend Can't Connect to Backend

**Check**:
- `NEXT_PUBLIC_API_URL` environment variable in Vercel is correct
- Backend URL ends without trailing slash
- Backend health check returns `{"status": "ok"}`

### Issue: Render Free Tier Spins Down

**Note**: Render free tier sleeps after 15 min of inactivity. First request may take 30-60 seconds to wake up. This is normal.

---

## Updating Your Deployment

### Update Backend

```bash
git add backend/
git commit -m "Update backend"
git push origin main
```

Render auto-deploys on push to `main` branch.

### Update Frontend

```bash
git add rfp-frontend/
git commit -m "Update frontend"
git push origin main
```

Vercel auto-deploys on push to `main` branch.

---

## Environment Variables Reference

### Backend (Render)

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key for AI features | Yes |
| `PORT` | Port number (auto-set by Render) | Auto |

### Frontend (Vercel)

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL from Render | Yes |

---

## Cost Breakdown

Both platforms offer free tiers:

- **Vercel Free**: 
  - 100GB bandwidth/month
  - Unlimited deployments
  - Perfect for this project

- **Render Free**:
  - 750 hours/month (enough for 24/7)
  - Spins down after 15 min inactivity
  - 512MB RAM
  - Auto-wakes on request

**Total Cost**: $0/month for development and moderate usage

---

## Next Steps

1. Set up custom domain (optional)
2. Configure automatic deployment on PR
3. Set up monitoring/logging
4. Add database for persistent storage (currently file-based)

Need help? Check the troubleshooting section or reach out!
