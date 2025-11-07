# Debugging Blank Page Issue

## Quick Checks

### 1. Check Browser Console
Open browser DevTools (F12) and check the Console tab for errors.

### 2. Check Network Tab
- Open DevTools → Network tab
- Refresh the page
- Check if API calls are failing (red status)
- Look for CORS errors

### 3. Test Simple Page
Visit: http://localhost:3000/test
- If this works, React is fine, issue is with main page
- If this is blank too, there's a React setup issue

### 4. Check if Backend is Running
```bash
curl http://localhost:5000/api/health
```

Should return: `{"status":"OK",...}`

### 5. Check API Endpoints
```bash
curl http://localhost:5000/api/products
curl http://localhost:5000/api/categories
```

## Common Issues & Fixes

### Issue 1: CORS Error
**Symptom:** Console shows "CORS policy" error

**Fix:** Backend CORS is already configured, but verify:
- Backend is running on port 5000
- Frontend proxy is configured in `vite.config.ts`

### Issue 2: API Connection Failed
**Symptom:** Network tab shows failed requests to `/api/*`

**Fix:** 
- Check backend is running: `curl http://localhost:5000/api/health`
- Restart backend: `cd backend && npm run dev`

### Issue 3: JavaScript Errors
**Symptom:** Console shows red errors

**Fix:**
- Check browser console for specific error
- Common: Missing imports, undefined variables
- Restart frontend dev server

### Issue 4: Tailwind CSS Not Loading
**Symptom:** Page loads but no styling

**Fix:**
- Check `index.css` is imported in `main.tsx`
- Verify Tailwind config is correct
- Restart dev server

## Step-by-Step Debugging

1. **Open Browser Console:**
   - Press F12 or Right-click → Inspect
   - Go to Console tab
   - Look for red errors

2. **Check Network Requests:**
   - Go to Network tab
   - Refresh page
   - Check if `/api/products` and `/api/categories` return 200 OK

3. **Test Backend Directly:**
   ```bash
   curl http://localhost:5000/api/products | head -20
   ```

4. **Restart Servers:**
   ```bash
   # Stop both servers (Ctrl+C)
   # Then restart:
   npm run dev
   ```

5. **Clear Browser Cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or clear browser cache

## Quick Test Commands

```bash
# Test backend
curl http://localhost:5000/api/health

# Test products API
curl http://localhost:5000/api/products

# Test categories API
curl http://localhost:5000/api/categories

# Check if frontend is serving
curl http://localhost:3000
```

## If Still Blank

1. Check browser console for specific errors
2. Verify both servers are running
3. Try accessing http://localhost:3000/test (simple test page)
4. Check if port 3000 is already in use
5. Restart both servers completely

