import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/offres/:id_offre/detail", async (req, res) => {
  const client = await db.connect();
  try {
    const { id_offre } = req.params;

    const offreQuery = await client.query(
      `SELECT o.id_offre, o.date_offre, o.id_fournisseur, o.chemin_document, 
              o.id_consultation, c.type
       FROM offre o
       JOIN consultation c ON o.id_consultation = c.id_consultation
       WHERE o.id_offre = $1`,
      [id_offre]
    );

    if (offreQuery.rows.length === 0) {
      return res.status(404).json({ error: "Offre non trouvée" });
    }

    const offre = offreQuery.rows[0];
    const type = await client.query(
      `SELECT type FROM consultation WHERE id_consultation = $1`, [offre.id_consultation])
      console.log("Consultation type:", type.rows[0].type);
    let articles = [];
    let lots = [];

    if (type.rows[0].type === "consommable") {
      const articleQuery = await client.query(
        `SELECT oa.id_article, a.designation, oa.montant,oa.id_da
         FROM offre_article oa
         JOIN article a ON oa.id_article = a.id_article AND oa.id_da = a.id_da
         WHERE oa.id_offre = $1`,
        [id_offre]
      );
      articles = articleQuery.rows;
    } else {
      const lotQuery = await client.query(
        `SELECT ol.id_lot, ol.montant
         FROM offre_lot ol
         JOIN lot l ON ol.id_lot = l.id_lot
         WHERE ol.id_offre = $1`,
        [id_offre]
      );
      lots = lotQuery.rows;
    }

    res.json({
      id_offre: offre.id_offre,
      date: offre.date_offre,
      id_fournisseur: offre.id_fournisseur,
      chemin_document: offre.chemin_document,
      id_consultation: offre.id_consultation,
      consultation_type: offre.type,
      articles,
      lots,
    });
  } catch (err) {
    console.error("Erreur dans /offres/:id_offre/detail", err);
    res.status(500).json({ error: "Erreur serveur" });
  } finally {
    client.release();
  }
});

export default router;
