import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/articlesForConsultation", async (req, res) => {
  const { consultationId, search = "" } = req.query;

  if (!consultationId) {
    return res.status(400).json({ error: "Missing consultationId" });
  }

  try {
    const result = await pool.query(
      `
      SELECT a.*, da.id_da
      FROM article a
      JOIN demande_d_achat da ON a.id_da = da.id_da
      JOIN consultation_da cda ON da.id_da = cda.id_da
      WHERE cda.id_consultation = $1
        AND (
          a.designation ILIKE $2 OR
          CAST(a.id_article AS TEXT) ILIKE $2
        )
      `,
      [consultationId, `%${search}%`]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des articles:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
