import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { id_consultation, nombre_lots, date_creation, userid, lots } = req.body;

  if (!id_consultation || !nombre_lots || !date_creation || !Array.isArray(lots)) {
    return res.status(400).json({ error: 'Champs manquants ou invalides.' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const consultationInsert = `
      INSERT INTO consultation (id_consultation, nombre_des_lots, date_creation, id_utilisateur)
      VALUES ($1, $2, $3, $4)
    `;
    await client.query(consultationInsert, [id_consultation, nombre_lots, date_creation, userid]);


    for (const lot of lots) {
      const lotInsert = `
        INSERT INTO lot (id_lot, id_da, id_consultation)
        VALUES ($1, $2, $3)
      `;
      await client.query(lotInsert, [id_consultation*10+lot.id_lot, lot.id_da, id_consultation]);
    }

    await client.query('COMMIT');
    res.status(201).json({ message: 'Consultation et lots insérés avec succès' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erreur lors de l’insertion:', err);
    res.status(500).json({ error: 'Erreur lors de la création' });
  } finally {
    client.release();
  }
});

export default router;
