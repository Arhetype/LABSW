import { Response } from 'express';
import { User } from '../models/User';
import { AuthRequest } from '../types/AuthRequest';

export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
// ... existing code ...

export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
// ... existing code ...

export const deleteUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
// ... existing code ...
} 