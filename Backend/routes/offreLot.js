import express from 'express';
import db from '../db.js';

const router = express.Router();

router.post("/offres/:id_offre/lots", async (req, res) => {
  const { lots } = req.body;
  const { id_offre } = req.params;

  if (!Array.isArray(lots)) {
    return res.status(400).json({ error: "Lots must be an array" });
  }

  const values = [];
  const params = [];

  lots.forEach((lot, index) => {
    values.push(`($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`);
    params.push(id_offre, lot.id_lot, lot.montant);
  });

  const query = `
    INSERT INTO offre_lot (id_offre, id_lot, montant)
    VALUES ${values.join(", ")}
  `;

  try {
    await db.query(query, params);
    res.sendStatus(200);
  } catch (error) {
    console.error("Erreur lors de l'insertion des lots:", error);
    res.status(500).json({ error: "Erreur serveur lors de l'ajout des lots" });
  }
});
export default router;