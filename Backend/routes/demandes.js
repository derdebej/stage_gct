import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const {
    q = "",
    etat = "",
    year,
    month,
    day,
    page = 1,
    limit = 10,
  } = req.query;

  const searchQuery = `%${q}%`;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const offset = (pageNum - 1) * limitNum;

  let baseQuery = `
    SELECT * FROM demande_d_achat
    WHERE 
      (CAST(id_da AS TEXT) ILIKE $1 
      OR LOWER(titre) ILIKE LOWER($1) 
      OR LOWER(demandeur) ILIKE LOWER($1))
      OR LOWER(nature) ILIKE LOWER($1) `;

  let countQuery = `
    SELECT COUNT(*) FROM demande_d_achat
    WHERE 
      (CAST(id_da AS TEXT) ILIKE $1 
      OR LOWER(titre) ILIKE LOWER($1) 
      OR LOWER(demandeur) ILIKE LOWER($1))
      OR LOWER(nature) ILIKE LOWER($1) `;

  const params = [searchQuery];
  let paramIndex = 2;

  const addCondition = (condition, value) => {
    baseQuery += ` AND ${condition}`;
    countQuery += ` AND ${condition}`;
    params.push(value);
    paramIndex++;
  };

  if (etat) addCondition(`LOWER(etat) = LOWER($${paramIndex})`, etat);
  if (year) addCondition(`EXTRACT(YEAR FROM date) = $${paramIndex}`, year);
  if (month) addCondition(`EXTRACT(MONTH FROM date) = $${paramIndex}`, month);
  if (day) addCondition(`EXTRACT(DAY FROM date) = $${paramIndex}`, day);

  // Pagination
  baseQuery += ` ORDER BY id_da DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limitNum, offset);

  try {
    const dataResult = await db.query(baseQuery, params);
    const countResult = await db.query(countQuery, params.slice(0, paramIndex - 1));

    const totalItems = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalItems / limitNum);

    res.json({
      data: dataResult.rows,
      totalItems,
      totalPages,
      currentPage: pageNum,
    });
  } catch (err) {
    console.error("Erreur lors de la recherche avec pagination:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
