# How to Fix Blank Page - Step by Step

## 🔍 Step 1: Check Browser Console (MOST IMPORTANT!)

1. Open http://localhost:3000 in your browser
2. Press **F12** (or Right-click → Inspect)
3. Click on **Console** tab
4. **Look for red error messages**

**What to look for:**
- Red error text
- Failed network requests
- "Cannot read property" errors
- "Module not found" errors

**Share the error message you see!**

## 🔍 Step 2: Check Network Tab

1. In DevTools, click **Network** tab
2. Refresh the page (F5)
3. Look for requests to `/api/*`
4. Check if they show:
   - ✅ **200 OK** (green) = Working
   - ❌ **Failed** (red) = Problem

## 🔍 Step 3: Test Backend

Open a new terminal and run:
```bash
curl http://localhost:5000/api/health
curl http://localhost:5000/api/products/featured
```

Should return JSON data, not errors.

## 🔍 Step 4: Test Simple Page

Visit: **http://localhost:3000/test**

- If this page shows content → React is working, issue is with main page
- If this page is also blank → React setup issue

## 🛠️ Quick Fixes

### Fix 1: Hard Refresh
- **Mac:** Cmd + Shift + R
- **Windows:** Ctrl + Shift + R

### Fix 2: Restart Servers
```bash
# Stop both servers (Ctrl+C)
# Then restart:
cd /Users/chinmaydwivedi/Documents/DBMS_MINI
npm run dev
```

### Fix 3: Clear Browser Cache
- Chrome: Settings → Privacy → Clear browsing data
- Or use Incognito/Private window

## 📋 Common Issues

### Issue: "Failed to fetch" in console
**Solution:** Backend not running or CORS issue
- Check: `curl http://localhost:5000/api/health`
- Restart backend if needed

### Issue: "Cannot read property of undefined"
**Solution:** API response structure issue
- Check Network tab for actual API response
- Verify API is returning expected data

### Issue: White/blank page with no errors
**Solution:** React not rendering
- Check if test page works: http://localhost:3000/test
- Verify React is installed: `npm list react`

## 🎯 What I Need From You

1. **Browser Console Error** - Copy the red error message
2. **Network Tab Status** - Are API calls 200 OK or failed?
3. **Test Page Result** - Does http://localhost:3000/test work?

---

**Most likely:** There's a JavaScript error in the browser console. Check that first!

