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
  const { quality } = req.body;

  if (!file) {
    return res.status(400).json({
      error: true,
      message: 'Image file is required'
    });
  }

  try {
    const qualityValue = quality ? parseInt(quality) : 80;
    const ext = file.mimetype.split('/')[1] || 'jpeg';

    let sharpInstance = sharp(file.path);
    let compressedBuffer: Buffer;

    if (ext === 'png') {
      compressedBuffer = await sharpInstance
        .png({ quality: qualityValue, compressionLevel: 9 })
        .toBuffer();
    } else if (ext === 'webp') {
      compressedBuffer = await sharpInstance
        .webp({ quality: qualityValue })
        .toBuffer();
    } else {
      compressedBuffer = await sharpInstance
        .jpeg({ quality: qualityValue })
        .toBuffer();
    }

    cleanupFile(file);

    res.setHeader('Content-Type', file.mimetype);
    res.setHeader('Content-Disposition', `attachment; filename=compressed.${ext}`);
    res.send(compressedBuffer);

  } catch (error) {
    cleanupFile(file);
    console.error('Image compress error:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to compress image'
    });
  }
};
