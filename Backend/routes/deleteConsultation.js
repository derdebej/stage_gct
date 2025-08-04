// routes/deleteConsultation.js
import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.delete('/api/consultation/:id', async (req, res) => {
  const { id } = req.params;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Get related lots
    const lotResult = await client.query(
      'SELECT id_da FROM lot WHERE id_consultation = $1',
      [id]
    );
    const relatedDaIds = [...new Set(lotResult.rows.map(row => row.id_da))];

    // 2. Delete lots
    await client.query('DELETE FROM lot WHERE id_consultation = $1',[id]);

    await client.query('DELETE FROM offre WHERE id_consultation = $1',[id]);

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