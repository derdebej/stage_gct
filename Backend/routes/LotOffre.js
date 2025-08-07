import express from "express";
import db from "../db.js";

const router = express.Router();

// GET /api/LotsOffre?consultationId=123&search=laptop
router.get("/", async (req, res) => {
  const search = req.query.search || "";
  const consultationId = req.query.consultationId;

  if (!consultationId) {
    return res.status(400).json({ error: "Missing consultationId" });
  }

  try {
    const result = await db.query(
      `
      SELECT id_lot, id_da, id_consultation
      FROM lot
      WHERE id_consultation = $1
        AND (
          CAST(id_lot AS TEXT) ILIKE $2 OR
          CAST(id_da AS TEXT) ILIKE $2
        )
      `,
      [consultationId, `%${search}%`]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des lots:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
