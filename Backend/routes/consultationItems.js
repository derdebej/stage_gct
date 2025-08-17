import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/:id_consultation/items", async (req, res) => {
  const { id_consultation } = req.params;

  try {
    const { rows: consultationRows } = await db.query(
      "SELECT type FROM consultation WHERE id_consultation = $1",
      [id_consultation]
    );

    if (consultationRows.length === 0) {
      return res.status(404).json({ error: "Consultation non trouvée" });
    }

    const type = consultationRows[0].type;

    if (type === "consommable") {
      const { rows } = await db.query(
        `SELECT a.id_article, a.designation, a.id_da
         FROM consultation_da cda
         JOIN article a ON a.id_da = cda.id_da
         WHERE cda.id_consultation = $1`,
        [id_consultation]
      );
      return res.json(rows);
    } else {
      const { rows } = await db.query(
        `SELECT l.id_lot, l.id_da
         FROM lot l
         WHERE l.id_consultation = $1`,
        [id_consultation]
      );
      return res.json(rows);
    }
  } catch (err) {
    console.error("Erreur fetch items:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
