
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pg;

console.log(process.env.DB_NAME)

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default pool;
