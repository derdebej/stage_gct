import express from "express";
import pool from "../db.js";

const router = express.Router();

// DELETE /api/evaluation/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM evaluation WHERE id_eval = $1", [id]);
    res.status(200).json({ message: "Évaluation supprimée avec succès." });
  } catch (error) {
    console.error("Erreur suppression évaluation:", error);
    res.status(500).json({ error: "Erreur suppression évaluation." });
  }
});

export default router;
