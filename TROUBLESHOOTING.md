# Troubleshooting Blank Page

## ✅ Current Status
- ✅ Backend API: **WORKING** (http://localhost:5000)
- ✅ Database: **CONNECTED** (26 tables found)
- ✅ Frontend Server: **RUNNING** (http://localhost:3000)

## 🔍 Debugging Steps

### Step 1: Check Browser Console
1. Open http://localhost:3000
2. Press **F12** (or Right-click → Inspect)
3. Go to **Console** tab
4. Look for **red errors**

**Common Errors:**
- `Failed to fetch` → Backend not running or CORS issue
- `Cannot read property` → JavaScript error in components
- `Module not found` → Missing import

### Step 2: Check Network Tab
1. Open DevTools → **Network** tab
2. Refresh the page
3. Check if these requests succeed:
   - `/api/products/featured` → Should return 200 OK
   - `/api/categories` → Should return 200 OK
   - `/api/flash-deals` → Should return 200 OK

### Step 3: Test Simple Page
Visit: **http://localhost:3000/test**

- ✅ If test page works → Issue is with main page components
- ❌ If test page is blank → React setup issue

### Step 4: Verify Backend
```bash
# Test backend health
curl http://localhost:5000/api/health

# Test products
curl http://localhost:5000/api/products/featured

# Test categories  
curl http://localhost:5000/api/categories
```

## 🛠️ Quick Fixes

### Fix 1: Restart Servers
```bash
# Stop all servers (Ctrl+C in terminals)
# Then restart:
cd /Users/chinmaydwivedi/Documents/DBMS_MINI
npm run dev
```

### Fix 2: Clear Browser Cache
- **Hard Refresh:** `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or clear browser cache completely

### Fix 3: Check Port Conflicts
```bash
# Check if ports are in use
lsof -ti:3000
lsof -ti:5000

# Kill processes if needed
kill -9 <PID>
```

### Fix 4: Reinstall Dependencies
```bash
# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd ../backend
rm -rf node_modules package-lock.json
npm install
```

## 📋 What to Check

1. **Browser Console Errors** - Most important!
2. **Network Tab** - Are API calls failing?
3. **Backend Logs** - Check terminal where backend is running
4. **Frontend Logs** - Check terminal where frontend is running

## 🎯 Most Likely Issues

### Issue 1: API Calls Failing
**Symptom:** Network tab shows failed `/api/*` requests

**Solution:**
- Verify backend is running: `curl http://localhost:5000/api/health`
- Check CORS is enabled in backend
- Verify proxy in `vite.config.ts`

### Issue 2: JavaScript Error
**Symptom:** Console shows red error messages

**Solution:**
- Check the specific error message
- Common: Missing imports, undefined variables
- Restart frontend dev server

### Issue 3: CORS Error
**Symptom:** Console shows "CORS policy" error

**Solution:**
- Backend already has CORS enabled
- Verify backend is running on port 5000
- Check `vite.config.ts` proxy configuration

## 🚀 Quick Test

Run these commands to verify everything:

```bash
# 1. Test backend
curl http://localhost:5000/api/health

# 2. Test products API
curl http://localhost:5000/api/products/featured

# 3. Test categories API
curl http://localhost:5000/api/categories

# 4. Check frontend
curl http://localhost:3000
```

## 📞 Next Steps

1. **Open browser console** and check for errors
2. **Share the error message** you see
3. **Check Network tab** for failed requests
4. **Try the test page:** http://localhost:3000/test

---

**Need more help?** Share the browser console error message!

