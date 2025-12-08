import express from 'express';
import dotenv from 'dotenv';
import { corsMiddleware } from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
import feedbackRoutes from './routes/feedback';
import healthRoutes from './routes/health';
import authRoutes from './routes/auth';
import { startBackupCron } from './services/backupCron';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);

// Routes
app.use('/api', feedbackRoutes);
app.use('/api', healthRoutes);
app.use('/api', authRoutes);

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📝 API: http://localhost:${PORT}/api`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);

  // Start backup cron job
  if (process.env.NODE_ENV === 'production') {
    startBackupCron();
  } else {
    console.log('[Dev Mode] Backup cron job is disabled in development');
  }
});

export default app;
