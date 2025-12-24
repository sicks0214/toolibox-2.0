import { Request, Response } from 'express';
import sharp from 'sharp';
import fs from 'fs';

const cleanupFile = (file: Express.Multer.File) => {
  try {
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  } catch (error) {
    console.error('Error cleaning up file:', error);
  }
};

export default async (req: Request, res: Response) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({
      error: true,
      message: 'Image file is required'
    });
  }

  try {
    const resultBuffer = await sharp(file.path)
      .ensureAlpha()
      .png()
      .toBuffer();

    cleanupFile(file);

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'attachment; filename=no-background.png');
    res.send(resultBuffer);

  } catch (error) {
    cleanupFile(file);
    console.error('Remove background error:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to remove background'
    });
  }
};
