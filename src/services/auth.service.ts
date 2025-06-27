import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user.model';
import { ILoginResponse, IUserResponse } from '../intercaces/auth.response';
import { ApiError } from '../utils/apiError';

export const AuthService = {
  async login(
    username: string, 
    password: string
  ): Promise<{ user: IUserResponse; token: string }> {
    const user = await User.findOne({ username }).select('+password');
    
    if (!user) {
      throw new ApiError(401, 'Incorrect username or password');
    }

    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      throw new ApiError(401, 'Incorrect username or password');
    }

    const token = this.generateToken(user._id.toString());

    // Update last login (optional)

    return {
      user: {
        _id: user._id.toString(),
        name: user.name,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token
    };
  },

  async logout(token: string): Promise<void> {
    // Implementasi sederhana tanpa blacklist:
    // Di production, simpan token yang sudah logout
    console.log(`Token logged out: ${token}`);
  },

  generateToken(userId: string): string {
    if (!process.env.JWT_SECRET) {
      throw new ApiError(500, 'JWT secret not configured');
    }

    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );
  },

  verifyToken(token: string): { id: string } {
    if (!process.env.JWT_SECRET) {
      throw new ApiError(500, 'JWT secret not configured');
    }

    try {
      return jwt.verify(token, process.env.JWT_SECRET) as { id: string };
    } catch (error) {
      throw new ApiError(401, 'Invalid or expired token');
    }
  }
}