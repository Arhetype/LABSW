import express, { Request, Response } from 'express';
import { Event } from '@models/Event';

const router = express.Router();

/**
 * @swagger
 * /public/events:
 *   get:
 *     summary: Получить все мероприятия
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: Список мероприятий
 */
router.get('/events', async (req: Request, res: Response): Promise<void> => {
  const { category } = req.query;
  try {
    let events;
    if (category) {
      events = await Event.findAll({ where: { category: category as string } });
    } else {
      events = await Event.findAll();
    }
    res.status(200).json(events);
  } catch (error) {
    console.error('Ошибка при получении мероприятий:', error);
    res.status(500).json({ error: 'Ошибка при получении мероприятий' });
  }
});

export default router;
