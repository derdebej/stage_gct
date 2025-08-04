import express from "express";
import db from "../db.js";
const router = express.Router();

router.get('/api/receptions', async (req, res) => {
  const search = req.query.search?.toLowerCase() || ''
  try {
    const result = await db.query(
      `
      SELECT * FROM reception
      WHERE 
        CAST(id_reception AS TEXT) ILIKE $1 OR
        TO_CHAR(date, 'YYYY-MM-DD') ILIKE $1 OR
        CAST(montant_recue AS TEXT) ILIKE $1
      ORDER BY date DESC
      `,
      [`%${search}%`]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})
export default router;
