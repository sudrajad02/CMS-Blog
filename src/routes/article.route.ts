import express from 'express';
import { ArticleController } from '../controllers/article.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { body } from 'express-validator';

const router = express.Router();

// Public routes
router.get('/', ArticleController.getPublishedArticles);

// Protected routes
router.get('/my-articles', 
  authMiddleware.authenticate,
  ArticleController.getUserArticles
);

router.get('/:id', 
  authMiddleware.authenticate,
  ArticleController.getArticleById
);

router.post(
  '/',
  authMiddleware.authenticate,
  validate([
    body('title')
      .notEmpty().withMessage('Title is required')
      .isLength({ max: 100 }).withMessage('Title too long'),
    body('content')
      .notEmpty().withMessage('Content is required')
      .isLength({ min: 50 }).withMessage('Content too short'),
    body('status')
      .optional()
      .isIn(['draft', 'published']).withMessage('Invalid status')
  ]),
  ArticleController.createArticle
);

router.put(
  '/:id',
  authMiddleware.authenticate,
  validate([
    body('title')
      .optional()
      .isLength({ max: 100 }).withMessage('Title too long'),
    body('content')
      .optional()
      .isLength({ min: 50 }).withMessage('Content too short'),
    body('status')
      .optional()
      .isIn(['draft', 'published']).withMessage('Invalid status')
  ]),
  ArticleController.updateArticle
);

router.delete(
  '/:id',
  authMiddleware.authenticate,
  ArticleController.deleteArticle
);

export default router;