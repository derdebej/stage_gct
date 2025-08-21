import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/search", async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Paramètre 'q' requis" });
  }

  try {
    let articles = [];
    let lots = [];
    let consultations = [];
    let offres = [];
    let evaluations = [];
    let commandes = [];
    let receptions = [];

    const articleRes = await db.query(
      `SELECT a.id_article, a.id_da, a.designation, a.quantite
       FROM article a
       WHERE CAST(a.id_article AS TEXT) ILIKE $1`,
      [`%${q}%`]
    );

    if (articleRes.rowCount > 0) {
      articles = articleRes.rows;

      const consultationRes = await db.query(
        `SELECT c.id_consultation, c.type, c.date_creation
         FROM consultation c
         JOIN consultation_da cda ON c.id_consultation = cda.id_consultation
         WHERE cda.id_da = $1`,
        [articles[0].id_da]
      );
      consultations = consultationRes.rows;
    }

    // 🔎 Check if it's a lot
    const lotRes = await db.query(
      `SELECT l.id_lot, l.id_consultation
       FROM lot l
       WHERE CAST(l.id_lot AS TEXT) ILIKE $1`,
      [q]
    );

    if (lotRes.rowCount > 0) {
      lots = lotRes.rows;

      const consultationRes = await db.query(
        `SELECT c.id_consultation, c.type, c.date_creation
         FROM consultation c
         WHERE c.id_consultation = $1`,
        [lots[0].id_consultation]
      );
      consultations = consultationRes.rows;
    }

    if (consultations.length > 0) {
      const consultationIds = consultations.map((c) => c.id_consultation);

      const offresRes = await db.query(
        `SELECT id_offre, id_fournisseur, date_offre, id_consultation
         FROM offre
         WHERE id_consultation = ANY($1::int[])`,
        [consultationIds]
      );
      offres = offresRes.rows;

      const evalRes = await db.query(
        `SELECT id_eval, date, id_consultation
         FROM evaluation
         WHERE id_consultation = ANY($1::int[])`,
        [consultationIds]
      );
      evaluations = evalRes.rows;

      const commandesRes = await db.query(
        `SELECT id_commande, date, id_consultation
         FROM commande
         WHERE id_consultation = ANY($1::int[])`,
        [consultationIds]
      );
      commandes = commandesRes.rows;

      const receptionsRes = await db.query(
        `SELECT id_reception, date, id_commande
         FROM reception
         WHERE id_commande IN (
            SELECT id_commande 
            FROM commande 
            WHERE id_consultation = ANY($1::int[])
         )`,
        [consultationIds]
      );
      receptions = receptionsRes.rows;
    }
    console.log("Search results:", {
      articles,
      lots,
      consultations,
      offres,
      evaluations,
      commandes,
      receptions,
    });
    res.json({
      query: q,
      articles,
      lots,
      consultations,
      offres,
      evaluations,
      commandes,
      receptions,
    });
  } catch (err) {
    console.error("Erreur dans /search:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
