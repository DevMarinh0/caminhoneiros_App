import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const criarCadastro = async (req: Request, res: Response) => {
  const { transportadora, nome, placa, destino, dataCadastro, fotos } = req.body;
  try {
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
  } catch (error) {
    console.error(error); // Agora o erro está sendo usado
    res.status(500).json({ error: 'Erro ao criar cadastro' });
  }
};

export const listarCadastros = async (req: Request, res: Response) => {
  try {
    const cadastros = await prisma.cadastro.findMany({ include: { fotos: true } });
    res.json(cadastros);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao listar cadastros' });
  }
};

export const buscarCadastros = async (req: Request, res: Response) => {
  const { nome, placa } = req.query;
  let where: any = {};
  const or: any[] = [];
  if (nome) or.push({ nome: { contains: String(nome), mode: 'insensitive' } });
  if (placa) or.push({ placa: { contains: String(placa), mode: 'insensitive' } });
  if (or.length > 0) where.OR = or;

  try {
    const cadastros = await prisma.cadastro.findMany({
      where,
      include: { fotos: true }
    });
    res.json(cadastros);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar cadastros' });
  }
};