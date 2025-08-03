import express from "express";
import pool from "../db.js";

const router = express.Router();

// DELETE /api/offre/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM offre WHERE id_offre = $1", [id]);
    res.status(200).json({ message: "Offre supprimée avec succès." });
  } catch (error) {
    console.error("Erreur suppression offre:", error);
    res.status(500).json({ error: "Erreur suppression offre." });
  }
});

export default router;
