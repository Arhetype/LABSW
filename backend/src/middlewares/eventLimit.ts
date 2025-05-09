import { Request, Response, NextFunction } from 'express';
import { Event } from '@models/Event';
import dotenv from 'dotenv';
import { Op } from 'sequelize';

dotenv.config();

const DAILY_EVENT_LIMIT = parseInt(process.env.DAILY_EVENT_LIMIT || '5', 10);

export const checkEventLimit = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { createdBy } = req.body;

  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const eventsCount = await Event.count({
      where: {
        createdBy,
        createdAt: {
          [Op.gte]: twentyFourHoursAgo,
        },
      },
    });

    if (eventsCount >= DAILY_EVENT_LIMIT) {
      res.status(429).json({
        error: `Превышен лимит создания мероприятий. Лимит: ${DAILY_EVENT_LIMIT} в день.`,
      });
      return;
    }

    next();
  } catch (error) {
    console.error('Ошибка при проверке лимита мероприятий:', error);
    res.status(500).json({ error: 'Ошибка при проверке лимита мероприятий' });
  }
};
