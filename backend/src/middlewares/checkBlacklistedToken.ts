import { Request, Response, NextFunction } from 'express';
import { BlacklistedToken } from '@models/BlacklistedToken';

export const checkBlacklistedToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Токен отсутствует' });
    return;
  }

  try {
    const blacklistedToken = await BlacklistedToken.findOne({
      where: { token },
    });
    if (blacklistedToken) {
      res.status(401).json({ error: 'Токен недействителен' });
      return;
    }

    next();
  } catch (error) {
    console.error('Ошибка при проверке токена:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};
