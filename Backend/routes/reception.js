import express from "express";
import db from "../db.js";
const router = express.Router();

router.get('/api/reception', async (req, res) => {
  const search = req.query.search?.toLowerCase() || '';
  const page = parseInt(req.query.page) || 1;
  const limit = 10; // Number of results per page
  const offset = (page - 1) * limit;

  try {
    // Fetch paginated results
    const result = await db.query(
      `
      SELECT * FROM reception
      WHERE 
        CAST(id_reception AS TEXT) ILIKE $1 OR
        TO_CHAR(date, 'YYYY-MM-DD') ILIKE $1 OR
        CAST(montant_recue AS TEXT) ILIKE $1
      ORDER BY date DESC
      LIMIT $2 OFFSET $3
      `,
      [`%${search}%`, limit, offset]
    );

    // Fetch total count for pagination
    const countResult = await db.query(
      `
      SELECT COUNT(*) FROM reception
      WHERE 
        CAST(id_reception AS TEXT) ILIKE $1 OR
        TO_CHAR(date, 'YYYY-MM-DD') ILIKE $1 OR
        CAST(montant_recue AS TEXT) ILIKE $1
      `,
      [`%${search}%`]
    );

    const totalRows = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalRows / limit);

    res.json({
      receptions: result.rows,
      totalPages,
    });
  } catch (err) {
    console.error("Erreur dans /api/receptions:", err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
