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

app.set('view engine', 'pug');
app.set('views', './views');

app.use((req, res, next) => {
  pool.query('SELECT * FROM film', (error, results) => {
    if (error) {
      throw error;
    }
    res.locals.films = results.rows;
    next();
  });
});

app.get('/', (req, res) => {
  res.render('index', { title: 'Data Film', data: res.locals.films });
});

//Route menampilkan semua list /film
app.get('/film', (req, res) => {
  res.render('film', { title: 'Data Semua Film', data: res.locals.films });
});

// Route untuk menampilkan data film berdasarkan /film/[id]
app.get('/film/:film_id', (req, res) => {
  const filmId = req.params.film_id;
  const film = res.locals.films.find((f) => f.film_id == filmId);
  if (!film) {
    return res.status(404).send('Film tidak ditemukan');
  }
  res.render('film_detail', { title: 'Detail Film', film });
});

// Route untuk menampilkan data list /category
app.get('/category', (req, res) => {
    pool.query('SELECT * FROM category', (error, results) => {
      if (error) {
        throw error;
      }
      const categories = results.rows;
      res.render('category', { title: 'Data List Category', categories });
    });
  });
  
// Route untuk menampilkan data list film berdasarkan /category/[id]
app.get('/category/:category_id', (req, res) => {
  const categoryId = req.params.category_id;
  pool.query(
    `
    SELECT film.* FROM film
    INNER JOIN film_category ON film.film_id = film_category.film_id
    WHERE film_category.category_id = $1
    `,
    [categoryId],
    (error, results) => {
      if (error) {
        throw error;
      }
      const films = results.rows;
      res.render('category_films', {
        title: 'Data List Film Berdasarkan Category',
        films,
      });
    }
  );
});

app.listen(port, () => {
  console.log(`Aplikasi berjalan di http://localhost:${port}`);
});