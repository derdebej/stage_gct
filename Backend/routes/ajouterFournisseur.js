import express from "express";
import pool from "../db.js";

const router = express.Router()


router.post('/', async (req, res) => {
  const { nom, email, num_tel } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO fournisseur (nom, email, num_tel)
       VALUES ($1, $2, $3) RETURNING *`,
      [nom, email, num_tel]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de l'ajout du fournisseur" });
  }
});
export default router;