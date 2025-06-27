import express from 'express';
import { PageViewController } from '../controllers/pageView.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

// Public endpoint untuk tracking
router.post('/', PageViewController.trackView);

// Protected endpoints untuk analytics
router.get('/count', 
  authMiddleware.authenticate, 
  PageViewController.getViewCount
);

router.get('/aggregate', 
  authMiddleware.authenticate,
  PageViewController.getAggregatedViews
);

export default router;