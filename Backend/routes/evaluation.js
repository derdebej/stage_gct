import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get("/api/evaluation", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const search = req.query.search || "";
  const limit = 10;
  const offset = (page - 1) * limit;

  const evals = await db.query(
    `SELECT * FROM evaluation 
     WHERE CAST(id_eval AS TEXT) ILIKE $1 OR CAST(id_offre AS TEXT) ILIKE $1
     ORDER BY date DESC
     LIMIT $2 OFFSET $3`,
    [`%${search}%`, limit, offset]
  );

  const count = await db.query(
    `SELECT COUNT(*) FROM evaluation 
     WHERE CAST(id_eval AS TEXT) ILIKE $1 OR CAST(id_offre AS TEXT) ILIKE $1`,
    [`%${search}%`]
  );

  res.json({
    evaluations: evals.rows,
    totalPages: Math.ceil(count.rows[0].count / limit),
  });
});

export default router;
