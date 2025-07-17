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

const app = express();
app.use(cors());
app.use(express.json());


const upload = multer({ dest: 'uploads/' }); 

app.post('/upload', upload.single('pdf'), async (req, res) => {
    try {
        console.log("==== REQ FILE ====");
        console.log(req.file);

        const result = await parsePDF(req.file.path);
        res.json(result);
    } catch (err) {
        console.error("Erreur:", err);
        res.status(500).send("Erreur pendant le parsing du PDF");
    }
});
app.post("/enregistrer-demande", async (req, res) => {

  const { numero, demandeur, titre, date, articles } = req.body;
  //console.log("Données reçues :", req.body);

  try {
    
    const result = await db.query(
      "INSERT INTO demande_d_achat (nom, demandeur, titre, date_creation) VALUES ($1, $2, $3, $4)",
      [numero, demandeur, titre, date]
    );
    console.log("✅ Demande d'achat insérée avec succès");
    

    
    for (const article of articles) {
      await db.query(
        "INSERT INTO article (id_da, position_code, designation, quantite, pu) VALUES ($1, $2, $3, $4, $5)",
        [numero, article.position_and_code, article.designation, parseInt(article.quantity), parseFloat(article.unit_price.replace(",", ".")) ]
      );
    }

    res.status(200).json({ message: "Demande enregistrée avec succès 🚀" });
  } catch (err) {
    console.error("Erreur lors de l'insertion :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.use('/api/demandes', demandesRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/evaluation', evaluationRoutes);
app.use('/api/offre', offreRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/inscription', inscriptionRoutes);


app.listen(3001, () => {
  console.log('Serveur backend Node.js démarré sur http://localhost:3001');
});
