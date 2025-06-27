import { Request, Response } from 'express';
import { ArticleService } from '../services/article.service';
import { ApiResponse } from '../utils/apiResponse';

export const ArticleController = {
  async createArticle(req: Request, res: Response) {
    try {
      const article = await ArticleService.createArticle({
        ...req.body,
        author: req.user.id
      });
      ApiResponse.created(res, article);
    } catch (error) {
      ApiResponse.error(res, error);
    }
  },

  async getPublishedArticles(req: Request, res: Response) {
    try {
      const articles = await ArticleService.getPublishedArticles();
      ApiResponse.success(res, articles);
    } catch (error) {
      ApiResponse.error(res, error);
    }
  },

  async getUserArticles(req: Request, res: Response) {
    try {
      const articles = await ArticleService.getUserArticles(req.user.id);
      ApiResponse.success(res, articles);
    } catch (error) {
      ApiResponse.error(res, error);
    }
  },

  async getArticleById(req: Request, res: Response) {
    try {
      const article = await ArticleService.getArticleById(
        req.params.id, 
        req.user.id
      );
      
      if (!article) return ApiResponse.notFound(res, 'Article not found');
      
      ApiResponse.success(res, article);
    } catch (error) {
      ApiResponse.error(res, error);
    }
  },

  async updateArticle(req: Request, res: Response) {
    try {
      const article = await ArticleService.updateArticle(
        req.params.id,
        req.body,
        req.user.id
      );
      ApiResponse.success(res, article);
    } catch (error) {
      ApiResponse.error(res, error);
    }
  },

  async deleteArticle(req: Request, res: Response) {
    try {
      await ArticleService.deleteArticle(req.params.id, req.user.id);
      ApiResponse.success(res, null, 'Article deleted successfully');
    } catch (error) {
      ApiResponse.error(res, error);
    }
  },
}