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
  const files = req.files as Express.Multer.File[];

  if (!files || files.length < 2) {
    return res.status(400).json({
      error: true,
      message: 'At least 2 PDF files are required'
    });
  }

  try {
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const pdfBytes = fs.readFileSync(file.path);
      const pdf = await PDFDocument.load(pdfBytes);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach(page => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    cleanupFiles(files);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=merged.pdf');
    res.send(Buffer.from(mergedPdfBytes));

  } catch (error) {
    cleanupFiles(files);
    console.error('PDF merge error:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to merge PDFs'
    });
  }
};
