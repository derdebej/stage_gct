import express from "express";
import db from "../db.js";

const router = express.Router();


router.get("/demande-non-traitee", async (req, res) => {
  const { search = "", nature } = req.query;

  try {
    let query = `
      SELECT * FROM demande_d_achat
      WHERE (LOWER(titre) LIKE LOWER($1) OR CAST(id_da AS TEXT) LIKE $1)
        AND etat = 'Non Traitée'
    `;
    const values = [`%${search}%`];

    if (nature) {
      query += ` AND LOWER(nature) = LOWER($2)`;
      values.push(nature);
    }

    query += ` ORDER BY date DESC`;

    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur dans GET /demande-non-traitee:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


export default router;
