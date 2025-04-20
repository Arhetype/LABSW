import express, { Request, Response } from 'express';
import { Event } from '@models/Event';
import { checkEventLimit } from '@middlewares/eventLimit';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Управление мероприятиями
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Получить все мероприятия
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Список мероприятий
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
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

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Создать новое мероприятие
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventInput'
 *     responses:
 *       201:
 *         description: Мероприятие успешно создано
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Неверные данные
 *       429:
 *         description: Превышен лимит создания мероприятий
 */
router.post(
  '/',
  checkEventLimit,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const newEvent = await Event.create(req.body);
      res.status(201).json(newEvent);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'SequelizeValidationError') {
        const validationError = error as unknown as {
          errors: Array<{ message: string }>;
        };
        res.status(400).json({
          error: validationError.errors.map((e) => e.message),
        });
        return;
      }
      console.error('Ошибка при создании мероприятия:', error);
      res.status(500).json({
        error: 'Ошибка при создании мероприятия (пользователя не существует)',
      });
    }
  },
);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Получить мероприятие по ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID мероприятия
 *     responses:
 *       200:
 *         description: Мероприятие найдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Мероприятие не найдено
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const event = await Event.findByPk(id);
    if (!event) {
      res.status(404).json({ error: 'Мероприятие не найдено' });
      return;
    }
    res.status(200).json(event);
  } catch (error) {
    console.error('Ошибка при получении мероприятия:', error);
    res.status(500).json({ error: 'Ошибка при получении мероприятия' });
  }
});

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Обновить мероприятие
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID мероприятия
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventInput'
 *     responses:
 *       200:
 *         description: Мероприятие успешно обновлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Мероприятие не найдено
 */
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      res.status(404).json({ error: 'Мероприятие не найдено' });
      return;
    }

    await event.update(req.body);
    res.json(event);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'SequelizeValidationError') {
      const validationError = error as unknown as {
        errors: Array<{ message: string }>;
      };
      res.status(400).json({
        error: validationError.errors.map((e) => e.message),
      });
      return;
    }
    console.error('Ошибка при обновлении:', error);
    res.status(500).json({ error: 'Ошибка при обновлении' });
  }
});

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Удалить мероприятие
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID мероприятия
 *     responses:
 *       204:
 *         description: Мероприятие успешно удалено
 *       404:
 *         description: Мероприятие не найдено
 */
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const event = await Event.findByPk(id);
    if (!event) {
      res.status(404).json({ error: 'Мероприятие не найдено' });
      return;
    }

    await event.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Ошибка при удалении мероприятия:', error);
    res.status(500).json({ error: 'Ошибка при удалении мероприятия' });
  }
});

/**
 * @swagger
 * /events/user/{userId}:
 *   get:
 *     summary: Получить мероприятия, созданные пользователем
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Список мероприятий
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       404:
 *         description: Мероприятия не найдены
 */
router.get(
  '/user/:userId',
  async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    try {
      const events = await Event.findAll({ where: { createdBy: userId } });
      if (events.length === 0) {
        res.status(404).json({ error: 'Мероприятия не найдены' });
        return;
      }
      res.status(200).json(events);
    } catch (error) {
      console.error('Ошибка при получении мероприятий пользователя:', error);
      res
        .status(500)
        .json({ error: 'Ошибка при получении мероприятий пользователя' });
    }
  },
);

export default router;
