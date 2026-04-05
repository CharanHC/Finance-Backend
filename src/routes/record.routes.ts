import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';
import { validateRequest } from '../middleware/validateRequest';
import {
  createRecordSchema,
  recordIdParamSchema,
  recordListQuerySchema,
  updateRecordSchema
} from '../validators/record.validators';
import {
  createRecord,
  deleteRecord,
  getRecordById,
  listRecords,
  updateRecord
} from '../controllers/record.controller';

const router = Router();

router.use(authMiddleware);

router.get(
  '/',
  requireRole('ANALYST', 'ADMIN'),
  validateRequest(recordListQuerySchema, 'query'),
  listRecords
);

router.get(
  '/:id',
  requireRole('ANALYST', 'ADMIN'),
  validateRequest(recordIdParamSchema, 'params'),
  getRecordById
);

router.post(
  '/',
  requireRole('ADMIN'),
  validateRequest(createRecordSchema),
  createRecord
);

router.patch(
  '/:id',
  requireRole('ADMIN'),
  validateRequest(recordIdParamSchema, 'params'),
  validateRequest(updateRecordSchema),
  updateRecord
);

router.delete(
  '/:id',
  requireRole('ADMIN'),
  validateRequest(recordIdParamSchema, 'params'),
  deleteRecord
);

export default router;