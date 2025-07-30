import express from "express";
import db from "../db.js";

const router = express.Router();

router.post("/api/lots", async (req, res) => {
  const { id_lot, id_consultation, id_da } = req.body;

  if (!id_lot || !id_consultation || !id_da) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    await db.query(
      `INSERT INTO lot (id_lot, id_consultation, id_da)
       VALUES ($1, $2, $3)`,
      [id_lot, id_consultation, id_da]
    );
    await db.query(
      `UPDATE demande_d_achat SET etat = $1 WHERE id_da = $2`,
      ["En Cours", id_da]
    );


    res.status(201).json({ success: true });
  } catch (err) {
    console.error("❌ Error inserting lot:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
