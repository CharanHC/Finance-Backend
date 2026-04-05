import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { userService } from '../services/user.service';

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: user
  });
});

export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.listUsers(req.query as any);

  res.status(200).json({
    success: true,
    message: 'Users fetched successfully',
    data: result
  });
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.id);

  res.status(200).json({
    success: true,
    message: 'User fetched successfully',
    data: user
  });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.updateUser(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: user
  });
});

export const updateUserStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await userService.updateUserStatus(
      req.params.id,
      req.body.status
    );

    res.status(200).json({
      success: true,
      message: 'User status updated successfully',
      data: user
    });
  }
);