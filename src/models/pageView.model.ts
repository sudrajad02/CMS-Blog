import { Schema, model, Document, Types } from 'mongoose';

export interface IPageView extends Document {
  article: Types.ObjectId;
  userAgent?: string;
  ipAddress?: string;
  referrer?: string;
  createdAt: Date;
}

const pageViewSchema = new Schema<IPageView>(
  {
    article: { 
      type: Schema.Types.ObjectId, 
      ref: 'Article', 
      required: true 
    },
    userAgent: { type: String },
    ipAddress: { type: String },
    referrer: { type: String }
  },
  { 
    timestamps: { createdAt: true, updatedAt: false } 
  }
);

// Index untuk optimasi query
pageViewSchema.index({ article: 1 });
pageViewSchema.index({ createdAt: 1 });

export const PageView = model<IPageView>('PageView', pageViewSchema);