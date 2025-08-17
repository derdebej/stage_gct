import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/:id_lot/offres", async (req, res) => {
  const { id_lot } = req.params;

  try {
    const { rows } = await db.query(
      `SELECT ol.id_offre, ol.montant, f.id_fournisseur, f.nom
       FROM offre_lot ol
       JOIN offre o ON o.id_offre = ol.id_offre
       JOIN fournisseur f ON f.id_fournisseur = o.id_fournisseur
       WHERE ol.id_lot = $1`,
      [id_lot]
    );

    res.json(rows);
  } catch (err) {
    console.error("Erreur fetch offres lot:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
