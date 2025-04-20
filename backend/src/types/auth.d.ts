import { Request } from 'express';
import { User } from '../models/User';

declare global {
  namespace Express {
    interface User {
      id: number;
      name: string;
      email: string;
      password: string;
      createdAt: Date;
      updatedAt: Date;
    }
  }
}

export interface AuthRequest extends Request {
  user?: User;
} 