import express from "express";
import pool from "../db.js";
const router = express.Router();

router.post("/", async (req, res) => {
  const { id_offre, date, chemin_evaluation, conformite, id_fournisseur,id_lot } = req.body;

  if (!id_offre || !date || !chemin_evaluation || !conformite || !id_fournisseur || !id_lot) {
    return res.status(400).json({ error: "Champs requis manquants" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Insert the evaluation
    const evalResult = await client.query(
      `
      INSERT INTO evaluation (id_offre, date, chemin_document, conformite, id_fournisseur, id_lot)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
      `,
      [id_offre, date, chemin_evaluation, conformite, id_fournisseur, id_lot]
    );

    // 2. Update the statut of the related offre
    await client.query(
      `
      UPDATE offre
      SET statut = 'évalué'
      WHERE id_offre = $1;
      `,
      [id_offre]
    );

    await client.query("COMMIT");

    res.status(201).json(evalResult.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erreur lors de l'insertion:", err);
    res.status(500).json({ error: "Erreur serveur" });
  } finally {
    client.release();
  }
});

export default router;
