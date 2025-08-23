import express from "express";
import db from "../db.js";

const router = express.Router();

const getCurrentYear = () => new Date().getFullYear();


router.get("/depense-consommable", async (req, res) => {
  const year = getCurrentYear();
  try {
    const query = `
      SELECT 
        COALESCE(SUM(ra.quantite_recue * oa.montant), 0) AS total_depense,
        COUNT(DISTINCT ca.id_commande_article) AS nombre_commandes
      FROM reception r
      JOIN reception_article ra ON r.id_reception = ra.id_reception
      JOIN commande_article ca ON ra.id_commande_article = ca.id_commande_article
      JOIN offre_article oa 
        ON ca.id_article = oa.id_article
       AND ca.id_da = oa.id_da
       AND ca.id_offre = oa.id_offre
      WHERE EXTRACT(YEAR FROM r.date) = $1;
    `;
    const { rows } = await db.query(query, [year]);
        console.log(rows[0]);

    res.json({
      year,
      type: "consommable",
      total: rows[0].total_depense,
      nombre_commandes: rows[0].nombre_commandes,
    });
  } catch (err) {
    console.error("Erreur depense consommable:", err);
    res.status(500).json({ error: "Erreur calcul depense consommable" });
  }
});



router.get("/depense-equipement", async (req, res) => {
  const year = getCurrentYear();
  try {
    const query = `
      SELECT 
        COALESCE(SUM(ol.montant), 0) AS total_depense,
        COUNT(DISTINCT cl.id_commande_lot) AS nombre_commandes
      FROM reception r
      JOIN reception_lot rl ON r.id_reception = rl.id_reception
      JOIN commande_lot cl ON rl.id_commande_lot = cl.id_commande_lot
      JOIN offre_lot ol ON cl.id_lot = ol.id_lot AND cl.id_offre = ol.id_offre
      WHERE rl.recu = true
        AND EXTRACT(YEAR FROM r.date) = $1;
    `;
    const { rows } = await db.query(query, [year]);
    res.json({
      year,
      type: "equipement",
      total: rows[0].total_depense,
      nombre_commandes: rows[0].nombre_commandes,
    });
  } catch (err) {
    console.error("Erreur depense equipement:", err);
    res.status(500).json({ error: "Erreur calcul depense equipement" });
  }
});



router.get("/depense-aed/:numAED", async (req, res) => {
  const { numAED } = req.params;
  const year = getCurrentYear();
  try {
    const query = `
      SELECT COALESCE(SUM(ol.montant), 0) AS total_depense
      FROM lot l
      JOIN demande_d_achat da ON l.id_da = da.id_da
      JOIN commande_lot cl ON l.id_lot = cl.id_lot
      JOIN reception_lot rl ON cl.id_commande_lot = rl.id_commande_lot
      JOIN reception r ON rl.id_reception = r.id_reception
      JOIN offre_lot ol ON cl.id_lot = ol.id_lot AND cl.id_offre = ol.id_offre
      WHERE da.numaed = $1
        AND rl.recu = true
        AND EXTRACT(YEAR FROM r.date) = $2;
    `;
    const { rows } = await db.query(query, [numAED, year]);
    res.json({ year, numAED, total: rows[0].total_depense });
  } catch (err) {
    console.error("Erreur depense par Num AED:", err);
    res.status(500).json({ error: "Erreur calcul depense par Num AED" });
  }
});


export default router;
