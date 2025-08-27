import express from "express";
import pool from "../db.js";

const router = express.Router();

// GET /api/lots/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT a.id_article, a.id_da, a.designation, a.quantite, a.prix_unitaire
      FROM article a
      WHERE a.id_lot = $1
      ORDER BY a.id_article DESC
    `;
    const result = await pool.query(query, [id]);

    res.json({ articles: result.rows });
  } catch (err) {
    console.error("Erreur lors de la récupération du lot:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
