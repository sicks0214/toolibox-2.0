import { Router } from 'express';
import { submitFeedback } from '../controllers/feedbackController';

const router = Router();

router.post('/feedback', submitFeedback);

export default router;
