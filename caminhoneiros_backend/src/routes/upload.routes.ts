import { Response, Router } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';


const router = Router();

const uploadDir = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

// Configuração do multer para aceitar arquivos grandes
const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // Aumentando o limite para 25MB por arquivo
  }
});

// Função para tratamento de erros de upload
const handleUploadError = (err: any, res: Response) => {
  if (err instanceof multer.MulterError) {
    // Erro do Multer (tamanho de arquivo, etc)
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        error: 'Arquivo muito grande',
        message: 'O tamanho máximo permitido é 25MB por arquivo'
      });
    }
    return res.status(400).json({ error: err.message });
  } else if (err) {
    // Outro tipo de erro
    return res.status(500).json({ error: 'Erro no upload de arquivo', message: err.message });
  }
};

router.post('/', (req, res) => {
  upload.array('fotos', 6)(req, res, (err) => {
    if (err) {
      return handleUploadError(err, res);
    }

    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      }

      // Processar os arquivos e retornar as URLs
      const urls = files.map(file => `/uploads/${file.filename}`);
      console.log(`Upload concluído: ${files.length} arquivos processados`);

      res.json({
        urls,
        success: true,
        message: `${files.length} fotos enviadas com sucesso`
      });
    } catch (error: any) {
      console.error('Erro ao processar upload:', error);
      res.status(500).json({ error: 'Erro ao processar upload', message: error.message });
    }
  });
});

export default router;