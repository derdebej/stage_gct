import express from 'express';
import db from '../db.js';

const router = express.Router();

router.post("/offre-insert", async (req, res) => {
  const { id_fournisseur, date_offre, chemin_document, montant } = req.body;
  const result = await db.query(
    "INSERT INTO offre (id_fournisseur, date_offre, chemin_document, montant) VALUES ($1, $2, $3, $4) RETURNING id_offre",
    [id_fournisseur, date_offre, chemin_document ,montant]
  );
  res.json({ id_offre: result.rows[0].id_offre });
});
export default router;