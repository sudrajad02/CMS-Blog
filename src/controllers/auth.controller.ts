import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { ApiResponse } from '../utils/apiResponse';

export const AuthController = {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      const { user, token } = await AuthService.login(username, password);
      
      ApiResponse.success(res, { user, token }, 'Login successful');
    } catch (error: any) {
      ApiResponse.error(res, error);
    }
  },

  async logout(req: Request, res: Response) {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (token) {
        await AuthService.logout(token);
      }
      
      ApiResponse.success(res, null, 'Logout successful');
    } catch (error) {
      ApiResponse.error(res, error);
    }
  },

  async getCurrentUser(req: Request, res: Response) {
    try {
      const user = await UserService.getUserById(req.user.id);
      ApiResponse.success(res, user);
    } catch (error) {
      ApiResponse.error(res, error);
    }
  }
}