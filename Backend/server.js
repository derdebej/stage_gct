import express from 'express';
import cors from 'cors';
import pool from './db.js'; 

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/demandes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM demande_d_achat');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.listen(3001, () => {
  console.log('Serveur backend Node.js démarré sur http://localhost:3001');
});
