import { Request, Response } from 'express';
import { PageViewService } from '../services/pageView.service';
import { ApiResponse } from '../utils/apiResponse';

export const PageViewController = {
  async trackView(req: Request, res: Response) {
    try {
      const { articleId } = req.body;
      const metadata = {
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
        referrer: req.headers['referer']
      };

      await PageViewService.trackView(articleId, metadata);
      ApiResponse.success(res, null, 'View tracked');
    } catch (error) {
      ApiResponse.error(res, error);
    }
  },

  async getViewCount(req: Request, res: Response) {
    try {
      const { article, startAt, endAt } = req.query;
      
      const count = await PageViewService.getViewCount(
        article?.toString(),
        startAt ? new Date(startAt.toString()) : undefined,
        endAt ? new Date(endAt.toString()) : undefined
      );
      
      ApiResponse.success(res, { count });
    } catch (error) {
      ApiResponse.error(res, error);
    }
  },

  async getAggregatedViews(req: Request, res: Response) {
    try {
      const { interval, article, startAt, endAt } = req.query;
      
      if (!interval || !['hourly', 'daily', 'monthly'].includes(interval.toString())) {
        return ApiResponse.error(res, 'Invalid interval', 400);
      }

      const data = await PageViewService.getAggregatedViews(
        interval as 'hourly' | 'daily' | 'monthly',
        article?.toString(),
        startAt ? new Date(startAt.toString()) : undefined,
        endAt ? new Date(endAt.toString()) : undefined
      );

      ApiResponse.success(res, data);
    } catch (error) {
      ApiResponse.error(res, error);
    }
  }
}