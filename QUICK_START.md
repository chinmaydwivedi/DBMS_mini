# 🚀 Quick Start Guide

## ✅ Your Setup is Ready!

- ✅ Database connection: **WORKING**
- ✅ Password: **CONFIGURED**
- ✅ Dependencies: **INSTALLED**
- ✅ 26 tables found in database

## 🎯 Start the Application (Choose One Method)

### Method 1: Start Both Servers at Once (Easiest)

```bash
cd /Users/chinmaydwivedi/Documents/DBMS_MINI
npm run dev
```

This starts both backend and frontend automatically!

### Method 2: Start Servers Separately

**Terminal 1 - Backend:**
```bash
cd /Users/chinmaydwivedi/Documents/DBMS_MINI/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd /Users/chinmaydwivedi/Documents/DBMS_MINI/frontend
npm run dev
```

## 🌐 Access Your Application

Once servers are running:

- **🖥️ Frontend (UI):** http://localhost:3000
- **🔌 Backend API:** http://localhost:5000
- **❤️ Health Check:** http://localhost:5000/api/health

## 📊 What You'll See

### Backend Console:
```
✅ Database connected successfully
🚀 Server running on http://localhost:5000
📊 Database: flipkart_ecommerce
```

### Frontend Console:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
```

## 🧪 Test Your Setup

### 1. Test Database Connection:
```bash
cd backend
node test-connection.js
```

### 2. Test Backend API:
```bash
curl http://localhost:5000/api/health
```

### 3. Test Products API:
```bash
curl http://localhost:5000/api/products
```

## 🎉 You're Ready!

Just run:
```bash
npm run dev
```

Then open **http://localhost:3000** in your browser!

---

**Need Help?** Check `START_APPLICATION.md` for detailed instructions.

