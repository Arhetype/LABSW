import express from 'express';
import passport from 'passport';
import { checkBlacklistedToken } from '@middlewares/checkBlacklistedToken';
import eventRoutes from './events';
import userRoutes from './users';
import authRoutes from './auth';
import publicRoutes from './public';

const router = express.Router();

// Публичные маршруты
router.use('/public', publicRoutes);

// Защищенные маршруты
router.use(
  '/events',
  passport.authenticate('jwt', { session: false }),
  checkBlacklistedToken,
  eventRoutes,
);
router.use(
  '/users',
  passport.authenticate('jwt', { session: false }),
  checkBlacklistedToken,
  userRoutes,
);

// Маршруты аутентификации
router.use('/auth', authRoutes);

export default router;
