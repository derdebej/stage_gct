import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/commandes/:id_commande/details", async (req, res) => {
  const { id_commande } = req.params;

  try {
    const commandeRes = await db.query(
      `SELECT c.id_commande, c.date, c.id_consultation, 
              c.id_fournisseur, c.type
       FROM commande c
       WHERE c.id_commande = $1`,
      [id_commande]
    );

    if (commandeRes.rowCount === 0) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }

    const commande = commandeRes.rows[0];

    let articles = [];
    let lots = [];

    if (commande.type === "consommable") {
      const articlesRes = await db.query(
        `SELECT ca.id_article, ca.id_da, a.designation, a.quantite,ca.id_commande_article
         FROM commande_article ca
         JOIN article a 
           ON ca.id_article = a.id_article AND ca.id_da = a.id_da
         WHERE ca.id_commande = $1`,
        [id_commande]
      );
      articles = articlesRes.rows;
    } else if (commande.type === "equipement") {
      const lotsRes = await db.query(
        `SELECT cl.id_lot,cl.id_commande,l.id_consultation,cl.id_commande_lot
         FROM commande_lot cl
         JOIN lot l ON cl.id_lot = l.id_lot
         WHERE cl.id_commande = $1`,
        [id_commande]
      );
      lots = lotsRes.rows;
    } else {
      return res.status(400).json({ error: "Type de commande invalide" });
    }
    console.log("articles:", articles);
    console.log("lots:", lots);
    res.json({
      id_commande: commande.id_commande,
      date_commande: commande.date,
      id_consultation: commande.id_consultation,
      id_fournisseur: commande.id_fournisseur,
      consultation_type: commande.type, 
      articles,
      lots,
    });
  } catch (err) {
    console.error("Erreur lors de la récupération des détails de commande:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
