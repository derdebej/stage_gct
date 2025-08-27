import express from "express";
import db from "../db.js";

const router = express.Router();

const getCurrentYear = () => new Date().getFullYear();

// DEPENSE CONSOMMABLE
router.get("/depense-consommable", async (req, res) => {
  const year = getCurrentYear();
  try {
    const query = `
      SELECT 
        COALESCE(SUM(ra.quantite_recue * oa.montant), 0) AS total_depense,
        COUNT(DISTINCT ca.id_commande_article) AS nombre_commandes
      FROM reception r
      JOIN reception_article ra ON r.id_reception::varchar = ra.id_reception::varchar
      JOIN commande_article ca ON ra.id_commande_article::varchar = ca.id_commande_article::varchar
      JOIN offre_article oa 
        ON ca.id_article::varchar = oa.id_article::varchar
       AND ca.id_da::varchar = oa.id_da::varchar
       AND ca.id_offre::varchar = oa.id_offre::varchar
      WHERE EXTRACT(YEAR FROM r.date) = $1;
    `;
    const { rows } = await db.query(query, [year]);
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

// DEPENSE EQUIPEMENT
router.get("/depense-equipement", async (req, res) => {
  const year = getCurrentYear();
  try {
    const query = `
      SELECT 
        COALESCE(SUM(ol.montant), 0) AS total_depense,
        COUNT(DISTINCT cl.id_commande_lot) AS nombre_commandes
      FROM reception r
      JOIN reception_lot rl ON r.id_reception::varchar = rl.id_reception::varchar
      JOIN commande_lot cl ON rl.id_commande_lot::varchar = cl.id_commande_lot::varchar
      JOIN lot l ON cl.id_lot::varchar = l.id_lot::varchar
      JOIN offre_lot ol 
        ON cl.id_lot::varchar = ol.id_lot::varchar
       AND cl.id_offre::varchar = ol.id_offre::varchar
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

// DEPENSE PAR AED
router.get("/depense-aed/:numAED", async (req, res) => {
  const { numAED } = req.params;
  const year = getCurrentYear();

  try {
    const query = `
      SELECT COALESCE(SUM(ol.montant), 0) AS total_depense
      FROM demande_d_achat da
      JOIN article art ON art.id_da::varchar = da.id_da::varchar
      JOIN lot l ON art.id_lot::varchar = l.id_lot::varchar
      JOIN commande_lot cl ON cl.id_lot::varchar = l.id_lot::varchar
      JOIN reception_lot rl ON rl.id_commande_lot::varchar = cl.id_commande_lot::varchar
      JOIN reception r ON rl.id_reception::varchar = r.id_reception::varchar
      JOIN offre_lot ol 
        ON ol.id_lot::varchar = cl.id_lot::varchar
       AND ol.id_offre::varchar = cl.id_offre::varchar
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
