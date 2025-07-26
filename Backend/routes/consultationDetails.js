import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/api/consultation-details/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const client = await pool.connect();

    // 1. Get all lots for this consultation
    const lotResult = await client.query(
      'SELECT * FROM lot WHERE id_consultation = $1',
      [id]
    );

    const lots = lotResult.rows;

    // 2. Extract all unique id_da from lots
    const daIds = [...new Set(lots.map(lot => lot.id_da))];

    // 3. Get all related demandes d’achat
    let demandes = [];
    if (daIds.length > 0) {
      const placeholders = daIds.map((_, index) => `$${index + 1}`).join(', ');
      const daQuery = `SELECT * FROM demande_d_achat WHERE id_da IN (${placeholders})`;
      const daResult = await client.query(daQuery, daIds);
      demandes = daResult.rows;
    }

    client.release();

    res.json({ demandes, lots });

  } catch (err) {
    console.error('Erreur consultation-details:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
