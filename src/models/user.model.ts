import { Schema, model, Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { 
      type: String, 
      required: [true, 'Name is required'],
      trim: true
    },
    username: { 
      type: String, 
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true
    },
    password: { 
      type: String, 
      required: [true, 'Password is required'],
      select: false
    }
  },
  { 
    timestamps: true,
    versionKey: false
  }
);

// Index untuk optimasi query
userSchema.index({ username: 1 });

export const User = model<IUser>('User', userSchema);