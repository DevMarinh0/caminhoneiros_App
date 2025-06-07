import cors from 'cors';
import express from 'express';
import path from 'path';
import cadastroRoutes from './routes/cadastro.routes';
import pdfRoutes from './routes/pdf.routes';
import uploadRoutes from './routes/upload.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Use as rotas
app.use('/cadastros', cadastroRoutes);
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));
app.use('/upload', uploadRoutes);
app.use('/pdf', pdfRoutes);

app.listen(3333, () => {
  console.log('Servidor esta rodando Na Porta 3333');
});