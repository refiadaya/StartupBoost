# 🔑 How to Get Your FREE Gemini API Key

## For Teammates & Judges

This project uses Google's Gemini AI, which is **100% FREE** with generous limits.

### Setup Steps (Takes 2 minutes):

1. **Go to Google AI Studio:**
   - Visit: https://aistudio.google.com/app/apikey
   - Sign in with any Google account

2. **Create API Key:**
   - Click "Create API Key"
   - Select "Create API key in new project" (or existing)
   - Copy the key (starts with `AIza...`)

3. **Add to Project:**
   - Create a file called `.env` in the project root
   - Add this line:
     ```
     GEMINI_API_KEY=AIzaYourKeyHere
     ```
   - Save the file

4. **Start the server:**
   ```bash
   npm install
   npm start
   ```

5. **Test it works:**
   - Open http://localhost:3000
   - Analyze any website
   - You should see AI scores appear!

### ✅ Verification
If the API key works, you'll see:
- `aiAnalysis.success: true` in responses
- AI insights and suggestions for each criterion
- Consistent scores (temperature=0 ensures same URL = same score)

### ⚠️ Limits (FREE Tier)
- 15 requests per minute
- 1,500 requests per day
- **More than enough for hackathon demos and judging!**

### 🚨 Troubleshooting
**Error: "API key not configured"**
- Make sure `.env` file is in the root folder (same level as `package.json`)
- Make sure the line starts with `GEMINI_API_KEY=` (no spaces)
- Restart the server after creating `.env`

**Error: "Invalid API key"**
- Get a fresh key from https://aistudio.google.com/app/apikey
- Make sure you copied the entire key

---

## Why We Don't Include the Key in GitHub

- **Security**: API keys should never be committed to public repos
- **Best Practice**: Each user gets their own key (tracks their usage)
- **Free Tier**: Everyone can get their own free key in 2 minutes

## For Hackathon Judges

You can evaluate this project in 2 ways:

1. **With AI (Recommended)**: Get a free key (2 min setup) - See full hybrid analysis
2. **Without AI**: System still works! Falls back to technical scoring only

The system has **graceful degradation** - it works without AI but is much more powerful with it.
