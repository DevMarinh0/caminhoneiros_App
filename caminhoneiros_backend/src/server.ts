import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import cadastroRoutes from './routes/cadastro.routes';
import pdfRoutes from './routes/pdf.routes';
import resetRoutes from './routes/reset.routes';
import uploadRoutes from './routes/upload.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Criar pasta uploads se não existir
const uploadsDir = path.resolve(__dirname, '../uploads');
const cacheDir = path.resolve(__dirname, '../uploads/cache');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

// Configurar cache para arquivos estáticos
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads'), {
  maxAge: '1d', // Cache de 1 dia
  etag: true,
  lastModified: true
}));

// Use as rotas
app.use('/cadastros', cadastroRoutes);
app.use('/upload', uploadRoutes);
app.use('/pdf', pdfRoutes);
app.use('/reset-tudo', resetRoutes);

// Middleware de tratamento de erros global
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Erro na aplicação:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Ocorreu um erro ao processar sua solicitação'
  });
});

app.listen(3333, () => {
  console.log('Servidor está rodando na porta 3333');
});