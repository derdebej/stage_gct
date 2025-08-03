import express from "express";
import pool from "../db.js"; 
const router = express.Router();

router.get("/", async (req, res) => {
  const search = req.query.search?.toString().toLowerCase() || "";

  try {
    const result = await pool.query(
      `
      SELECT o.id_offre, o.date_offre, o.montant, 
             f.id_fournisseur, f.nom AS fournisseur_nom
      FROM offre o
      JOIN fournisseur f ON o.id_fournisseur = f.id_fournisseur
      WHERE 
        CAST(o.id_offre AS TEXT) ILIKE $1 OR 
        LOWER(f.nom) ILIKE $1
      ORDER BY o.date_offre DESC
      `,
      [`%${search}%`]
    );

    const offres = result.rows.map((row) => ({
      id_offre: row.id_offre,
      date_offre: row.date_offre,
      montant: row.montant,
      fournisseur: {
        id_fournisseur: row.id_fournisseur,
        nom: row.fournisseur_nom,
      },
    }));

    res.json(offres);
  } catch (err) {
    console.error("Erreur lors du fetch des offres:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
