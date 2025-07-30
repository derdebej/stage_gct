import express from "express";
import db from "../db.js";

const router = express.Router();

router.post("/api/demande-related", async (req, res) => {
  const { id } = req.body;

  try {
    const client = await db.connect();

    const lotResult = await client.query(
      'SELECT * FROM lot WHERE id_da = $1',
      [id]
    );

    const lots = lotResult.rows;

    if (lots.length === 0) {
      client.release();
      return res.status(404).json({ error: "No lots found for this demande" });
    }

    const ConsId = lots[0].id_consultation;

    const RelatedConsResult = await client.query(
      `SELECT * FROM consultation WHERE id_consultation = $1`,
      [ConsId]
    );

    client.release();

    res.json({ consultation: RelatedConsResult.rows[0], lot: lots[0] });

  } catch (err) {
    console.error("Erreur :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
