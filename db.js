import mysql from 'mysql2/promise';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    ca: fs.readFileSync(process.env.DB_SSL_CA_PATH),
    rejectUnauthorized: true
  }
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully to Avien');
    connection.release();
  } catch (error) {
    console.error('Database connection to Avien failed:', error);
  }
}

testConnection();

export default pool;
