import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/User';

dotenv.config();

interface UserPayload {
  exp: number;
  id: number;
}

const generateToken = (user: User): string => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: '1h',
  });
};

const verifyToken = (token: string): UserPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as UserPayload;
  } catch {
    return null;
  }
};

export { generateToken, verifyToken };
