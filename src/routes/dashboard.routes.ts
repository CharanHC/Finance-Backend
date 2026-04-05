import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';
import { validateRequest } from '../middleware/validateRequest';
import { recentActivityQuerySchema } from '../validators/dashboard.validators';
import {
  categoryTotals,
  monthlyTrend,
  recentActivity,
  summary
} from '../controllers/dashboard.controller';

const router = Router();

router.use(authMiddleware);

router.get('/summary', summary);
router.get(
  '/recent-activity',
  validateRequest(recentActivityQuerySchema, 'query'),
  recentActivity
);

router.get('/category-totals', requireRole('ANALYST', 'ADMIN'), categoryTotals);
router.get('/monthly-trend', requireRole('ANALYST', 'ADMIN'), monthlyTrend);

export default router;