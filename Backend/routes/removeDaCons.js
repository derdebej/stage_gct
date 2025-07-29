import express from "express";
import db from "../db.js";

const router = express.Router();

router.delete("/consultation/remove-da", async (req, res) => {
  const { id_da, id_consultation } = req.body;

  if (!id_da || !id_consultation) {
    return res.status(400).json({ error: "Missing id_da or id_consultation" });
  }

  try {

    await db.query(
      `DELETE FROM lot WHERE id_da = $1 AND id_consultation = $2`,
      [id_da, id_consultation]
    );

    await db.query(
      `UPDATE demande_d_achat SET etat = 'Non Traitée' WHERE id_da = $1`,
      [id_da]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error in DELETE /consultation/remove-da:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
