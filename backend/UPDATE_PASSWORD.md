# How to Update MySQL Password in .env File

## Method 1: If You Know Your Current Password

### Step 1: Test Current Connection
Try connecting with your current password first:

```bash
mysql -u root -p
# Enter your password when prompted
```

### Step 2: Update .env File
If connection works, update the `.env` file:

```bash
cd backend
nano .env
# or
code .env
```

Change this line:
```env
DB_PASSWORD=your_password
```

To your actual password:
```env
DB_PASSWORD=your_actual_password_here
```

## Method 2: Reset MySQL Root Password (If You Forgot It)

### For macOS:

1. **Stop MySQL Server:**
   ```bash
   sudo /usr/local/mysql/support-files/mysql.server stop
   # OR if installed via Homebrew:
   brew services stop mysql
   ```

2. **Start MySQL in Safe Mode:**
   ```bash
   sudo mysqld_safe --skip-grant-tables
   ```

3. **Connect to MySQL (in a new terminal):**
   ```bash
   mysql -u root
   ```

4. **Reset Password:**
   ```sql
   USE mysql;
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_new_password';
   FLUSH PRIVILEGES;
   EXIT;
   ```

5. **Restart MySQL Normally:**
   ```bash
   sudo /usr/local/mysql/support-files/mysql.server start
   # OR
   brew services start mysql
   ```

6. **Test New Password:**
   ```bash
   mysql -u root -p
   # Enter your new password
   ```

7. **Update .env File:**
   ```env
   DB_PASSWORD=your_new_password
   ```

## Method 3: Using MySQL Workbench

1. **Open MySQL Workbench**
2. **Go to:** Server → Users and Privileges
3. **Select:** root user
4. **Click:** Change Password
5. **Enter:** New password
6. **Click:** Apply
7. **Update .env file** with the new password

## Method 4: Check if Password is Empty

Some MySQL installations have an empty root password by default:

```bash
# Try connecting without password
mysql -u root

# If that works, update .env:
DB_PASSWORD=
```

## Quick Test Script

After updating the password, test the connection:

```bash
cd backend
node -e "
import('mysql2/promise').then(mysql => {
  const pool = mysql.createPool({
    host: 'Chinmays-M2.local',
    user: 'root',
    password: 'YOUR_PASSWORD_HERE',
    database: 'flipkart_ecommerce',
    port: 3306
  });
  pool.getConnection().then(conn => {
    console.log('✅ Connection successful!');
    conn.release();
    process.exit(0);
  }).catch(err => {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  });
});
"
```

## Update .env File

Once you have your password, update the `.env` file:

**Location:** `/Users/chinmaydwivedi/Documents/DBMS_MINI/backend/.env`

**Edit this line:**
```env
DB_PASSWORD=your_password
```

**To:**
```env
DB_PASSWORD=your_actual_mysql_password
```

## Verify Connection

After updating, test the backend:

```bash
cd backend
npm install  # Install dependencies if needed
npm run dev  # Start server
```

You should see:
```
✅ Database connected successfully
🚀 Server running on http://localhost:5000
```

If you see an error, the password might be incorrect.

