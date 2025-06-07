import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();
const prisma = new PrismaClient();

router.get('/:id', async (req: any, res: any) => {
  const id = Number(req.params.id);
  const cadastro = await prisma.cadastro.findUnique({
    where: { id },
    include: { fotos: true }
  });

  if (!cadastro) {
    return res.status(404).json({ error: 'Cadastro não encontrado' });
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="cadastro_${cadastro.id}.pdf"`);

  const PDFDocument = (await import('pdfkit')).default;
  const doc = new PDFDocument();
  doc.pipe(res);

  doc.fontSize(20).text('Cadastro de Motorista', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Nome: ${cadastro.nome}`);
  doc.text(`Transportadora: ${cadastro.transportadora}`);
  doc.text(`Placa: ${cadastro.placa}`);
  doc.text(`Destino: ${cadastro.destino}`);
  doc.text(`Data do Cadastro: ${cadastro.dataCadastro}`);
  doc.moveDown();

  if (cadastro.fotos && cadastro.fotos.length > 0) {
    doc.fontSize(16).text('Fotos:', { underline: true });
    doc.moveDown(0.5);
    for (const foto of cadastro.fotos) {
      let nomeArquivo = '';
      if (foto.url) {
        nomeArquivo = foto.url.replace(/^\/+/, ''); // Remove barras iniciais
      }
      const fotoPath = path.resolve(__dirname, '../../uploads', nomeArquivo);
      if (fs.existsSync(fotoPath)) {
        doc.image(fotoPath, { width: 250 });
        doc.moveDown();
      }
    }
  }

  doc.end();
});

export default router;