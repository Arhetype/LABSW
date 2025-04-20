import { Router, Request, Response, RequestHandler } from 'express';
import { authController } from '../controllers/authController';

const router = Router();

router.post('/register', authController.register as RequestHandler);
router.post('/login', authController.login as RequestHandler);
router.post('/logout', authController.logout as RequestHandler);

export default router; 