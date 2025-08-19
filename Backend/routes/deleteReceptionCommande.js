import express from "express";
import db from "../db.js";

const router = express.Router();

router.delete("/commandes/:id_commande", async (req, res) => {
  const { id_commande } = req.params;

  try {
    const result = await db.query(
      "DELETE FROM commande WHERE id_commande = $1 RETURNING *",
      [id_commande]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }

    res.json({ message: "Commande supprimée avec succès" });
  } catch (err) {
    console.error("Erreur suppression commande:", err);
    res.status(500).json({ error: "Erreur lors de la suppression de la commande" });
  }
});

router.delete("/receptions/:id_reception", async (req, res) => {
  const { id_reception } = req.params;

  try {
    const result = await db.query(
      "DELETE FROM reception WHERE id_reception = $1 RETURNING *",
      [id_reception]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Réception non trouvée" });
    }

    res.json({ message: "Réception supprimée avec succès" });
  } catch (err) {
    console.error("Erreur suppression réception:", err);
    res.status(500).json({ error: "Erreur lors de la suppression de la réception" });
  }
});

export default router;
