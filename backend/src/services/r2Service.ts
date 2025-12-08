import { PutObjectCommand } from '@aws-sdk/client-s3';
import r2Client from '../config/r2';
import prisma from '../config/database';

export const backupFeedbackToR2 = async (): Promise<void> => {
  try {
    console.log('[R2 Backup] Starting feedback backup...');

    // Get all feedback that hasn't been backed up
    const feedbacks = await prisma.feedback.findMany({
      where: {
        backedUpToR2: false,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (feedbacks.length === 0) {
      console.log('[R2 Backup] No new feedback to backup');
      return;
    }

    // Create backup file name with current date
    const date = new Date().toISOString().split('T')[0];
    const fileName = `backup/feedback/${date}.json`;

    // Convert feedback to JSON
    const backupData = {
      backupDate: new Date().toISOString(),
      count: feedbacks.length,
      data: feedbacks,
    };

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: JSON.stringify(backupData, null, 2),
      ContentType: 'application/json',
    });

    await r2Client.send(command);

    // Mark feedback as backed up
    const feedbackIds = feedbacks.map((f) => f.id);
    await prisma.feedback.updateMany({
      where: {
        id: {
          in: feedbackIds,
        },
      },
      data: {
        backedUpToR2: true,
      },
    });

    console.log(
      `[R2 Backup] Successfully backed up ${feedbacks.length} feedback items to ${fileName}`
    );
  } catch (error) {
    console.error('[R2 Backup] Error backing up feedback:', error);
    throw error;
  }
};
