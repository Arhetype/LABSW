import { BlacklistedToken } from '../models/BlacklistedToken.js';

export const checkBlacklistedToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Токен отсутствует' });
    }

    try {
        const blacklistedToken = await BlacklistedToken.findOne({ where: { token } });
        if (blacklistedToken) {
            return res.status(401).json({ error: 'Токен недействителен' });
        }

        next();
    } catch (error) {
        console.error('Ошибка при проверке токена:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};