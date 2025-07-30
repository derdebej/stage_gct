import express from "express";
import db from "../db.js"; // assume this is pg-pool

const router = express.Router();

router.get("/", async (req, res) => {
  const search = req.query.search || "";
  const exclude = (req.query.exclude || "").split(",").filter(Boolean); // array of IDs as strings

  try {
    let baseQuery = `
      SELECT id_lot, id_da, id_consultation
      FROM lot
      WHERE (
        CAST(id_lot AS TEXT) ILIKE $1 OR
        CAST(id_da AS TEXT) ILIKE $2 OR
        CAST(id_consultation AS TEXT) ILIKE $3
      )
    `;

    const queryParams = [`%${search}%`, `%${search}%`, `%${search}%`];

    if (exclude.length > 0) {
      const placeholders = exclude.map((_, idx) => `$${queryParams.length + idx + 1}`).join(", ");
      baseQuery += ` AND id_lot NOT IN (${placeholders})`;
      queryParams.push(...exclude);
    }

    const result = await db.query(baseQuery, queryParams);

    res.json(result.rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des lots:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
