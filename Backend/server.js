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

const app = express();
app.use(cors());
app.use(express.json());


const upload = multer({ dest: 'uploads/' }); // dossiers où Multer sauvegarde temporairement tes fichiers

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


app.use('/api/demandes', demandesRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/evaluation', evaluationRoutes);
app.use('/api/offre', offreRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/inscription', inscriptionRoutes);


app.listen(3001, () => {
  console.log('Serveur backend Node.js démarré sur http://localhost:3001');
});
