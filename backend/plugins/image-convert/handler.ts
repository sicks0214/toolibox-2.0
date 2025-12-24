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
  const { format } = req.body;

  if (!file) {
    return res.status(400).json({
      error: true,
      message: 'Image file is required'
    });
  }

  const validFormats = ['jpeg', 'jpg', 'png', 'webp'];
  const targetFormat = format?.toLowerCase() || 'png';

  if (!validFormats.includes(targetFormat)) {
    cleanupFile(file);
    return res.status(400).json({
      error: true,
      message: 'Invalid format. Supported: jpg, png, webp'
    });
  }

  try {
    const outputFormat = targetFormat === 'jpg' ? 'jpeg' : targetFormat;
    const convertedBuffer = await sharp(file.path)
      .toFormat(outputFormat as keyof sharp.FormatEnum)
      .toBuffer();

    cleanupFile(file);

    const mimeType = `image/${outputFormat}`;
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename=converted.${targetFormat}`);
    res.send(convertedBuffer);

  } catch (error) {
    cleanupFile(file);
    console.error('Image convert error:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to convert image'
    });
  }
};
