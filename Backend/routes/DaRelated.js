import express from "express";
import db from "../db.js";

const router = express.Router();

router.post("/api/demande-related", async (req, res) => {
  const { id } = req.body;

  try {
    const client = await db.connect();

    // 1️⃣ Get the DA to check its nature
    const daResult = await client.query(
      `SELECT * FROM demande_d_achat WHERE id_da = $1`,
      [id]
    );

    if (daResult.rows.length === 0) {
      client.release();
      return res.status(404).json({ error: "Demande not found" });
    }

    const da = daResult.rows[0];

    let consultation;
    let lots = [];

    if (da.nature === "Exploitation") {
      // 2️⃣ Exploitation → get related consultation from consultation_da
      const consResult = await client.query(
        `
        SELECT c.*
        FROM consultation c
        JOIN consultation_da cd ON c.id_consultation = cd.id_consultation
        WHERE cd.id_da = $1
        `,
        [id]
      );
      consultation = consResult.rows[0] || null;
      lots = []; // optionally empty
    } else if (da.nature === "Investissement") {
      // 3️⃣ Investissement → keep old logic: lots via articles
      const lotResult = await client.query(
        `
        SELECT DISTINCT l.*
        FROM lot l
        JOIN article a ON a.id_lot = l.id_lot
        WHERE a.id_da = $1
        `,
        [id]
      );
      lots = lotResult.rows;

      if (lots.length > 0) {
        const ConsId = lots[0].id_consultation;
        const RelatedConsResult = await client.query(
          `SELECT * FROM consultation WHERE id_consultation = $1`,
          [ConsId]
        );
        consultation = RelatedConsResult.rows[0] || null;
      } else {
        consultation = null;
      }
    }

    client.release();

    res.json({ consultation, lot: lots });
  } catch (err) {
    console.error("Erreur :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
