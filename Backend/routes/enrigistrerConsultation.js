import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const {
    id_consultation,
    nombre_lots,
    date_creation,
    userid,
    lots,
    type,
    id_das,
  } = req.body;

  if (!id_consultation || !date_creation) {
    return res.status(400).json({ error: 'Champs manquants ou invalides.' });
  }

  if (type === 'equipement' && (!Array.isArray(lots) || !nombre_lots)) {
    return res.status(400).json({ error: 'Les lots sont requis pour le type équipement.' });
  }



  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const consultationInsert = `
      INSERT INTO consultation (id_consultation, nombre_des_lots, date_creation, id_utilisateur, type)
      VALUES ($1, $2, $3, $4, $5)
    `;
    
    await client.query(consultationInsert, [id_consultation, nombre_lots, date_creation, userid, type]);

    if (type === 'equipement' && Array.isArray(lots) && lots.length > 0) {
      for (const lot of lots) {
        const lotInsert = `
          INSERT INTO lot (id_lot, id_da, id_consultation)
          VALUES ($1, $2, $3)
        `;
        await client.query(lotInsert, [id_consultation * 10 + lot.id_lot, lot.id_da, id_consultation]);
      }
    } else {
      for (const id of id_das) {
      await client.query(
        `INSERT INTO consultation_da (id_consultation, id_da) VALUES ($1, $2)`,
        [id_consultation, id]
      );
    }
    }
    for (const id of id_das) {
      const updateEtat = `
        UPDATE demande_d_achat
        SET etat = 'En Cours'
        WHERE id_da = $1
      `;
      await client.query(updateEtat, [id]);
    }

    await client.query('COMMIT');
    res.status(201).json({ message: 'Consultation créée avec succès' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erreur lors de l’insertion:', err);
    res.status(500).json({ error: 'Erreur lors de la création' });
  } finally {
    client.release();
  }
});

export default router;
