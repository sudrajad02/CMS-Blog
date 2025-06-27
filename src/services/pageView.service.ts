import { PageView, IPageView } from '../models/pageView.model';
import { Article } from '../models/article.model';
import { ApiError } from '../utils/apiError';
import { Types } from 'mongoose';

export class PageViewService {
  static async trackView(
    articleId: string,
    metadata?: {
      userAgent?: string;
      ipAddress?: string;
      referrer?: string;
    }
  ): Promise<IPageView> {
    // Validasi article exists
    const article = await Article.findById(articleId);
    if (!article) {
      throw new ApiError(404, 'Article not found');
    }

    return await PageView.create({
      article: articleId,
      ...metadata
    });
  }

  static async getViewCount(
    articleId?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<number> {
    const filter: any = {};
    
    if (articleId) filter.article = articleId;
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = startDate;
      if (endDate) filter.createdAt.$lte = endDate;
    }

    return await PageView.countDocuments(filter);
  }

  static async getAggregatedViews(
    interval: 'hourly' | 'daily' | 'monthly',
    articleId?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{ date: string; views: number }[]> {
    const match: any = {};
    
    if (articleId) match.article = new Types.ObjectId(articleId);
    
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = startDate;
      if (endDate) match.createdAt.$lte = endDate;
    }

    let dateFormat: string;
    switch (interval) {
      case 'hourly': dateFormat = '%Y-%m-%d %H:00:00'; break;
      case 'daily': dateFormat = '%Y-%m-%d'; break;
      case 'monthly': dateFormat = '%Y-%m'; break;
      default: dateFormat = '%Y-%m-%d';
    }

    const aggregation = await PageView.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            $dateToString: { format: dateFormat, date: "$createdAt" }
          },
          views: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: "$_id",
          views: 1,
          _id: 0
        }
      }
    ]);

    return aggregation;
  }
}