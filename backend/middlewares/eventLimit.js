const { Event } = require('../models/Event');
const dotenv = require('dotenv');
const {Op} = require("sequelize");

dotenv.config();

const DAILY_EVENT_LIMIT = parseInt(process.env.DAILY_EVENT_LIMIT, 10) || 5;

const checkEventLimit = async (req, res, next) => {
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
            return res.status(429).json({
                error: `Превышен лимит создания мероприятий. Лимит: ${DAILY_EVENT_LIMIT} в день.`,
            });
        }

        next();
    } catch (error) {
        console.error('Ошибка при проверке лимита мероприятий:', error);
        res.status(500).json({ error: 'Ошибка при проверке лимита мероприятий' });
    }
};

module.exports = checkEventLimit;
