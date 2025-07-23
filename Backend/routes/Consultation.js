import express from "express";
import pool from "../db.js";

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM consultation');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;