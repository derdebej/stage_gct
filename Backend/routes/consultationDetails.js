import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/api/consultation-details/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const client = await pool.connect();

    // 1. Get consultation type
    const typeResult = await client.query(
      'SELECT type FROM consultation WHERE id_consultation = $1',
      [id]
    );

    const consultationType = typeResult.rows[0]?.type;

    if (!consultationType) {
      client.release();
      return res.status(404).json({ error: 'Consultation introuvable' });
    }

    let demandes = [];
    let lots = [];

    if (consultationType === 'equipement') {
      // 2. Get all lots for this consultation
      const lotResult = await client.query(
        'SELECT * FROM lot WHERE id_consultation = $1',
        [id]
      );
      lots = lotResult.rows;

      // 3. Extract all unique id_da from lots
      const daIds = [...new Set(lots.map(lot => lot.id_da))];

      // 4. Get related demandes d’achat
      if (daIds.length > 0) {
        const placeholders = daIds.map((_, index) => `$${index + 1}`).join(', ');
        const daQuery = `SELECT * FROM demande_d_achat WHERE id_da IN (${placeholders})`;
        const daResult = await client.query(daQuery, daIds);
        demandes = daResult.rows;
      }

    } else if (consultationType === 'consommable') {
      // 2. Get id_da from consultation_da
      const daResult = await client.query(
        'SELECT id_da FROM consultation_da WHERE id_consultation = $1',
        [id]
      );
      const daIds = daResult.rows.map(row => row.id_da);

      // 3. Get related demandes d’achat
      if (daIds.length > 0) {
        const placeholders = daIds.map((_, index) => `$${index + 1}`).join(', ');
        const daQuery = `SELECT * FROM demande_d_achat WHERE id_da IN (${placeholders})`;
        const fullDaResult = await client.query(daQuery, daIds);
        demandes = fullDaResult.rows;
      }
    }

    client.release();
    res.json({ demandes, lots, type: consultationType });

  } catch (err) {
    console.error('Erreur consultation-details:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
