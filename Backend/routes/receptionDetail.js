import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/receptions/:id_reception/detail", async (req, res) => {
  const client = await db.connect();
  try {
    const { id_reception } = req.params;

    const receptionQuery = await client.query(
      `SELECT r.id_reception, r.date, r.id_commande, 
              c.id_consultation, cons.type
       FROM reception r
       JOIN commande c ON r.id_commande = c.id_commande
       JOIN consultation cons ON c.id_consultation = cons.id_consultation
       WHERE r.id_reception = $1`,
      [id_reception]
    );

    if (receptionQuery.rows.length === 0) {
      return res.status(404).json({ error: "Réception non trouvée" });
    }

    const reception = receptionQuery.rows[0];
    let articles = [];
    let lots = [];

    if (reception.type === "consommable") {
      const articleQuery = await client.query(
        `SELECT ra.id_reception,
                a.id_article,
                a.id_da,
                a.designation,
                ra.quantite_recue
         FROM reception_article ra
         JOIN commande_article ca ON ra.id_commande_article = ca.id_commande_article
         JOIN article a ON ca.id_article = a.id_article AND ca.id_da = a.id_da
         WHERE ra.id_reception = $1`,
        [id_reception]
      );
      articles = articleQuery.rows;
    } else {
      const lotQuery = await client.query(
        `SELECT rl.id_reception,
                l.id_lot,
                rl.recu
         FROM reception_lot rl
         JOIN commande_lot cl ON rl.id_commande_lot = cl.id_commande_lot
         JOIN lot l ON cl.id_lot = l.id_lot
         WHERE rl.id_reception = $1`,
        [id_reception]
      );
      lots = lotQuery.rows;
    }

    res.json({
      id_reception: reception.id_reception,
      date_reception: reception.date,
      id_commande: reception.id_commande,
      id_consultation: reception.id_consultation,
      consultation_type: reception.type,
      articles,
      lots,
    });
  } catch (err) {
    console.error("Erreur dans /receptions/:id_reception/detail", err);
    res.status(500).json({ error: "Erreur serveur" });
  } finally {
    client.release();
  }
});

export default router;
