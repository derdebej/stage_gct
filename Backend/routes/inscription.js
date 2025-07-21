import express from "express";
import db from "../db.js";
const router = express.Router();

router.post("/", (req, res) => {
  const { nomPrenom, email, password ,dateNaissance} = req.body;
   
  console.log("Received:", { nomPrenom, email, password ,dateNaissance});


  if (!nomPrenom || !email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  db.query(
    "INSERT INTO utilisateur (nom, email, mot_de_passe ,date_de_naissance) VALUES ($1, $2, $3, $4)",
    [nomPrenom, email, password, dateNaissance],
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
