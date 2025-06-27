import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { ApiResponse } from '../utils/apiResponse';
import { IUser } from '../models/user.model';

export const UserController = {
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserService.createUser(req.body);
      ApiResponse.created(res, {
        _id: user._id,
        name: user.name,
        username: user.username,
        createdAt: user.createdAt
      });
    } catch (error: any) {
      if (error.code === 11000) {
        ApiResponse.error(res, 'Username already exists', 409);
      } else {
        ApiResponse.error(res, error.message);
      }
    }
  },

  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserService.getUsers();
      ApiResponse.success(res, users);
    } catch (error: any) {
      ApiResponse.error(res, error.message);
    }
  },

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserService.getUserById(req.params.id);
      if (!user) {
        return ApiResponse.notFound(res, 'User not found');
      }
      ApiResponse.success(res, user);
    } catch (error: any) {
      ApiResponse.error(res, error.message);
    }
  },

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      if (!user) {
        return ApiResponse.notFound(res, 'User not found');
      }
      ApiResponse.success(res, user);
    } catch (error: any) {
      ApiResponse.error(res, error.message);
    }
  },

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      await UserService.deleteUser(req.params.id);
      ApiResponse.success(res, null, 'User deleted successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message);
    }
  }
};