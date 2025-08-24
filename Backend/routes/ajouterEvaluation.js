import express from "express";
import pool from "../db.js";
import multer from "multer";
import path, { parse } from "path";
import fs from "fs";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { id_consultation } = req.body;
    if (!id_consultation) {
      return cb(new Error("id_consultation requis"), null);
    }

    const uploadPath = path.join(
      process.env.BASE_PDF_PATH,
      "Evaluation",
      id_consultation.toString()
    );

    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("file"), async (req, res) => {
  const { id_consultation, date, evaluations } = req.body;
  let parsedEvaluations;
  try {
    parsedEvaluations = JSON.parse(evaluations);
  } catch (e) {
    return res.status(400).json({ error: "Évaluations invalides (JSON attendu)" });
  }

  const file = req.file;

  if (!id_consultation || !date || !file || !evaluations) {
    return res.status(400).json({ error: "Champs requis manquants" });
  }

  const client = await pool.connect();
  const chemin_evaluation = `/Evaluation/${id_consultation}/${file.originalname}`;

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

    for (const itemId in parsedEvaluations) {
      for (const offreId in parsedEvaluations[itemId]) {
        const conformite = parsedEvaluations[itemId][offreId];

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

    res.status(201).json(evalResult.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erreur lors de l'insertion:", err);
    res.status(500).json({ error: "Erreur serveur" });
  } finally {
    client.release();
  }
});

export default router;
