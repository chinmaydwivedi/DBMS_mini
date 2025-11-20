# Button Functionality Test Guide

## ✅ Buttons That Should Be Working

### 1. **Product Card Buttons**
- **Add to Cart** - Should add product to cart with toast notification
- **Wishlist (Heart icon)** - Should toggle wishlist status
- Location: Homepage, Products page

### 2. **Cart Page Buttons**
- **Quantity +/-** - Should update item quantity
- **Remove Item (Trash icon)** - Should delete item from cart
- **Apply Coupon** - Should validate and apply coupon code
- **Proceed to Checkout** - Should navigate to `/checkout`

### 3. **Checkout Page Buttons**
- **Select Address** - Should select shipping/billing address
- **Add New Address** - Should show address form
- **Place Order** - Should create order and navigate to orders page

### 4. **Profile Page Buttons**
- **My Orders** - Navigate to orders
- **Wishlist** - Navigate to wishlist
- **Returns** - Navigate to returns
- **Support** - Navigate to support

### 5. **Membership Page Buttons**
- **Subscribe Now** - Should create/upgrade membership
- **Cancel Membership** - Should cancel active membership
- **Monthly/Yearly toggle** - Should change billing cycle display

### 6. **Admin Dashboard Buttons**
- **Confirm Order** - Should confirm pending order and create payment/delivery records
- **Process/Ship/Deliver** - Should update order status
- **Update Delivery** - Should add tracking information
- **Verify Membership** - Should activate membership
- **Extend Membership** - Should extend end date
- **Update Membership Status** - Should change status (Suspend/Cancel/Reactivate)

### 7. **Support Page Buttons**
- **Create New Ticket** - Should show form
- **Submit Ticket** - Should create support ticket

### 8. **Navbar Buttons**
- **Cart Icon** - Navigate to cart
- **Wishlist Icon** - Navigate to wishlist
- **Profile Icon** - Navigate to profile
- **Search** - Search products

## 🔧 Common Button Issues & Fixes

### Issue 1: Button Not Responding
**Possible Causes:**
- Missing `onClick` handler
- Button is `disabled`
- JavaScript error in handler function
- API endpoint not working

**How to Check:**
1. Open browser DevTools (F12)
2. Click the button
3. Check Console tab for errors
4. Check Network tab for failed API calls

### Issue 2: Button Works But No Visual Feedback
**Possible Causes:**
- Missing loading state
- No toast notification
- State not updating

**Fix:**
- Check if component has loading state management
- Verify toast is imported and working
- Check if data is being refreshed after action

### Issue 3: Navigation Buttons Not Working
**Possible Causes:**
- Missing or incorrect route in App.tsx
- Missing `useNavigate` hook
- Link component not properly imported

**Fix:**
- Verify route exists in `frontend/src/App.tsx`
- Check import: `import { useNavigate } from "react-router-dom"`

## 🧪 Quick Test Commands

```bash
# Test Add to Cart API
curl -X POST http://localhost:5000/api/cart/1/add \
  -H "Content-Type: application/json" \
  -d '{"product_id":1,"quantity":1}'

# Test Wishlist API
curl -X POST http://localhost:5000/api/wishlist/1/add \
  -H "Content-Type: application/json" \
  -d '{"product_id":1}'

# Test Order Confirmation API
curl -X POST http://localhost:5000/api/admin/orders/1/confirm \
  -H "Content-Type: application/json" \
  -d '{}'

# Test Membership Subscribe API
curl -X POST http://localhost:5000/api/membership/subscribe \
  -H "Content-Type: application/json" \
  -d '{"user_id":1,"plan_id":2,"billing_cycle":"Monthly"}'
```

## 📝 Reporting Button Issues

When reporting a button not working, please provide:
1. **Which button** (page + button name)
2. **Expected behavior** (what should happen)
3. **Actual behavior** (what actually happens)
4. **Console errors** (from browser DevTools)
5. **Steps to reproduce**

Example:
```
Button: "Add to Cart" on Homepage
Expected: Product added to cart, see toast notification
Actual: Nothing happens
Console Error: "TypeError: cartAPI.add is not a function"
Steps: 1. Go to homepage, 2. Click "Add to Cart" on first product
```
