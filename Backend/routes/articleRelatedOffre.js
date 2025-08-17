import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/:id_article/offres", async (req, res) => {
  const { id_article } = req.params;

  try {
    const { rows } = await db.query(
      `SELECT oa.id_offre, oa.montant, f.id_fournisseur, f.nom
       FROM offre_article oa
       JOIN offre o ON o.id_offre = oa.id_offre
       JOIN fournisseur f ON f.id_fournisseur = o.id_fournisseur
       WHERE oa.id_article = $1`,
      [id_article]
    );

    res.json(rows);
  } catch (err) {
    console.error("Erreur fetch offres article:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
