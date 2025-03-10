// routes/index.js
import express from 'express';
import passport from 'passport';
import { checkBlacklistedToken } from '../middlewares/checkBlacklistedToken.js';
import eventRoutes from './events.js';
import userRoutes from './users.js';
import authRoutes from './auth.js';
import publicRoutes from './public.js';

const router = express.Router();

// Публичные маршруты
router.use('/public', publicRoutes);

// Защищенные маршруты
router.use('/events', passport.authenticate('jwt', { session: false }), checkBlacklistedToken, eventRoutes);
router.use('/users', passport.authenticate('jwt', { session: false }), checkBlacklistedToken, userRoutes);

// Маршруты аутентификации
router.use('/auth', authRoutes);

export default router;