const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

// PostgreSQL config
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'xpress',
  password: '123',
  port: 5432,
});

app.use((req, res, next) => {
  pool.query('SELECT * FROM actor', (error, results) => {
    if (error) {
      throw error;
    }
    res.locals.data = results.rows;
    next();
  });
});

app.get('/', (req, res) => {
  res.render('index', { title: 'Data Aktor', data: res.locals.data });
});

// Route Seeding
app.get('/seed', (req, res) => {
  const seedData = [
    { first_name: 'Ahmad', last_name: 'Firdaus' },
    { first_name: 'Siti', last_name: 'Aisyah' },
    { first_name: 'Budi', last_name: 'Santoso' },
    { first_name: 'Rina', last_name: 'Putri' },
    { first_name: 'Adi', last_name: 'Prabowo' },
  ];

  const insertQuery = 'INSERT INTO actor (first_name, last_name) VALUES ($1, $2)';

  seedData.forEach((data) => {
    pool.query(insertQuery, [data.first_name, data.last_name], (error, results) => {
      if (error) {
        throw error;
      }
    });
  });

  res.send('Seeding berhasil!');
});

app.listen(port, () => {
  console.log(`Aplikasi berjalan di http://localhost:${port}`);
});
