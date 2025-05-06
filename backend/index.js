
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a PostgreSQL (Supabase)
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Academia de Fútbol API funcionando');
});

// Obtener jugadores
app.get('/api/jugadores', async (req, res) => {
  const result = await pool.query('SELECT * FROM jugadores ORDER BY nombre');
  res.json(result.rows);
});

// Crear jugador
app.post('/api/jugadores', async (req, res) => {
  const { nombre, edad, categoria } = req.body;
  const result = await pool.query(
    'INSERT INTO jugadores (nombre, edad, categoria) VALUES ($1, $2, $3) RETURNING *',
    [nombre, edad, categoria]
  );
  res.json(result.rows[0]);
});

// Puerto
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
