import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;
  const id_das = req.query.id_das?.split(",");

  if (!id_das || id_das.length === 0) {
    return res.status(400).json({ error: "Missing id_das query param" });
  }

  try {
    const articlesQuery = `
      SELECT * FROM article
      WHERE id_da = ANY($3)
      ORDER BY id_article DESC
      LIMIT $1 OFFSET $2
    `;

    const countQuery = `
      SELECT COUNT(*) FROM article
      WHERE id_da = ANY($1)
    `;
    const montantQuery = `
      SELECT SUM(prix_unitaire * quantite) AS total_montant
      FROM article
      WHERE id_da = ANY($1)
    `;

    const articlesResult = await pool.query(articlesQuery, [limit, offset, id_das]);
    const countResult = await pool.query(countQuery, [id_das]);

    const totalItems = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalItems / limit);

    const montantResult = await pool.query(montantQuery, [id_das]);
    const totalMontantEstime = parseFloat(montantResult.rows[0].total_montant || 0);

    res.json({
      data: articlesResult.rows,
      totalItems,
      totalPages,
      currentPage: page,
      totalMontantEstime,
    });
  } catch (err) {
    console.error("Erreur serveur:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
