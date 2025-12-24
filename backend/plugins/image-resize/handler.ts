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
  const { width, height } = req.body;

  if (!file) {
    return res.status(400).json({
      error: true,
      message: 'Image file is required'
    });
  }

  if (!width && !height) {
    cleanupFile(file);
    return res.status(400).json({
      error: true,
      message: 'Width or height is required'
    });
  }

  try {
    const resizedBuffer = await sharp(file.path)
      .resize(
        width ? parseInt(width) : undefined,
        height ? parseInt(height) : undefined,
        { fit: 'inside' }
      )
      .toBuffer();

    cleanupFile(file);

    const ext = file.mimetype.split('/')[1] || 'png';
    res.setHeader('Content-Type', file.mimetype);
    res.setHeader('Content-Disposition', `attachment; filename=resized.${ext}`);
    res.send(resizedBuffer);

  } catch (error) {
    cleanupFile(file);
    console.error('Image resize error:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to resize image'
    });
  }
};
