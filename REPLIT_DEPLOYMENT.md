# Replit Backend Deployment Guide 🚀

## Step-by-Step: Deploy Backend to Replit

**Time Required**: 10 minutes  
**Cost**: $0 (No card required!)

---

## Step 1: Sign Up for Replit

1. Go to [https://replit.com](https://replit.com)
2. Click **"Sign Up"**
3. Choose one of these options:
   - Sign up with **GitHub** (recommended - easiest for importing)
   - Sign up with **Google**
   - Or use email

4. Complete the signup process

---

## Step 2: Import Your GitHub Repository

1. Once logged in, click the **"+"** button or **"Create Repl"**

2. Select **"Import from GitHub"** tab

3. Click **"Connect GitHub Account"** if not already connected
   - Grant Replit access to your repositories

4. Find and select your repository:
   - Repository: `SrishtiPandey0714/agentic-rfp-platform`
   - Click **"Import from GitHub"**

5. Wait for Replit to import your code (~30 seconds)

---

## Step 3: Configure the Repl

1. **Language**: Should auto-detect as **Python**

2. You'll see your project files on the left sidebar

3. Replit will detect `requirements.txt` and may ask to install dependencies
   - Click **"Yes"** or **"Install packages"**
   - Wait for installation to complete

---

## Step 4: Set Environment Variables

1. In the left sidebar, click on **"Secrets"** (lock icon) or **"Tools"** → **"Secrets"**

2. Click **"+ New Secret"**

3. Add your API key:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `AIzaSyDafo_VGv9Ip14MuurrWgGW-s4M5YAdjgo`

4. Click **"Add new secret"**

---

## Step 5: Configure Run Command

1. Look for the **".replit"** file (already created for you)

2. Or click **"Configure Run"** button at the top

3. Make sure the run command is:
   ```bash
   cd backend && uvicorn api.main:app --host 0.0.0.0 --port 8000
   ```

---

## Step 6: Run Your Backend!

1. Click the big **"Run"** button at the top

2. Wait for the server to start (~15-30 seconds)

3. You should see output like:
   ```
   INFO:     Started server process
   INFO:     Uvicorn running on http://0.0.0.0:8000
   ```

4. Replit will show a **preview window** on the right with your API

---

## Step 7: Get Your Backend URL

Once running, you'll get a URL like:
```
https://your-project-name.username.repl.co
```

**⚠️ IMPORTANT**: Copy this URL - you'll need it for the frontend!

---

## Step 8: Test Your Backend

1. In the preview window, you should see JSON: `{"status": "ok"}`

2. Or test in a new browser tab:
   ```
   https://your-repl-url.repl.co/
   ```

3. Expected response:
   ```json
   {"status": "ok"}
   ```

✅ **Backend is live on Replit!**

---

## Step 9: Keep It Running (Important!)

**Replit Free Tier Behavior**:
- Apps sleep after 1 hour of inactivity
- Wake up automatically on first request (~5-10 seconds)

**To Keep Running 24/7** (Optional):
- Upgrade to Replit **Hacker Plan** ($7/month)
- Or use a free uptime monitor like [UptimeRobot](https://uptimerobot.com) to ping your app every 5 minutes

---

## Troubleshooting

### Issue: Module Not Found Error

**Solution**: 
1. Open Shell (bottom panel)
2. Run:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

### Issue: Port Already in Use

**Solution**: 
1. Click **"Stop"** button
2. Click **"Run"** again

### Issue: "GEMINI_API_KEY not found"

**Solution**:
1. Check Secrets tab has the API key
2. Stop and restart the Repl

---

## Next: Deploy Frontend to Vercel

Now that your backend is running on Replit, we'll:
1. Deploy frontend to Vercel
2. Connect frontend to your Replit backend URL
3. Test the complete application!

**Ready to continue?**
