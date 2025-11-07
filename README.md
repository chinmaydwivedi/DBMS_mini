# Flipkart E-Commerce Clone - Full Stack Application

A complete e-commerce platform built with React, Node.js, Express, and MySQL, inspired by Flipkart.

## Features

- 🛍️ **Product Browsing** - Browse products with filters (category, brand, price, rating)
- 🔥 **Flash Deals** - Limited time offers with countdown timer
- 🛒 **Shopping Cart** - Add, update, and remove items
- ❤️ **Wishlist** - Save products for later
- 📦 **Order Management** - Track orders and view order history
- 💳 **Coupons** - Apply discount coupons
- ⭐ **Reviews & Ratings** - Product reviews and ratings
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Modern UI** - Beautiful Flipkart-inspired design

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite
- React Router
- Tailwind CSS
- Lucide React Icons
- Axios

### Backend
- Node.js
- Express.js
- MySQL2
- CORS

### Database
- MySQL 8.0+
- 20+ tables with proper relationships
- Triggers, Stored Procedures, Functions
- Views for reporting

## Project Structure

```
DBMS_MINI/
├── backend/          # Express API server
│   ├── routes/       # API route handlers
│   ├── db.js         # Database connection
│   └── server.js     # Main server file
├── frontend/         # React application
│   └── src/
│       ├── components/  # React components
│       ├── pages/       # Page components
│       └── lib/         # API client & utilities
├── database/         # SQL schema and scripts
└── README.md         # This file
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### 1. Database Setup

1. Create the database using the provided SQL schema:
```bash
mysql -u root -p < database/01_complete_schema.sql
```

2. Insert sample data:
```bash
mysql -u root -p < database/02_sample_data.sql
```

3. Create triggers, procedures, and functions:
```bash
mysql -u root -p < database/04_triggers.sql
mysql -u root -p < database/05_procedures_functions.sql
```

### 2. Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=flipkart_ecommerce
DB_PORT=3306
PORT=5000
```

4. Start the server:
```bash
npm run dev
```

The backend will run on http://localhost:5000

### 3. Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on http://localhost:3000

### 4. Run Both Servers

From the root directory:
```bash
npm run dev
```

This will start both backend and frontend servers concurrently.

## API Endpoints

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/bestsellers` - Get bestseller products
- `GET /api/products/:id` - Get product by ID

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID

### Cart
- `GET /api/cart/:userId` - Get user's cart
- `POST /api/cart/:userId/add` - Add item to cart
- `PUT /api/cart/:userId/update` - Update cart item
- `DELETE /api/cart/:userId/remove/:itemId` - Remove item from cart

### Wishlist
- `GET /api/wishlist/:userId` - Get user's wishlist
- `POST /api/wishlist/:userId/add` - Add item to wishlist
- `DELETE /api/wishlist/:userId/remove/:productId` - Remove item from wishlist

### Orders
- `GET /api/orders/user/:userId` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order

### Flash Deals
- `GET /api/flash-deals` - Get all active flash deals
- `GET /api/flash-deals/:id` - Get flash deal by ID

### Coupons
- `GET /api/coupons` - Get all active coupons
- `POST /api/coupons/validate` - Validate coupon code

### Reviews
- `GET /api/reviews/product/:productId` - Get reviews for a product
- `POST /api/reviews` - Add a review

## Database Features

- **20+ Tables** - Complete e-commerce schema
- **8 Triggers** - Auto-create cart/wishlist, update ratings, etc.
- **6 Stored Procedures** - Place orders, get reports, etc.
- **5 Functions** - Calculate loyalty tier, discounts, etc.
- **8 Views** - Reporting views
- **5 User Roles** - Admin, Seller, Customer, Analyst, Support

## Screenshots

[Add screenshots of your application here]

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is for educational purposes.

## Team Members

- [Student Name 1] - [Student ID]
- [Student Name 2] - [Student ID]

---

**Note:** Make sure MySQL is running before starting the backend server. Update the `.env` file with your MySQL credentials.
