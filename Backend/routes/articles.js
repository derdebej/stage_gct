import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { search } = req.query;

  try {
    let result;

    if (search) {
      const searchPattern = `%${search}%`;

      result = await pool.query(
        `
        SELECT * FROM article
        WHERE 
          CAST(id_article AS TEXT) ILIKE $1 OR
          CAST(id_da AS TEXT) ILIKE $1 OR
          description ILIKE $1 OR
          designation ILIKE $1
        `,
        [searchPattern]
      );
    } else {
      result = await pool.query('SELECT * FROM article');
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
