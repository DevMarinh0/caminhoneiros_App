import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Middleware para tratar erros
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const criarCadastro = asyncHandler(async (req: Request, res: Response) => {
  const { transportadora, nome, placa, destino, dataCadastro, fotos } = req.body;

  const cadastro = await prisma.cadastro.create({
    data: {
      transportadora,
      nome,
      placa,
      destino,
      dataCadastro,
      fotos: { create: fotos.map((url: string) => ({ url })) }
    },
    include: { fotos: true }
  });
  res.json(cadastro);
});

export const listarCadastros = asyncHandler(async (req: Request, res: Response) => {
  const cadastros = await prisma.cadastro.findMany({ include: { fotos: true } });
  res.json(cadastros);
});

export const buscarCadastros = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req.query;
  let where: any = {};

  if (query) {
    where.OR = [
      { nome: { contains: String(query), mode: 'insensitive' } },
      { placa: { contains: String(query), mode: 'insensitive' } }
    ];
  }

  const cadastros = await prisma.cadastro.findMany({
    where,
    include: { fotos: true }
  });
  res.json(cadastros);
});

export const excluirCadastro = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const cadastroId = Number(id);

  // Primeiro, buscar o cadastro para obter as fotos
  const cadastro = await prisma.cadastro.findUnique({
    where: { id: cadastroId },
    include: { fotos: true }
  });

  if (!cadastro) {
    return res.status(404).json({ error: 'Cadastro não encontrado' });
  }

  // Excluir as fotos físicas do servidor
  const baseDir = path.resolve(__dirname, '../../uploads');
  for (const foto of cadastro.fotos) {
    try {
      if (foto.url) {
        const nomeArquivo = foto.url.replace(/^\/uploads\//, '');
        const fotoPath = path.join(baseDir, nomeArquivo);

        if (fs.existsSync(fotoPath)) {
          fs.unlinkSync(fotoPath);
          console.log(`Arquivo excluído: ${fotoPath}`);
        }
      }
    } catch (err) {
      console.error(`Erro ao excluir arquivo: ${err}`);
      // Continua mesmo se houver erro ao excluir arquivo
    }
  }

  // Excluir as fotos do banco de dados
  await prisma.foto.deleteMany({
    where: { cadastroId }
  });

  // Excluir o cadastro
  await prisma.cadastro.delete({
    where: { id: cadastroId }
  });

  res.json({ success: true, message: 'Cadastro excluído com sucesso' });
});