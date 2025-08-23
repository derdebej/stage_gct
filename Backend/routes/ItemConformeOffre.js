import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/articles/:id_article/:id_da/offresConforme", async (req, res) => {
  const { id_article, id_da } = req.params;

  try {
    const { rows } = await db.query(
      `SELECT oa.id_offre, oa.montant, f.id_fournisseur, f.nom
       FROM offre_article oa
       JOIN offre o ON o.id_offre = oa.id_offre
       JOIN fournisseur f ON f.id_fournisseur = o.id_fournisseur
       JOIN evaluation_article ea
         ON ea.id_article = oa.id_article AND ea.id_da = oa.id_da AND ea.id_offre = oa.id_offre
       WHERE oa.id_article = $1 AND oa.id_da = $2
         AND ea.conformite = 'Conforme'`,
      [id_article, id_da]
    );

    res.json(rows);
  } catch (err) {
    console.error("Erreur fetch offres article:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/lots/:id_lot/offresConforme", async (req, res) => {
  const { id_lot } = req.params;

  try {
    const { rows } = await db.query(
      `SELECT ol.id_offre, ol.montant, f.id_fournisseur, f.nom
       FROM offre_lot ol
       JOIN offre o ON o.id_offre = ol.id_offre
       JOIN fournisseur f ON f.id_fournisseur = o.id_fournisseur
       JOIN evaluation_lot el
         ON el.id_lot = ol.id_lot AND el.id_offre = ol.id_offre
       WHERE ol.id_lot = $1
         AND el.conformite = 'Conforme'`,
      [id_lot]
    );

    res.json(rows);
  } catch (err) {
    console.error("Erreur fetch offres lot:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
