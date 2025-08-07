import express from "express";
import db from "../db.js";

const router = express.Router();

router.post("/api/ajouter-demande", async (req, res) => {
  const { id_lot, id_consultation, id_da } = req.body;

  if (!id_consultation || !id_da) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // Get consultation type first
    const result = await db.query(
      `SELECT type FROM consultation WHERE id_consultation = $1`,
      [id_consultation]
    );

    const consultationType = result.rows[0]?.type;

    if (!consultationType) {
      return res.status(404).json({ error: "Consultation introuvable" });
    }

    if (consultationType === "equipement") {
      if (!id_lot) {
        return res.status(400).json({ error: "id_lot is required for equipement" });
      }

      // Insert into lot
      await db.query(
        `INSERT INTO lot (id_lot, id_consultation, id_da)
         VALUES ($1, $2, $3)`,
        [id_lot, id_consultation, id_da]
      );
    } else if (consultationType === "consommable") {
      // Insert into consultation_da
      await db.query(
        `INSERT INTO consultation_da (id_consultation, id_da)
         VALUES ($1, $2)`,
        [id_consultation, id_da]
      );
    }

    // Update etat of the demande
    await db.query(
      `UPDATE demande_d_achat SET etat = $1 WHERE id_da = $2`,
      ["En Cours", id_da]
    );

    res.status(201).json({ success: true });

  } catch (err) {
    console.error("❌ Error in ajouterDemande:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;