import express from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { body } from 'express-validator';

const router = express.Router();

// Public routes
router.get('/', UserController.getUsers);
router.get('/:id', UserController.getUserById);

// Protected routes
router.post(
  '/',
  authMiddleware.authenticate,
  validate([
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ max: 50 }).withMessage('Name must be less than 50 characters'),
    
    body('username')
      .trim()
      .notEmpty().withMessage('Username is required')
      .isLength({ min: 3, max: 20 }).withMessage('Username must be 3-20 characters')
      .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers and underscores'),
    
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  ]),
  UserController.createUser
);

router.put(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeSelf,
  validate([
    body('name')
      .optional()
      .trim()
      .notEmpty().withMessage('Name cannot be empty'),
    
    body('username')
      .optional()
      .trim()
      .isLength({ min: 3, max: 20 }).withMessage('Username must be 3-20 characters'),
    
    body('password')
      .optional()
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  ]),
  UserController.updateUser
);

router.delete(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeSelf,
  UserController.deleteUser
);

export default router;