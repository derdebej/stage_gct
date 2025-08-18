// routes/commande.js
import express from "express";
import db from "../db.js";

const router = express.Router();

/**
 * POST /api/commande-insert
 * Payload: {
 *   id_consultation,
 *   id_fournisseur,
 *   date_commande,
 *   items: [
 *     { id_offre ,id_article OR id_lot }
 *   ]
 * }
 */
router.post("/commande-insert", async (req, res) => {
  const client = await db.connect();
  try {
    const { id_consultation, id_fournisseur, date_commande, items } = req.body;

    if (!id_consultation || !id_fournisseur || !date_commande || !items?.length) {
      return res.status(400).json({ error: "Champs manquants" });
    }

    // 1. Check consultation type
    const consultationRes = await client.query(
      `SELECT type FROM consultation WHERE id_consultation = $1`,
      [id_consultation]
    );
    if (consultationRes.rowCount === 0) {
      return res.status(404).json({ error: "Consultation introuvable" });
    }
    const type = consultationRes.rows[0].type;

    await client.query("BEGIN");

    // 2. Insert commande
    const insertCmd = await client.query(
      `INSERT INTO commande (id_consultation, id_fournisseur, date)
       VALUES ($1, $2, $3)
       RETURNING id_commande`,
      [id_consultation, id_fournisseur, date_commande]
    );
    const id_commande = insertCmd.rows[0].id_commande;

    // 3. Insert accepted items
    console.log("Items to insert:", items);
    if (type === "consommable") {
      for (const item of items) {
        await client.query(
          `INSERT INTO commande_article (id_commande, id_offre, id_article, id_da)
           VALUES ($1, $2, $3, $4)`,
          [id_commande, item.id_offre, item.id_item, item.id_da]
        );
      }
    } else {
      for (const item of items) {
        await client.query(
          `INSERT INTO commande_lot (id_commande, id_offre, id_lot)
           VALUES ($1, $2, $3)`,
          [id_commande, item.id_offre, item.id_item]
        );
      }
    }

    await client.query("COMMIT");

    res.json({
      id_commande,
      id_consultation,
      id_fournisseur,
      date_commande,
      items,
      type,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erreur ajout commande:", err);
    res.status(500).json({ error: "Erreur serveur lors de l'ajout de la commande" });
  } finally {
    client.release();
  }
});

export default router;
