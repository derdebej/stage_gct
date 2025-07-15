import express from "express";
import db from "../db.js";
const router = express.Router();

router.post("/", (req, res) => {
  const { nomPrenom, email, password ,dateNaissance} = req.body;
  const role = "admin"; 
  console.log("Received:", { nomPrenom, email, password ,dateNaissance});


  if (!nomPrenom || !email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  db.query(
    "INSERT INTO utilisateur (nom, email, role , mdp ,date_de_naissance) VALUES ($1, $2, $3, $4, $5)",
    [nomPrenom, email, role, password, dateNaissance],
    (err, result) => {
      if (err) {
        console.error("DB Insert Error:", err);
        return res.status(500).json({ message: "Erreur lors de l'inscription." });
      }
      return res.json({ message: "Compte créé avec succès." });
    }
  );
});

export default router;
