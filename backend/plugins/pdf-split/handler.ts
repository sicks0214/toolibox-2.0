import { Request, Response } from 'express';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import archiver from 'archiver';

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
    const pageCount = pdf.getPageCount();

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=split-pages.zip');

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);

    for (let i = 0; i < pageCount; i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(page);
      const pageBytes = await newPdf.save();
      archive.append(Buffer.from(pageBytes), { name: `page-${i + 1}.pdf` });
    }

    await archive.finalize();
    cleanupFiles([file]);

  } catch (error) {
    cleanupFiles([file]);
    console.error('PDF split error:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to split PDF'
    });
  }
};
