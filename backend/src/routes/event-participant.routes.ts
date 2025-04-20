import { Router } from 'express';
import { eventParticipantController } from '../controllers/event-participant.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Добавить участника
router.post('/', authMiddleware, eventParticipantController.addParticipant);

// Удалить участника
router.delete('/:eventId/:userId', authMiddleware, eventParticipantController.removeParticipant);

// Получить список участников мероприятия
router.get('/:eventId/participants', eventParticipantController.getEventParticipants);

// Получить количество участников мероприятия
router.get('/:eventId/count', eventParticipantController.getParticipantCount);

export default router; 