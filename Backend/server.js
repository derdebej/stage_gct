import express from 'express';
import cors from 'cors';
import demandesRoutes from './routes/demandes.js';
import articlesRoutes from './routes/articles.js';
import evaluationRoutes from './routes/evaluation.js';
import offreRoutes from './routes/offre.js';
import loginRoutes from './routes/login.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/demandes', demandesRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/evaluation', evaluationRoutes);
app.use('/api/offre', offreRoutes);
app.use('/api/login', loginRoutes);



app.listen(3001, () => {
  console.log('Serveur backend Node.js démarré sur http://localhost:3001');
});
