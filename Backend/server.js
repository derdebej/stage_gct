import express from 'express';
import cors from 'cors';
import path from "path";
import demandesRoutes from './routes/demandes.js';
import articlesRoutes from './routes/articles.js';
import evaluationRoutes from './routes/evaluation.js';
import offreRoutes from './routes/offre.js';
import loginRoutes from './routes/login.js';
import inscriptionRoutes from './routes/inscription.js';
import multer from 'multer';
import { parsePDF } from './parser.js';
import db from './db.js';
import { deleteDemandeDA } from './routes/DeleteDa.js';
import searchRoutes from './routes/Search.js';
import consultationRoutes from './routes/consultations.js';
import enrigistrerConsultationRoutes from './routes/enrigistrerConsultation.js'
import updateProfileRoute from "./routes/updateProfile.js";
import consultationDetailsRoute from './routes/consultationDetails.js';
import deleteConsultationRoute from './routes/deleteConsultation.js';
import fournisseursRoute from './routes/fournisseurs.js'
import ajouterFournisseuRoute from './routes/ajouterFournisseur.js'
import updateDaRoute from './routes/updateDa.js'
import DaNonTraiteeRoute from './routes/DaNonTraitée.js'
import removeDaConsRoute from './routes/removeDaCons.js'
import ajouterLotRoute from'./routes/ajouterLot.js'
import updateConsRoute from './routes/updateCons.js'
import DaRelatedRoute from './routes/DaRelated.js' 
import LotOffreRoute from './routes/LotOffre.js'
import offreLotRoute from './routes/offreLot.js'
import offreInsertRoute from './routes/offreInsert.js'
import ListeOffreRoute from './routes/ListeOffre.js'
import AjouterEvalRoute from './routes/ajouterEvaluation.js'
import deleteOffreRoute from './routes/deleteOffre.js'
import deleteArticleRoute from './routes/deleteArticle.js'
import deleteEvalRoute from './routes/deleteEval.js'
import ConsOffreRoute from './routes/ConsOffre.js'
import lotsByOffreRouter from "./routes/lotsByOffre.js";
import receptionRoute from './routes/reception.js'
import commandeRoutes from "./routes/commande.js"; 
import articleConsultationRoute from './routes/articleConsultation.js'

import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));


function convertFrToISO(frDateStr) {
  const [day, month, year] = frDateStr.split("/"); 
  return `${year}-${month}-${day}`; 
}
const upload = multer({ dest: 'uploads/' }); 

app.post('/upload', upload.single('pdf'), async (req, res) => {
    try {
        console.log("==== REQ FILE ====");
        console.log(req.file);

        const result = await parsePDF(req.file.path);
        console.log("✅ Résultat du parsing:", result);

        const id_da = result.numero || null;

        if (!id_da) {
          return res.status(400).json({ message: "Le champ 'id_da' est manquant dans le PDF." });
        }
        const basePath = process.env.BASE_PDF_PATH;

        const folderPath = path.join(basePath, "/Demande d'achat/",id_da);
        const newFilePath = path.join(folderPath, req.file.originalname);
        const relativePath = `/Demande d'achat/${id_da}/${req.file.originalname}`;
        console.log(relativePath)

        await fs.mkdir(folderPath, { recursive: true });

        await fs.rename(req.file.path, newFilePath);

        res.json(result);
    } catch (err) {
      console.error("Erreur upload:", err.message);
      res.status(400).json({ message: err.message || "Erreur lors de l'analyse du fichier PDF." });
    }
});
app.post("/enregistrer-demande", async (req, res) => {

  const { numero, demandeur , date, titre ,articles , coutTotale , type , numAED , objet, userid, fileName} = req.body;
  //console.log("Données reçues :", req.body);
  const etat = "Non Traitée";
  const isodate = convertFrToISO(date);
  const chemin_document = "/Demande d'achat/" + fileName;
  try {
    
    const result = await db.query(
      "INSERT INTO demande_d_achat (id_da, demandeur, titre, date, etat, montant, nature, objet, numaed, id_utilisateur, chemin_document) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",  
      [numero, demandeur, titre, isodate, etat, coutTotale, type, objet, numAED, userid, chemin_document]
    );
    console.log("✅ Demande d'achat insérée avec succès");
    

    
    for (const article of articles) {
      await db.query(
        "INSERT INTO article (id_da, id_article, designation, description, quantite, prix_unitaire) VALUES ($1, $2, $3, $4, $5, $6)",
        [numero, article.code, article.designation, article.detail, parseInt(article.quantity), parseFloat(article.unit_price.replace(",", ".")) ]
      );
    }

    res.status(200).json({ message: "Demande enregistrée avec succès 🚀" });
  } catch (err) {
    console.error("Erreur lors de l'insertion :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});
app.use("/api/article-consultation", articleConsultationRoute);
app.use("/api/commandes", commandeRoutes);
app.use(receptionRoute)
app.use("/api/lots-by-offre", lotsByOffreRouter);
app.use('/api/consultation-offre',ConsOffreRoute)
app.use("/api/article-delete",deleteArticleRoute)
app.use("/api/evaluation-delete",deleteEvalRoute)
app.use("/api/offre-delete",deleteOffreRoute)
app.use("/api/evaluation-insert",AjouterEvalRoute)
app.use("/api/offres",ListeOffreRoute)
app.use("/api", offreInsertRoute);
app.use("/api", offreLotRoute);
app.use("/api/LotsOffre", LotOffreRoute);
app.use(DaRelatedRoute);
app.use(updateConsRoute);
app.use(ajouterLotRoute);
app.use(updateDaRoute);
app.use("/api", removeDaConsRoute)
app.use("/api", DaNonTraiteeRoute);
app.use(updateDaRoute);
app.use('/api/ajouter-fournisseur', ajouterFournisseuRoute)
app.use('/api/fournisseurs', fournisseursRoute)
app.use(deleteConsultationRoute);
app.use(consultationDetailsRoute);
app.use(updateProfileRoute);
app.use('/api/enrigistrer-consultation', enrigistrerConsultationRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/search', searchRoutes); 
app.use('/api/demandes', demandesRoutes);
app.delete("/api/demande/:id", deleteDemandeDA);
app.use('/api/articles', articlesRoutes);
app.use(evaluationRoutes);
app.use(offreRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/inscription', inscriptionRoutes);
app.use('/pdfs', express.static('C:/Users/nader/Downloads'));

app.listen(3001, () => {
  console.log('Serveur backend Node.js démarré sur http://localhost:3001');
});
