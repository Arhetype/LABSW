import express from 'express';
import { User } from '../models/User.js';
import { BlacklistedToken } from '../models/BlacklistedToken.js';
import { generateToken, verifyToken } from '../utils/jwt.js';

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *       400:
 *         description: Ошибка валидации или email уже существует
 */
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
        }

        const newUser = await User.create({ name, email, password });
        res.status(201).json({ message: 'Пользователь успешно зарегистрирован', user: newUser });
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                error: error.errors.map(e => e.message),
            });
        }
        console.error('Ошибка при регистрации:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Авторизация пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Успешная авторизация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Неверный email или пароль
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Пользователь не найден' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Неверный пароль' });
        }

        const token = generateToken(user);
        res.json({ token });
    } catch (error) {
        console.error('Ошибка при входе:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Выход из системы
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешный выход из системы
 *       401:
 *         description: Неверный токен
 */
router.post('/logout', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Получаем токен из заголовка

    if (!token) {
        return res.status(401).json({ error: 'Токен отсутствует' });
    }

    try {
        // Проверяем, что токен валиден
        const decoded = verifyToken(token); // Используем verifyToken
        if (!decoded) {
            return res.status(401).json({ error: 'Неверный токен' });
        }

        // Добавляем токен в черный список
        await BlacklistedToken.create({
            token,
            expiresAt: new Date(decoded.exp * 1000), // Время истечения токена
        });

        res.status(200).json({ message: 'Успешный выход из системы' });
    } catch (error) {
        console.error('Ошибка при выходе из системы:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

export default router;