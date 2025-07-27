import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const offset = (pageNum - 1) * limitNum;

  try {
    const dataResult = await db.query(
      `SELECT * FROM consultation ORDER BY id_consultation DESC LIMIT $1 OFFSET $2`,
      [limitNum, offset]
    );

    const countResult = await db.query(`SELECT COUNT(*) FROM consultation`);
    const totalItems = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalItems / limitNum);

    res.json({
      data: dataResult.rows,
      totalItems,
      totalPages,
      currentPage: pageNum,
    });
  } catch (err) {
    console.error("Erreur lors du fetch consultation :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
