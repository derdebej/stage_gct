import express from "express";
import db from "../db.js"; // adjust to your actual DB file path

const router = express.Router();

router.get("/", async (req, res) => {
  const search = req.query.search || "";
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    const countQuery = `
      SELECT COUNT(*) FROM commande
      WHERE 
        id_commande::text ILIKE $1 OR 
        date::text ILIKE $1 OR 
        statut::text ILIKE $1
    `;
    const countResult = await db.query(countQuery, [`%${search}%`]);
    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    const dataQuery = `
      SELECT *
      FROM commande
      WHERE 
        id_commande::text ILIKE $1 OR 
        date::text ILIKE $1 OR 
        statut::text ILIKE $1
      ORDER BY date DESC
      LIMIT $2 OFFSET $3
    `;
    const commandesResult = await db.query(dataQuery, [`%${search}%`, limit, offset]);

    res.json({
      commandes: commandesResult.rows,
      totalPages,
    });
  } catch (error) {
    console.error("Erreur dans /api/commandes:", error);
    res.status(500).json({ error: "Erreur serveur lors du chargement des commandes" });
  }
});

export default router;
