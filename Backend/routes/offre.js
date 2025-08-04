import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get("/api/offre", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const search = req.query.search || "";
  const limit = 10;
  const offset = (page - 1) * limit;

  const result = await db.query(
    `SELECT * FROM offre WHERE id_offre::text ILIKE $1 OR id_fournisseur::text ILIKE $1 ORDER BY date_offre DESC LIMIT $2 OFFSET $3`,
    [`%${search}%`, limit, offset]
  );

  const countResult = await db.query(
    `SELECT COUNT(*) FROM offre WHERE id_offre::text ILIKE $1 OR id_fournisseur::text ILIKE $1`,
    [`%${search}%`]
  );

  const total = parseInt(countResult.rows[0].count);
  const totalPages = Math.ceil(total / limit);

  res.json({ offres: result.rows, totalPages });
});


export default router;
