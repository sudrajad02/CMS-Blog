import { Schema, model, Document, Types } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  content: string;
  status: 'draft' | 'published';
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const articleSchema = new Schema<IArticle>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      minlength: [50, 'Content too short']
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft'
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { 
    timestamps: true,
    versionKey: false 
  }
);

// Index untuk optimasi query
articleSchema.index({ title: 'text', status: 1 });

export const Article = model<IArticle>('Article', articleSchema);