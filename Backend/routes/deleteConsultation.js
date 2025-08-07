// routes/deleteConsultation.js
import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.delete('/api/consultation/:id', async (req, res) => {
  const { id } = req.params;

  const client = await pool.connect();
  console.log("hello")
  try {
    await client.query('BEGIN');

    // 0. Get consultation type
    const typeResult = await client.query(
      'SELECT type FROM consultation WHERE id_consultation = $1',
      [id]
    );

    const consultationType = typeResult.rows[0]?.type?.trim().toLowerCase();

    let relatedDaIds = [];

    if (consultationType === "equipement") {
      // 1. Get related lots
      const lotResult = await client.query(
        'SELECT id_da FROM lot WHERE id_consultation = $1',
        [id]
      );

      relatedDaIds = [...new Set(lotResult.rows.map(row => row.id_da))];

      // 2. Delete from lot
      await client.query(
        'DELETE FROM lot WHERE id_consultation = $1',
        [id]
      );
    } else if (consultationType === "consommable") {
      // 1. Get related DA IDs directly from consultation_da
      const daResult = await client.query(
        'SELECT id_da FROM consultation_da WHERE id_consultation = $1',
        [id]
      );
      console.log(daResult)
      relatedDaIds = [...new Set(daResult.rows.map(row => row.id_da))];
      

      // 2. Delete from consultation_da
      await client.query(
        'DELETE FROM consultation_da WHERE id_consultation = $1',
        [id]
      );
    }

    // 3. Delete consultation
    await client.query('DELETE FROM consultation WHERE id_consultation = $1', [id]);

    // 4. Update related demande_d_achat to "Non Traitée"
    if (relatedDaIds.length > 0) {
      const placeholders = relatedDaIds.map((_, idx) => `$${idx + 1}`).join(', ');
      await client.query(
        `UPDATE demande_d_achat SET etat = 'Non Traitée' WHERE id_da IN (${placeholders})`,
        relatedDaIds
      );
    }

    await client.query('COMMIT');
    res.status(200).json({ message: 'Consultation supprimée avec succès' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erreur suppression consultation:', err);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  } finally {
    client.release();
  }
});

export default router;