import express from 'express';
import cors from 'cors';
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
import consultationRoutes from './routes/consultation.js';
import enrigistrerConsultationRoutes from './routes/enrigistrerConsultation.js'
import updateProfileRoute from "./routes/updateProfile.js";
import consultationDetailsRoute from './routes/consultationDetails.js';
import deleteConsultationRoute from './routes/deleteConsultation.js';

const app = express();
app.use(cors());
app.use(express.json());

function convertFrToISO(frDateStr) {
  const [day, month, year] = frDateStr.split("/"); // "16/04/2024"
  return `${year}-${month}-${day}`; // → "2024-04-16"
}
const upload = multer({ dest: 'uploads/' }); 

app.post('/upload', upload.single('pdf'), async (req, res) => {
    try {
        console.log("==== REQ FILE ====");
        console.log(req.file);

        const result = await parsePDF(req.file.path);
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
app.use(deleteConsultationRoute);
app.use(consultationDetailsRoute);
app.use(updateProfileRoute);
app.use('/api/enrigistrer-consultation', enrigistrerConsultationRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/search', searchRoutes); 
app.use('/api/demandes', demandesRoutes);
app.delete("/api/demande/:id", deleteDemandeDA);
app.use('/api/articles', articlesRoutes);
app.use('/api/evaluation', evaluationRoutes);
app.use('/api/offre', offreRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/inscription', inscriptionRoutes);


app.listen(3001, () => {
  console.log('Serveur backend Node.js démarré sur http://localhost:3001');
});
