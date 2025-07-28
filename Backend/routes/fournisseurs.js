import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const search = req.query.search || '';
  try {
    const results = await pool.query(
      `SELECT * FROM fournisseur
       WHERE CAST(id_fournisseur AS TEXT) ILIKE $1 OR nom ILIKE $1 OR email ILIKE $1 OR num_tel ILIKE $1`,
      [`%${search}%`]
    );
    res.json(results.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});
export default router;