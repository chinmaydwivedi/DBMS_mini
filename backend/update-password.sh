#!/bin/bash

# Script to help update MySQL password in .env file

echo "🔐 MySQL Password Update Helper"
echo "================================"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    exit 1
fi

echo "Current .env configuration:"
echo "---------------------------"
grep -E "DB_HOST|DB_USER|DB_NAME|DB_PORT|DB_PASSWORD" .env | sed 's/DB_PASSWORD=.*/DB_PASSWORD=***/'
echo ""

echo "Options:"
echo "1. Update password manually"
echo "2. Test current connection"
echo "3. Reset password to empty (if no password set)"
echo ""
read -p "Choose an option (1-3): " option

case $option in
    1)
        echo ""
        echo "⚠️  To update password manually:"
        echo "1. Open .env file: nano .env (or code .env)"
        echo "2. Find the line: DB_PASSWORD=your_password"
        echo "3. Replace 'your_password' with your actual MySQL password"
        echo "4. Save the file"
        echo ""
        read -p "Press Enter to open .env file in editor..."
        ${EDITOR:-nano} .env
        echo ""
        echo "✅ .env file updated!"
        echo "Run: node test-connection.js to test the connection"
        ;;
    2)
        echo ""
        echo "Testing connection..."
        node test-connection.js
        ;;
    3)
        echo ""
        read -p "Are you sure you want to set password to empty? (y/n): " confirm
        if [ "$confirm" = "y" ]; then
            sed -i '' 's/DB_PASSWORD=.*/DB_PASSWORD=/' .env
            echo "✅ Password set to empty in .env"
            echo "Testing connection..."
            node test-connection.js
        fi
        ;;
    *)
        echo "Invalid option"
        exit 1
        ;;
esac

