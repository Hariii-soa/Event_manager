// config/db.js
require('dotenv').config(); 

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'hariii_soa',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'evenia',
  password: process.env.DB_PASSWORD || '221020R@koto', 
  port: process.env.DB_PORT || 5432,
});

module.exports = pool;
