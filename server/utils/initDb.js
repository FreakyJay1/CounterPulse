const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 5432;

const client = new Client({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASS,
  port: DB_PORT,
});

async function tableExists(tableName) {
  const res = await client.query(
    `SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = $1
    ) AS exists;`,
    [tableName]
  );
  return res.rows[0].exists;
}

async function runInitSql() {
  const sqlPath = path.resolve(__dirname, '../../database/init.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  await client.query(sql);
}

async function initDb() {
  try {
    await client.connect();
    const hasUsers = await tableExists('users');
    if (!hasUsers) {
      console.log('Initializing database schema from init.sql...');
      await runInitSql();
      console.log('Database schema initialized.');
    } else {
      console.log('Database schema already exists.');
    }
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

module.exports = initDb;

