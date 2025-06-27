import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';
import { IUser } from '../models/user.model';

export const UserService = {
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  },

  async createUser(userData: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>): Promise<IUser> {
    const hashedPassword = await this.hashPassword(userData.password);
    return await User.create({ 
      ...userData, 
      password: hashedPassword 
    });
  },

  async getUsers(): Promise<IUser[]> {
    return await User.find().select('-password');
  },

  async getUserById(id: string): Promise<IUser | null> {
    return await User.findById(id).select('-password');
  },

  async getUserByUsername(username: string): Promise<IUser | null> {
    return await User.findOne({ username }).select('+password');
  },

  async updateUser(
    id: string, 
    updateData: Partial<IUser>
  ): Promise<IUser | null> {
    if (updateData.password) {
      updateData.password = await this.hashPassword(updateData.password);
    }
    return await User.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true }
    ).select('-password');
  },

  async deleteUser(id: string): Promise<void> {
    await User.findByIdAndDelete(id);
  },

  async verifyPassword(
    candidatePassword: string, 
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
};