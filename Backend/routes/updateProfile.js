// routes/updateProfile.js
import express from "express";
import pool from "../db.js";

const router = express.Router();

router.put("/api/utilisateur/:id", async (req, res) => {
  const { id } = req.params;
  const { nom, email, date_de_naissance, password } = req.body;

  try {
    const client = await pool.connect();

    let query;
    let values;

    if (password && password.trim() !== "") {
      query = `
        UPDATE utilisateur
        SET nom = $1, email = $2, date_de_naissance = $3, mot_de_passe = $4
        WHERE id_utilisateur = $5
        RETURNING id_utilisateur, nom, email, date_de_naissance;
      `;
      values = [nom, email, date_de_naissance, password, id];
    } else {
      query = `
        UPDATE utilisateur
        SET nom = $1, email = $2, date_de_naissance = $3
        WHERE id_utilisateur = $4
        RETURNING id_utilisateur, nom, email, date_de_naissance;
      `;
      values = [nom, email, date_de_naissance, id];
    }

    const result = await client.query(query, values);
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Erreur lors de la mise à jour du profil:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
