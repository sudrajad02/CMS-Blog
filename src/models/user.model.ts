import { Schema, model, Document, Types, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUser extends Document, IUserMethods {
  _id: Types.ObjectId;
  name: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserModel extends Model<IUser> {
  findByUsername(username: string): Promise<IUser>;
}

const userSchema = new Schema<IUser, IUserMethods>(
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

userSchema.method('comparePassword', async function(
  this: IUser,
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
});

export const User = model<IUser, UserModel>('User', userSchema);