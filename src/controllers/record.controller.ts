import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { recordService } from '../services/record.service';

export const createRecord = asyncHandler(async (req: Request, res: Response) => {
  const record = await recordService.createRecord(req.body, req.user!.id);

  res.status(201).json({
    success: true,
    message: 'Record created successfully',
    data: record
  });
});

export const listRecords = asyncHandler(async (req: Request, res: Response) => {
  const result = await recordService.listRecords(req.query as any);

  res.status(200).json({
    success: true,
    message: 'Records fetched successfully',
    data: result
  });
});

export const getRecordById = asyncHandler(async (req: Request, res: Response) => {
  const record = await recordService.getRecordById(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Record fetched successfully',
    data: record
  });
});

export const updateRecord = asyncHandler(async (req: Request, res: Response) => {
  const record = await recordService.updateRecord(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Record updated successfully',
    data: record
  });
});

export const deleteRecord = asyncHandler(async (req: Request, res: Response) => {
  const result = await recordService.deleteRecord(req.params.id);

  res.status(200).json({
    success: true,
    message: result.message,
    data: result
  });
});