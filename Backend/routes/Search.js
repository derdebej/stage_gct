// routes/search.js
import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const searchQuery = req.query.q || "";
  const etatFilter = req.query.etat || "";
  const year = req.query.year;
  const month = req.query.month;
  const day = req.query.day;

  let baseQuery = `
    SELECT * FROM demande_d_achat 
    WHERE 
      (CAST(id_da AS TEXT) ILIKE $1 
      OR LOWER(titre) ILIKE LOWER($1) 
      OR LOWER(demandeur) ILIKE LOWER($1))`;

  const params = [`%${searchQuery}%`];
  let paramIndex = 2;

  if (etatFilter) {
    baseQuery += ` AND LOWER(etat) = LOWER($${paramIndex})`;
    params.push(etatFilter);
    paramIndex++;
  }

  if (year) {
    baseQuery += ` AND EXTRACT(YEAR FROM date) = $${paramIndex}`;
    params.push(year);
    paramIndex++;
  }

  if (month) {
    baseQuery += ` AND EXTRACT(MONTH FROM date) = $${paramIndex}`;
    params.push(month);
    paramIndex++;
  }

  if (day) {
    baseQuery += ` AND EXTRACT(DAY FROM date) = $${paramIndex}`;
    params.push(day);
    paramIndex++;
  }

  try {
    const result = await db.query(baseQuery, params);
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur lors de la recherche :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }

    
});

export default router;
