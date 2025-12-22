import { Router } from 'express';
import { upload } from '../middleware/upload';
import { mergePDF, splitPDF, compressPDF } from '../controllers/pdfController';

const router = Router();

// PDF合并 - 支持多文件上传
router.post('/pdf/merge', upload.array('files', 20), mergePDF);

// PDF分割 - 单文件上传
router.post('/pdf/split', upload.single('file'), splitPDF);

// PDF压缩 - 单文件上传
router.post('/pdf/compress', upload.single('file'), compressPDF);

export default router;
