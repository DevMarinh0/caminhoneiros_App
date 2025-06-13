import { PrismaClient } from '@prisma/client';
import { Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import fs from 'fs';
import path from 'path';

const router = Router();
const prisma = new PrismaClient();

router.delete('/', asyncHandler(async (req: Request, res: Response) => {
  // Apaga todas as fotos do banco
  await prisma.foto.deleteMany({});
  // Apaga todos os cadastros do banco
  await prisma.cadastro.deleteMany({});

  // Resetar as sequências de IDs (específico para PostgreSQL)
  try {
    await prisma.$executeRaw`ALTER SEQUENCE "Foto_id_seq" RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE "Cadastro_id_seq" RESTART WITH 1`;
  } catch (seqError) {
    console.error('Erro ao resetar sequências:', seqError);
    // Continua mesmo se houver erro ao resetar sequências
  }

  // Apaga todos os arquivos da pasta uploads
  const uploadDir = path.resolve(__dirname, '../../uploads');
  if (fs.existsSync(uploadDir)) {
    fs.readdirSync(uploadDir).forEach(file => {
      try {
        const filePath = path.join(uploadDir, file);
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error(`Erro ao apagar arquivo ${file}:`, err);
      }
    });
  }

  res.json({ ok: true, msg: 'Tudo apagado com sucesso! IDs resetados.' });
}));

export default router;