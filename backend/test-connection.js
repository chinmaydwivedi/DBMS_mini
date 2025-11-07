import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    console.log('Testing MySQL connection...');
    console.log('Host:', process.env.DB_HOST);
    console.log('User:', process.env.DB_USER);
    console.log('Database:', process.env.DB_NAME);
    console.log('Port:', process.env.DB_PORT);
    console.log('Password:', process.env.DB_PASSWORD ? '***' : 'NOT SET');
    console.log('');

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
    });

    console.log('✅ Connection successful!');
    
    // Test a simple query
    const [rows] = await connection.execute('SELECT DATABASE() as current_db');
    console.log('Current Database:', rows[0].current_db);
    
    // Check if tables exist
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`\n📊 Found ${tables.length} tables in database`);
    
    await connection.end();
    console.log('\n✅ Connection test passed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error('Error:', error.message);
    console.error('\n💡 Tips:');
    console.error('1. Check if MySQL server is running');
    console.error('2. Verify password in .env file');
    console.error('3. Check if database "flipkart_ecommerce" exists');
    console.error('4. Verify host, user, and port settings');
    process.exit(1);
  }
}

testConnection();

