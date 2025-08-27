import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { id_consultation, nombre_lots, date_creation, userid, articleLots, type, id_das } = req.body;


  if (!id_consultation || !date_creation) {
    return res.status(400).json({ error: 'Champs manquants ou invalides.' });
  }

  if (type === 'equipement' && (!articleLots || typeof articleLots !== 'object' || !nombre_lots)) {
  return res.status(400).json({ error: 'Les articles/lots sont requis pour le type équipement.' });
}




  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const consultationInsert = `
      INSERT INTO consultation (id_consultation, nombre_des_lots, date_creation, id_utilisateur, type)
      VALUES ($1, $2, $3, $4, $5)
    `;
    
    await client.query(consultationInsert, [id_consultation, nombre_lots, date_creation, userid, type]);

    if (type === 'equipement' && nombre_lots > 0) {
      for (let i = 1; i <= nombre_lots; i++) {
        const lotInsert = `
          INSERT INTO lot (id_lot, id_consultation)
          VALUES ($1, $2)
        `;
        await client.query(lotInsert, [id_consultation * 10 + i, id_consultation]);
      }

      for (const [key, lotNum] of Object.entries(articleLots)) {
        if (!lotNum) continue; // skip unassigned
        const [id_article, id_da] = key.split("-");

        const updateArticle = `
          UPDATE article
          SET id_lot = $1
          WHERE id_article = $2 AND id_da = $3
        `;
        const id_lot = `${id_consultation}-${lotNum}`;
        await client.query(updateArticle, [
          id_lot,
          id_article,
          id_da,
        ]);
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
