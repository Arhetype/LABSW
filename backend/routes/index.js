import express from 'express';
import passport from 'passport';
import eventRoutes from './events.js';
import userRoutes from './users.js';
import authRoutes from './auth.js';
import publicRoutes from './public.js';

const router = express.Router();

router.use('/public', publicRoutes);

router.use('/events', passport.authenticate('jwt', { session: false }), eventRoutes);
router.use('/users', passport.authenticate('jwt', { session: false }), userRoutes);

router.use('/auth', authRoutes);

export default router;