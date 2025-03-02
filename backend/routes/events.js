const express = require('express');
const { Event } = require('../models/Event');
const router = express.Router();
const checkEventLimit = require('../middlewares/eventLimit');

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Управление мероприятиями
 */

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
router.post('/', checkEventLimit, async (req, res) => {
    try {
        const newEvent = await Event.create(req.body);
        res.status(201).json(newEvent);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                error: error.errors.map(e => e.message)
            });
        }
        console.error('Ошибка при создании мероприятия:', error);
        res.status(500).json({ error: 'Ошибка при создании мероприятия' });
    }
});


module.exports = router;

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
router.get('/', async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findByPk(id);
        if (!event) {
            return res.status(404).json({ error: 'Мероприятие не найдено' });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error('Ошибка при получении мероприятия:', error);
        res.status(500).json({ error: 'Ошибка при получении мероприятия' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findByPk(id);
        if (!event) {
            return res.status(404).json({ error: 'Мероприятие не найдено' });
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
router.put('/:id', async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) return res.status(404).json({ error: 'Мероприятие не найдено' });

        await event.update(req.body);
        res.json(event);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                error: error.errors.map(e => e.message)
            });
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
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findByPk(id);
        if (!event) {
            return res.status(404).json({ error: 'Мероприятие не найдено' });
        }

        await event.destroy();
        res.status(204).send(); // Успешное удаление, без содержимого
    } catch (error) {
        console.error('Ошибка при удалении мероприятия:', error);
        res.status(500).json({ error: 'Ошибка при удалении мероприятия' });
    }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         category:
 *           type: string
 *           enum: [концерт, лекция, выставка]
 *         createdBy:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     EventInput:
 *       type: object
 *       required:
 *         - title
 *         - date
 *         - createdBy

 *         - category
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         createdBy:
 *           type: integer
 *         category:
 *           type: string
 *           enum: [концерт, лекция, выставка]
 */

module.exports = router;
