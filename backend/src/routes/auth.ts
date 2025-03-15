import express, { Request, Response } from 'express';
import { User } from '../models/User';
import { BlacklistedToken } from '../models/BlacklistedToken';
import { generateToken, verifyToken } from '../utils/jwt';

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
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res
        .status(400)
        .json({ error: 'Пользователь с таким email уже существует' });
      return;
    }

    const newUser = await User.create({
      name,
      email,
      password,
      id: 0, // Убедитесь, что это поле не требуется, так как оно autoIncrement
    });
    res
      .status(201)
      .json({ message: 'Пользователь успешно зарегистрирован', user: newUser });
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
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Пользователь не найден' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ error: 'Неверный пароль' });
      return;
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
router.post('/logout', async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Токен отсутствует' });
    return;
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      res.status(401).json({ error: 'Неверный токен' });
      return;
    }

    await BlacklistedToken.create({
      token,
      expiresAt: new Date(decoded.exp * 1000),
      id: 0, // Убедитесь, что это поле не требуется, так как оно autoIncrement
    });

    res.status(200).json({ message: 'Успешный выход из системы' });
  } catch (error) {
    console.error('Ошибка при выходе из системы:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;
