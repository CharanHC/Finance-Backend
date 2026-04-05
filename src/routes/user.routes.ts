import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';
import { validateRequest } from '../middleware/validateRequest';
import {
  createUserSchema,
  updateUserSchema,
  updateUserStatusSchema,
  userIdParamSchema,
  userListQuerySchema
} from '../validators/user.validators';
import {
  createUser,
  getUserById,
  listUsers,
  updateUser,
  updateUserStatus
} from '../controllers/user.controller';

const router = Router();

router.use(authMiddleware);
router.use(requireRole('ADMIN'));

router.get(
  '/',
  validateRequest(userListQuerySchema, 'query'),
  listUsers
);

router.post('/', validateRequest(createUserSchema), createUser);

router.get(
  '/:id',
  validateRequest(userIdParamSchema, 'params'),
  getUserById
);

router.patch(
  '/:id',
  validateRequest(userIdParamSchema, 'params'),
  validateRequest(updateUserSchema),
  updateUser
);

router.patch(
  '/:id/status',
  validateRequest(userIdParamSchema, 'params'),
  validateRequest(updateUserStatusSchema),
  updateUserStatus
);

export default router;