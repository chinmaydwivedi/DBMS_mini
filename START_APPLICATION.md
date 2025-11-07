# How to Start the Application

## ✅ Database Connection Status

Your database connection is **WORKING**! 
- ✅ Connected to: `Chinmays-M2.local`
- ✅ Database: `flipkart_ecommerce`
- ✅ Found: 26 tables

## 🚀 Starting the Application

### Option 1: Start Both Servers (Recommended)

From the **root directory** (`DBMS_MINI/`):

```bash
npm run dev
```

This will start both backend and frontend servers simultaneously.

### Option 2: Start Servers Separately

#### Terminal 1 - Backend Server:
```bash
cd backend
npm run dev
```

You should see:
```
✅ Database connected successfully
🚀 Server running on http://localhost:5000
📊 Database: flipkart_ecommerce
```

#### Terminal 2 - Frontend Server:
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

## 🌐 Access the Application

Once both servers are running:

- **Frontend (UI):** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

## 📋 Quick Commands

### Test Database Connection:
```bash
cd backend
node test-connection.js
```

### Start Backend Only:
```bash
cd backend
npm run dev
```

### Start Frontend Only:
```bash
cd frontend
npm run dev
```

### Install All Dependencies:
```bash
# From root directory
npm run install:all
```

## 🔍 Verify Everything is Working

1. **Check Backend:**
   ```bash
   curl http://localhost:5000/api/health
   ```
   Should return: `{"status":"OK","message":"Server is running",...}`

2. **Check Frontend:**
   - Open browser: http://localhost:3000
   - You should see the ShopKart homepage

3. **Test API Endpoints:**
   - Products: http://localhost:5000/api/products
   - Categories: http://localhost:5000/api/categories
   - Flash Deals: http://localhost:5000/api/flash-deals

## ⚠️ Troubleshooting

### Backend won't start:
- Check if port 5000 is already in use
- Verify MySQL is running
- Check `.env` file has correct password

### Frontend won't start:
- Check if port 3000 is already in use
- Make sure backend is running first
- Try: `npm install` in frontend directory

### Database connection errors:
- Run: `node backend/test-connection.js`
- Verify MySQL server is running
- Check password in `backend/.env`

## 🎉 You're All Set!

Your application is ready to run. Start with:
```bash
npm run dev
```

Then open http://localhost:3000 in your browser!

