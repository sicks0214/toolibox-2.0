import { Request, Response } from 'express';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';

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

export default async (req: Request, res: Response) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({
      error: true,
      message: 'PDF file is required'
    });
  }

  try {
    const pdfBytes = fs.readFileSync(file.path);
    const pdf = await PDFDocument.load(pdfBytes);

    const compressedBytes = await pdf.save({
      useObjectStreams: false,
    });

    cleanupFiles([file]);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=compressed.pdf');
    res.send(Buffer.from(compressedBytes));

  } catch (error) {
    cleanupFiles([file]);
    console.error('PDF compress error:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to compress PDF'
    });
  }
};
