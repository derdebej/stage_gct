import express from "express";
import db from "../db.js";

const router = express.Router();

router.put("/api/consultation/update", async (req, res) => {
  const { id_consultation, nombre_des_lots } = req.body;

  if (!id_consultation || nombre_des_lots == null) {
    return res.status(400).json({ error: "Champs manquants" });
  }

  try {
    await db.query(
      `UPDATE consultation
       SET nombre_des_lots = $1
       WHERE id_consultation = $2`,
      [nombre_des_lots, id_consultation]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Erreur mise à jour consultation:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
