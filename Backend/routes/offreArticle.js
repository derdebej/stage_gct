import express from 'express';
import db from '../db.js';

const router = express.Router();

router.post("/offres/:id_offre/articles", async (req, res) => {
  const { articles } = req.body;
  const { id_offre } = req.params;

  if (!Array.isArray(articles)) {
    return res.status(400).json({ error: "Articles must be an array" });
  }

  const values = [];
  const params = [];

  articles.forEach((article, index) => {
    values.push(
      `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`
    );
    params.push(id_offre, article.id_article, article.id_da, article.montant);
  });

  const query = `
    INSERT INTO offre_article (id_offre, id_article, id_da, montant)
    VALUES ${values.join(", ")}
  `;

  try {
    await db.query(query, params);
    res.sendStatus(200);
  } catch (error) {
    console.error("Erreur lors de l'insertion des articles:", error);
    res.status(500).json({ error: "Erreur serveur lors de l'ajout des articles" });
  }
});

export default router;