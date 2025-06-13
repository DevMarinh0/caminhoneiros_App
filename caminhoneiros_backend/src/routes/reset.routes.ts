// caminhoneiros_backend/src/routes/reset.routes.ts
/*import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();
const prisma = new PrismaClient();

router.delete('/', async (req, res) => {
  try {
    // Apaga todas as fotos do banco
    await prisma.foto.deleteMany({});
    // Apaga todos os cadastros do banco
    await prisma.cadastro.deleteMany({});

    // Resetar as sequências de IDs (específico para SQLite)
    await prisma.$executeRawUnsafe('DELETE FROM sqlite_sequence WHERE name="Cadastro"');
    await prisma.$executeRawUnsafe('DELETE FROM sqlite_sequence WHERE name="Foto"');

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
  } catch (e) {
    console.error('Erro ao resetar:', e);
    res.status(500).json({ error: 'Erro ao apagar tudo', details: e });
  }
});

export default router;
*/