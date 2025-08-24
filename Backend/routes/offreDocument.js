import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import db from "../db.js";

dotenv.config();

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/api/upload-offre-document", upload.single("document"), async (req, res) => {
  const { id_offre, id_consultation, fournisseur_name } = req.body;

  if (!req.file) return res.status(400).json({ error: "Aucun fichier fourni" });

  const basePath = process.env.BASE_PDF_PATH;
  if (!basePath) return res.status(500).json({ error: "BASE_PDF_PATH non défini" });

  const safeFournisseur = fournisseur_name.replace(/\s+/g, "_");
  const relativePath = path.join("Offre", id_consultation, safeFournisseur, `${id_offre}.pdf`);
  const targetPath = path.join(basePath, relativePath);

  try {
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });

    fs.copyFile(req.file.path, targetPath, async (err) => {
      fs.unlink(req.file.path, () => {});

      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur lors de la copie du fichier" });
      }

      try {
        await db.query(
          "UPDATE offre SET chemin_document = $1 WHERE id_offre = $2",
          [relativePath.replace(/\\/g, "/"), id_offre]
        );

        return res.status(200).json({
          message: "Fichier uploadé et chemin mis à jour",
          chemin_document: relativePath.replace(/\\/g, "/"),
        });
      } catch (dbErr) {
        console.error("Erreur BDD:", dbErr);
        return res.status(500).json({ error: "Erreur lors de la mise à jour de l'offre" });
      }
    });
  } catch (error) {
    console.error("Erreur création dossier:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
