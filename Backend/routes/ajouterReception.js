import express from "express";
import db from "../db.js";

const router = express.Router();

router.post("/receptions-insert", async (req, res) => {
  const { id_commande, date_reception, items } = req.body;

  if (!id_commande || !date_reception || !Array.isArray(items)) {
    return res.status(400).json({ error: "Paramètres manquants ou invalides" });
  }

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const commandeRes = await client.query(
      "SELECT type FROM commande WHERE id_commande = $1",
      [id_commande]
    );

    if (commandeRes.rowCount === 0) {
      throw new Error("Commande introuvable");
    }

    const commandeType = commandeRes.rows[0].type;

    const receptionRes = await client.query(
      `INSERT INTO reception (id_commande, date, type)
       VALUES ($1, $2, $3)
       RETURNING id_reception`,
      [id_commande, date_reception, commandeType]
    );

    const id_reception = receptionRes.rows[0].id_reception;

    if (commandeType === "consommable") {
      for (const item of items) {
        await client.query(
          `INSERT INTO reception_article (id_reception, id_commande_article, quantite_recue)
           VALUES ($1, $2, $3)`,
          [id_reception, item.id_commande_article, item.quantite_recue]
        );
      }
    } else if (commandeType === "equipement") {
      for (const item of items) {
        await client.query(
          `INSERT INTO reception_lot (id_reception, id_commande_lot, recu)
           VALUES ($1, $2, $3)`,
          [id_reception, item.id_commande_lot, item.recu]
        );
      }
    } else {
      throw new Error("Type de commande invalide");
    }

    await client.query("COMMIT");
    const date = new Date(date_reception).toISOString().split("T")[0];
    const type = commandeType === "consommable" ? "Consommable" : "Equipement";
    res.status(201).json({
      id_reception,
      id_commande,
      date,
      items,
      type,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erreur insertion réception:", err);
    res.status(500).json({ error: "Erreur lors de l'ajout de la réception" });
  } finally {
    client.release();
  }
});

export default router;
