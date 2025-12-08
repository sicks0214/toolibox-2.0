import cron from 'node-cron';
import { backupFeedbackToR2 } from './r2Service';

export const startBackupCron = () => {
  // Run backup every day at 2:00 AM
  cron.schedule('0 2 * * *', async () => {
    console.log('[Cron] Starting scheduled backup...');
    try {
      await backupFeedbackToR2();
      console.log('[Cron] Backup completed successfully');
    } catch (error) {
      console.error('[Cron] Backup failed:', error);
    }
  });

  console.log('[Cron] Backup schedule started: Daily at 2:00 AM');
};
