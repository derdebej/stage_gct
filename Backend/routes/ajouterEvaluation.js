import express from "express";
import pool from "../db.js";
const router = express.Router();

router.post("/", async (req, res) => {
  const { id_consultation, date, chemin_evaluation, evaluations } = req.body;

  if (!id_consultation || !date || !chemin_evaluation || !evaluations) {
    return res.status(400).json({ error: "Champs requis manquants" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const evalResult = await client.query(
      `
      INSERT INTO evaluation (id_consultation, date, chemin_document)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [id_consultation, date, chemin_evaluation]
    );
    const idEvaluation = evalResult.rows[0].id_eval;
    await client.query(
      `
      UPDATE consultation
      SET statut_evaluation = 'évalué'
      WHERE id_consultation = $1
      `,
      [id_consultation]
    ); 
    await client.query(
      `
      UPDATE demande_d_achat dda
      SET etat = 'Traitée'
      FROM consultation_da cda
      WHERE dda.id_da = cda.id_da
        AND cda.id_consultation = $1
      `,
      [id_consultation]
    );

    for (const itemId in evaluations) {
      for (const offreId in evaluations[itemId]) {
        const conformite = evaluations[itemId][offreId];

        const typeRes = await client.query(
          `SELECT type FROM consultation WHERE id_consultation = $1`,
          [id_consultation]
        );
        const type = typeRes.rows[0].type;

        if (type === "consommable") {

          const [id_article, id_da] = itemId.split("-");

          await client.query(
            `
            INSERT INTO evaluation_article (id_eval, id_article, id_da, id_offre, conformite)
            VALUES ($1, $2, $3, $4, $5)
            `,
            [idEvaluation, id_article, id_da, offreId, conformite]
          );
        } else {
          await client.query(
            `
            INSERT INTO evaluation_lot (id_eval, id_lot, id_offre, conformite)
            VALUES ($1, $2, $3, $4)
            `,
            [idEvaluation, itemId, offreId, conformite]
          );
          await client.query(
            `
            UPDATE demande_d_achat da
            SET etat = 'Traitée'
            FROM lot l
            WHERE da.id_da = l.id_da
              AND l.id_lot = $1
            `,
            [itemId]
          );

        }

      }
    }

    await client.query("COMMIT");

    res.status(201).json( evalResult.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erreur lors de l'insertion:", err);
    res.status(500).json({ error: "Erreur serveur" });
  } finally {
    client.release();
  }
});

export default router;
