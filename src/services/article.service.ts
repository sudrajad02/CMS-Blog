import { Article, IArticle } from '../models/article.model';
import { ApiError } from '../utils/apiError';

export const ArticleService = {
  async createArticle(articleData: Omit<IArticle, '_id' | 'createdAt' | 'updatedAt'>): Promise<IArticle> {
    return await Article.create(articleData);
  },

  async getPublishedArticles(): Promise<IArticle[]> {
    return await Article.find({ status: 'published' })
      .populate('author', 'name username')
      .sort({ createdAt: -1 });
  },

  async getUserArticles(userId: string): Promise<IArticle[]> {
    return await Article.find({ author: userId })
      .populate('author', 'name username')
      .sort({ createdAt: -1 });
  },

  async getArticleById(id: string, userId?: string): Promise<IArticle | null> {
    const article = await Article.findById(id).populate('author', 'name username');
    
    if (!article) {
      throw new ApiError(404, 'Article not found');
    }

    if (article.status === 'draft' && article.author._id.toString() !== userId) {
      throw new ApiError(403, 'You do not have permission to view this draft');
    }

    return article;
  },

  async updateArticle(
    id: string, 
    updateData: Partial<IArticle>,
    userId: string
  ): Promise<IArticle | null> {
    const article = await Article.findById(id);
    
    if (!article) {
      throw new ApiError(404, 'Article not found');
    }

    if (article.author.toString() !== userId) {
      throw new ApiError(403, 'You are not the author of this article');
    }
    
    return await Article.findByIdAndUpdate(id, updateData, { new: true });
  },

  async deleteArticle(id: string, userId: string): Promise<void> {
    const article = await Article.findById(id);
    
    if (!article) {
      throw new ApiError(404, 'Article not found');
    }

    if (article.author.toString() !== userId) {
      throw new ApiError(403, 'You are not the author of this article');
    }

    await Article.deleteOne({ _id: id, author: userId });
  }
}