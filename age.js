const { Pool } = require('pg');

// PostgreSQL config
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'xpress',
  password: '123',
  port: 5432,
});

// Add "Age"
const migrationSQL = `
  ALTER TABLE actor
  ADD COLUMN age INTEGER;
`;

// Migrate Database 
pool.query(migrationSQL, (error, results) => {
  if (error) {
    console.error('Migrasi database gagal:', error);
  } else {
    console.log('Migrasi database berhasil.');
  }
  pool.end();
});
