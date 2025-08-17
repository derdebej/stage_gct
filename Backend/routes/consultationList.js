import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const search = req.query.search || "";

  try {
    const result = await pool.query(
      `
      SELECT *
      FROM consultation
      WHERE statut_evaluation = 'non évalué'
        AND (
          CAST(id_consultation AS TEXT) ILIKE $1
          OR type ILIKE $1
        )
      ORDER BY date_creation DESC
      `,
      [`%${search}%`]
    );

    res.json({ data: result.rows });
  } catch (err) {
    console.error("Erreur lors du fetch des consultations non évaluées:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
