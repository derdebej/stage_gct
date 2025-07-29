import express from "express";
import db from "../db.js";

const router = express.Router();


router.get("/demande-non-traitee", async (req, res) => {
  const { search = "" } = req.query;

  try {
    const result = await db.query(
      `SELECT * FROM demande_d_achat
       WHERE (LOWER(titre) LIKE LOWER($1) OR CAST(id_da AS TEXT) LIKE $1)
       AND etat = 'Non Traitée'
       ORDER BY date DESC`,
      [`%${search}%`]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
