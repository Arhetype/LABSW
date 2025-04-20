import { Router, Request, Response, RequestHandler } from 'express';
import { eventController } from '../controllers/eventController';
import { authenticate } from '../middlewares/authenticate';
import { AuthRequest } from '../types/AuthRequest';

const router = Router();

const handleRequest = (handler: (req: AuthRequest, res: Response) => Promise<void>): RequestHandler => {
  return (req: Request, res: Response) => {
    const authReq = req as unknown as AuthRequest;
    handler(authReq, res).catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
  };
};

router.get('/', handleRequest(eventController.getAllEvents));
router.get('/:id', handleRequest(eventController.getEventById));
router.get('/user/:userId', handleRequest(eventController.getUserEvents));
router.post('/', authenticate, handleRequest(eventController.createEvent));
router.put('/:id', authenticate, handleRequest(eventController.updateEvent));
router.delete('/:id', authenticate, handleRequest(eventController.deleteEvent));

// Новые маршруты для участников
router.get('/:id/participants', authenticate, handleRequest(eventController.getEventParticipants));
router.post('/:id/participate', authenticate, handleRequest(eventController.addParticipant));

export default router; 