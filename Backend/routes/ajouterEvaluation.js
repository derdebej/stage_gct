import express from "express";
import pool from "../db.js";
const router = express.Router();

router.post("/", async (req, res) => {
  const { id_offre, date, chemin_evaluation, conformite, id_fournisseur } = req.body;

  if (!id_offre || !date || !chemin_evaluation || !conformite || !id_fournisseur) {
    return res.status(400).json({ error: "Champs requis manquants" });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO evaluation (id_offre, date, chemin_document, conformite, id_fournisseur)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
      `,
      [id_offre, date, chemin_evaluation, conformite, id_fournisseur]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erreur lors de l'insertion:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
