import express from 'express';
import db from '../db.js';

const router = express.Router();

router.post("/offres/:id_offre/lots", async (req, res) => {
  const { lots } = req.body;
  const { id_offre } = req.params;

  const values = lots.map((lotId) => `(${id_offre}, ${lotId})`).join(",");
  await db.query(
    `INSERT INTO offre_lot (id_offre, id_lot) VALUES ${values}`
  );

  res.sendStatus(200);
});
export default router;