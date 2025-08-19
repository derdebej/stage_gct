import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/commandes/:id_commande/details", async (req, res) => {
  const { id_commande } = req.params;

  try {
    const commandeRes = await db.query(
      "SELECT id_commande, type FROM commande WHERE id_commande = $1",
      [id_commande]
    );

    if (commandeRes.rowCount === 0) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }

    const commande = commandeRes.rows[0];

    if (commande.type === "consommable") {
      const articlesRes = await db.query(
        `SELECT ca.id_commande_article,
                a.designation,
                a.quantite AS quantite_commande
         FROM commande_article ca
         JOIN article a 
           ON ca.id_da = a.id_da AND ca.id_article = a.id_article
         WHERE ca.id_commande = $1`,
        [id_commande]
      );
      return res.json(articlesRes.rows);
    } else if (commande.type === "equipement") {
      const lotsRes = await db.query(
        `SELECT cl.id_commande_lot,
                l.id_lot
         FROM commande_lot cl
         JOIN lot l ON cl.id_lot = l.id_lot
         WHERE cl.id_commande = $1`,
        [id_commande]
      );
      return res.json(lotsRes.rows);
    } else {
      return res.status(400).json({ error: "Type de commande invalide" });
    }
  } catch (err) {
    console.error("Erreur lors de la récupération des détails de commande:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
