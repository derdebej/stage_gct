import db from "../db";
import express from "express";

const router = express.Router()

router.post("/",(req,body) => {
  const {id_da} = req.body

  db.query(
    "DELETE FROM demande_d_achat WHERE id_da = ($1)"
    [id_da],
    (err,result) => {
      if (err) {
        console.log("DB error: ",err)
        return res.status(500).json({ message: "Erreur" });
      }
      return res.json({ message: "Demande d'achat supprimée avec succès." });
    }
  );
})