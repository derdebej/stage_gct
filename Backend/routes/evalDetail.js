import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/evaluations/:id_evaluation/detail", async (req, res) => {
  const client = await db.connect();
  try {
    const { id_evaluation } = req.params;

    const evalQuery = await client.query(
      `SELECT e.id_eval, e.date, e.chemin_document, e.id_consultation, c.type
       FROM evaluation e
       JOIN consultation c ON e.id_consultation = c.id_consultation
       WHERE e.id_eval = $1`,
      [id_evaluation]
    );

    if (evalQuery.rows.length === 0) {
      return res.status(404).json({ error: "Évaluation non trouvée" });
    }

    const evaluation = evalQuery.rows[0];
    let articles = [];
    let lots = [];

    if (evaluation.type === "consommable") {
      const articleQuery = await client.query(
        `SELECT ea.id_article, a.designation, ea.conformite , a.id_da
         FROM evaluation_article ea
         JOIN article a ON ea.id_article = a.id_article AND ea.id_da = a.id_da
         WHERE ea.id_eval = $1`,
        [id_evaluation]
      );
      articles = articleQuery.rows;
    } else {
      const lotQuery = await client.query(
        `SELECT el.id_lot, el.conformite
         FROM evaluation_lot el
         JOIN lot l ON el.id_lot = l.id_lot
         WHERE el.id_eval = $1`,
        [id_evaluation]
      );
      lots = lotQuery.rows;
    }

    res.json({
      id_evaluation: evaluation.id_eval,
      date: evaluation.date,
      chemin_evaluation: evaluation.chemin_document,
      id_consultation: evaluation.id_consultation,
      consultation_type: evaluation.type,
      articles,
      lots,
    });
  } catch (err) {
    console.error("Erreur dans /evaluations/:id_evaluation/detail", err);
    res.status(500).json({ error: "Erreur serveur" });
  } finally {
    client.release();
  }
});

export default router;
