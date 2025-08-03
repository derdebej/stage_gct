import express from "express";
import pool from "../db.js";

const router = express.Router();

// DELETE /api/article/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM article WHERE id_article = $1", [id]);
    res.status(200).json({ message: "Article supprimé avec succès." });
  } catch (error) {
    console.error("Erreur suppression article:", error);
    res.status(500).json({ error: "Erreur suppression article." });
  }
});

export default router;
