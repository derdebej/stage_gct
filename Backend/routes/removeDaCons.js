import express from "express";
import db from "../db.js";

const router = express.Router();

router.delete("/consultation/remove-da", async (req, res) => {
  const { id_da, id_consultation } = req.body;

  if (!id_da || !id_consultation) {
    return res.status(400).json({ error: "Missing id_da or id_consultation" });
  }

  try {
    const typeResult = await db.query(
      `SELECT type FROM consultation WHERE id_consultation = $1`,
      [id_consultation]
    );

    if (typeResult.rowCount === 0) {
      return res.status(404).json({ error: "Consultation not found" });
    }

    const consultationType = typeResult.rows[0].type;

    if (consultationType === "equipement") {
      await db.query(
        `DELETE FROM lot WHERE id_da = $1 AND id_consultation = $2`,
        [id_da, id_consultation]
      );
    } else if (consultationType === "consommable") {
      await db.query(
        `DELETE FROM consultation_da WHERE id_da = $1 AND id_consultation = $2`,
        [id_da, id_consultation]
      );
    }

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
