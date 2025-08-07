import express from "express";
import pool from "../db.js";
const router = express.Router();

router.get("/:id_offre", async (req, res) => {
  const { id_offre } = req.params;
  const { search } = req.query;

  try {
    const query = `
      SELECT lot.*
      FROM lot
      INNER JOIN offre_lot ON lot.id_lot = offre_lot.id_lot
      WHERE offre_lot.id_offre = $1
      ${search ? `AND (lot.id_lot ILIKE $2 OR lot.id_da ILIKE $2 OR lot.description ILIKE $2)` : ""}
    `;

    const values = search ? [id_offre, `%${search}%`] : [id_offre];

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des lots par offre:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
