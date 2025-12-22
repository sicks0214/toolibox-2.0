import { Request, Response } from 'express';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import r2Client from '../config/r2';

// 清理临时文件
const cleanupFiles = (files: Express.Multer.File[]) => {
  files.forEach(file => {
    try {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch (error) {
      console.error('Error cleaning up file:', error);
    }
  });
};

// 上传到R2
const uploadToR2 = async (buffer: Buffer, fileName: string): Promise<string> => {
  const key = `pdf-results/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: 'application/pdf',
  });

  await r2Client.send(command);

  // 返回R2公共URL（如果配置了自定义域名）
  // 或者返回key供后续下载
  return key;
};

// PDF合并
export const mergePDF = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];

  if (!files || files.length < 2) {
    return res.status(400).json({
      success: false,
      message: 'At least 2 PDF files are required'
    });
  }

  try {
    const mergedPdf = await PDFDocument.create();

    // 按顺序合并PDF
    for (const file of files) {
      const pdfBytes = fs.readFileSync(file.path);
      const pdf = await PDFDocument.load(pdfBytes);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach(page => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();

    // 清理上传的临时文件
    cleanupFiles(files);

    // 直接返回文件
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=merged.pdf');
    res.send(Buffer.from(mergedPdfBytes));

  } catch (error) {
    cleanupFiles(files);
    console.error('PDF merge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to merge PDFs'
    });
  }
};

// PDF分割
export const splitPDF = async (req: Request, res: Response) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({
      success: false,
      message: 'PDF file is required'
    });
  }

  try {
    const pdfBytes = fs.readFileSync(file.path);
    const pdf = await PDFDocument.load(pdfBytes);
    const pageCount = pdf.getPageCount();

    const results: Buffer[] = [];

    // 将每一页分割为单独的PDF
    for (let i = 0; i < pageCount; i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(page);
      const pdfBytes = await newPdf.save();
      results.push(Buffer.from(pdfBytes));
    }

    // 清理临时文件
    cleanupFiles([file]);

    // 返回分割后的PDF数量和下载信息
    res.json({
      success: true,
      pageCount,
      message: `PDF split into ${pageCount} pages`,
      // 实际应用中可以上传到R2并返回下载链接
    });

  } catch (error) {
    cleanupFiles([file]);
    console.error('PDF split error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to split PDF'
    });
  }
};

// PDF压缩（基础版本）
export const compressPDF = async (req: Request, res: Response) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({
      success: false,
      message: 'PDF file is required'
    });
  }

  try {
    const pdfBytes = fs.readFileSync(file.path);
    const pdf = await PDFDocument.load(pdfBytes);

    // pdf-lib的基础压缩（移除未使用的对象）
    const compressedBytes = await pdf.save({
      useObjectStreams: false,
    });

    // 清理临时文件
    cleanupFiles([file]);

    const originalSize = file.size;
    const compressedSize = compressedBytes.length;
    const compressionRatio = ((1 - compressedSize / originalSize) * 100).toFixed(2);

    // 直接返回压缩后的文件
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=compressed.pdf');
    res.send(Buffer.from(compressedBytes));

  } catch (error) {
    cleanupFiles([file]);
    console.error('PDF compress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to compress PDF'
    });
  }
};
