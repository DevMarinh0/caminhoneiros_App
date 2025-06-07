//import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
//import fs from 'fs';
//import path from 'path';
import { buscarCadastros, criarCadastro, listarCadastros } from '../controllers/cadastro.controllers';

const router = Router();
//const prisma = new PrismaClient();

router.post('/', criarCadastro);
router.get('/', listarCadastros);
router.get('/busca', buscarCadastros);

/*router.delete('/reset-tudo', async (req, res) => {
  try {
    // Apaga todas as fotos do banco
    await prisma.foto.deleteMany({});
    // Apaga todos os cadastros do banco
    await prisma.cadastro.deleteMany({});

    // Apaga todos os arquivos da pasta uploads
    const uploadDir = path.resolve(__dirname, '../../uploads');
    if (fs.existsSync(uploadDir)) {
      fs.readdirSync(uploadDir).forEach(file => {
        fs.unlinkSync(path.join(uploadDir, file));
      });
    }

    res.json({ ok: true, msg: 'Tudo apagado com sucesso!' });
  } catch (e) {
    res.status(500).json({ error: 'Erro ao apagar tudo', details: e });
  }
});
*/
export default router;