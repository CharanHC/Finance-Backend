import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { dashboardService } from '../services/dashboard.service';

export const summary = asyncHandler(async (_req: Request, res: Response) => {
  const data = await dashboardService.getSummary();

  res.status(200).json({
    success: true,
    message: 'Dashboard summary fetched successfully',
    data
  });
});

export const recentActivity = asyncHandler(
  async (req: Request, res: Response) => {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const data = await dashboardService.getRecentActivity(limit);

    res.status(200).json({
      success: true,
      message: 'Recent activity fetched successfully',
      data
    });
  }
);

export const categoryTotals = asyncHandler(async (_req: Request, res: Response) => {
  const data = await dashboardService.getCategoryTotals();

  res.status(200).json({
    success: true,
    message: 'Category totals fetched successfully',
    data
  });
});

export const monthlyTrend = asyncHandler(async (_req: Request, res: Response) => {
  const data = await dashboardService.getMonthlyTrend();

  res.status(200).json({
    success: true,
    message: 'Monthly trend fetched successfully',
    data
  });
});