// middlewares/checkBlacklistedToken.js
import { BlacklistedToken } from '../models/BlacklistedToken.js';

export const checkBlacklistedToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Получаем токен из заголовка

    if (!token) {
        return res.status(401).json({ error: 'Токен отсутствует' });
    }

    try {
        // Проверяем, есть ли токен в черном списке
        const blacklistedToken = await BlacklistedToken.findOne({ where: { token } });
        if (blacklistedToken) {
            return res.status(401).json({ error: 'Токен недействителен' });
        }

        next(); // Продолжаем обработку запроса
    } catch (error) {
        console.error('Ошибка при проверке токена:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};