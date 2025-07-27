import express from "express";
import pool from "../db.js";

const router = express.Router()



router.get('/', async (req, res) => {
  const { search = '', page = 1, limit = 10 } = req.query;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const offset = (pageNum - 1) * limitNum;
  const searchPattern = `%${search}%`;

  try {
    let articlesQuery;
    let countQuery;
    let values;

    if (search) {
      articlesQuery = `
        SELECT * FROM article
        WHERE 
          CAST(id_article AS TEXT) ILIKE $1 OR
          CAST(id_da AS TEXT) ILIKE $1 OR
          description ILIKE $1 OR
          designation ILIKE $1
        ORDER BY id_article DESC
        LIMIT $2 OFFSET $3
      `;

      countQuery = `
        SELECT COUNT(*) FROM article
        WHERE 
          CAST(id_article AS TEXT) ILIKE $1 OR
          CAST(id_da AS TEXT) ILIKE $1 OR
          description ILIKE $1 OR
          designation ILIKE $1
      `;

      values = [searchPattern, limitNum, offset];
    } else {
      articlesQuery = `
        SELECT * FROM article
        ORDER BY id_article DESC
        LIMIT $1 OFFSET $2
      `;

      countQuery = `SELECT COUNT(*) FROM article`;
      values = [limitNum, offset];
    }

    const articlesResult = await pool.query(articlesQuery, values);
    const countResult = await pool.query(
      countQuery,
      search ? [searchPattern] : []
    );

    const totalItems = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalItems / limitNum);

    res.json({
      data: articlesResult.rows,
      totalItems,
      totalPages,
      currentPage: pageNum,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
export default router;