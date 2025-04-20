import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import {
  addParticipant,
  removeParticipant,
  getEventParticipants,
  getParticipantCount,
  isUserParticipating,
} from '../controllers/eventParticipantController';
import { Request, Response } from 'express';

const router = Router();

// Добавление участника к событию
router.post('/events/:eventId/participants', authenticate, (req: Request, res: Response) => {
  addParticipant(req as any, res);
});

// Удаление участника из события
router.delete('/events/:eventId/participants', authenticate, (req: Request, res: Response) => {
  removeParticipant(req as any, res);
});

// Получение списка участников события
router.get('/events/:eventId/participants', authenticate, (req: Request, res: Response) => {
  getEventParticipants(req as any, res);
});

// Получение количества участников события
router.get('/events/:eventId/participants/count', authenticate, (req: Request, res: Response) => {
  getParticipantCount(req as any, res);
});

// Проверка участия пользователя в событии
router.get('/events/:eventId/participants/check', authenticate, (req: Request, res: Response) => {
  isUserParticipating(req as any, res);
});

export default router; 