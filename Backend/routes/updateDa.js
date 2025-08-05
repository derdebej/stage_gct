import express from "express";
import pool from '../db.js';


const router = express.Router();

router.put("/api/update-demande-achat/:id_da", async (req, res) => {
  const { id_da } = req.params;
  const {
    demandeur,
    titre,
    nature,
    date,
    chemin_document,
    numaed,
    objet,
  } = req.body;

  if (!id_da) {
    return res.status(400).json({ error: "id_da is required" });
  }

  try {
    const query = `
      UPDATE demande_d_achat
      SET
        demandeur = $1,
        titre = $2,
        nature = $3,
        date = $4,
        chemin_document = $5,
        numaed = $6,
        objet = $7
      WHERE id_da = $8
      RETURNING *;
    `;

    const values = [demandeur, titre, nature, date, chemin_document, numaed || null, objet || null, id_da];

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Demande d'achat not found" });
    }

    res.json({ message: "Demande d'achat mise à jour avec succès", updatedDA: rows[0] });
  } catch (error) {
    console.error("Error updating demande d'achat:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
