import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { search = "" } = req.query;

  try {
    const result = await pool.query(
      `
      SELECT *
      FROM consultation
      WHERE 
        CAST(id_consultation AS TEXT) ILIKE $1
        OR CAST(nombre_des_lots AS TEXT) ILIKE $1
      ORDER BY date_creation DESC
      LIMIT 50
      `,
      [`%${search}%`]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des consultations:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
