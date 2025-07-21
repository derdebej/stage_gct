import express from "express";
import pool from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  

  try {
    const result = await pool.query(
      "SELECT * FROM utilisateur WHERE email = $1 AND mot_de_passe = $2",
      [email, password]
    );

    if (result.rows.length > 0) {
      // Login success
      
      res.json({ success: true, user: result.rows[0] });
    } else {
      // Invalid credentials
      res.status(401).json({ success: false, error: "Identifiants invalides" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
});

export default router;
