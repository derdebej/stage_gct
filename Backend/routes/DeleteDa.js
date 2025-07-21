// controllers/DeleteDa.js
import pool from "../db.js";

export const deleteDemandeDA = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Delete all lots related to this demande
    await pool.query("DELETE FROM lot WHERE id_da = $1", [id]);

    // 2. Delete all articles related to this demande
    await pool.query("DELETE FROM article WHERE id_da = $1", [id]);

    // 3. Delete the demande_d_achat itself
    await pool.query("DELETE FROM demande_d_achat WHERE id_da = $1", [id]);

    res.status(200).json({ message: "Demande d'achat et éléments associés supprimés." });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).json({ error: "Erreur serveur lors de la suppression" });
  }
};
