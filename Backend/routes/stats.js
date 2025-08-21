import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/dashboard/stats", async (req, res) => {
  try {
    const totalExpensesRes = await db.query(`
      -- Sum for articles
      SELECT COALESCE(SUM(oa.montant * ra.quantite_recue),0) AS total_depenses
      FROM reception_article ra
      JOIN commande_article ca ON ra.id_commande_article = ca.id_commande_article
      JOIN offre_article oa ON oa.id_article = ca.id_article AND oa.id_da = ca.id_da
    `);

    const totalDepensesArticles = totalExpensesRes.rows[0].total_depenses;

    const totalExpensesLotsRes = await db.query(`
      -- Sum for lots
      SELECT COALESCE(SUM(ol.montant),0) AS total_depenses
      FROM reception_lot rl
      JOIN commande_lot cl ON rl.id_commande_lot = cl.id_commande_lot
      JOIN offre_lot ol ON ol.id_lot = cl.id_lot
    `);

    const totalDepensesLots = totalExpensesLotsRes.rows[0].total_depenses;

    const totalDepenses = totalDepensesArticles + totalDepensesLots;

    const commandesRes = await db.query(`SELECT COUNT(*) AS nombre_commandes FROM commande`);
    const nombreCommandes = commandesRes.rows[0].nombre_commandes;

    const topArticles = [];
    const topFournisseurs = [];

    res.json({
      totalDepenses,
      nombreCommandes,
      topArticles,
      topFournisseurs,
    });
  } catch (err) {
    console.error("Erreur dans /dashboard/stats:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
