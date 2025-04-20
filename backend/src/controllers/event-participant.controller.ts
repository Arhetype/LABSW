import { Request, Response } from 'express';
import { EventParticipant } from '../models/event-participant.model';
import { User } from '../models/user.model';

export const eventParticipantController = {
  async addParticipant(req: Request, res: Response) {
    try {
      const { eventId, userId } = req.body;
      
      const existingParticipant = await EventParticipant.findOne({
        where: { eventId, userId }
      });

      if (existingParticipant) {
        return res.status(400).json({ message: 'Пользователь уже является участником этого мероприятия' });
      }

      const participant = await EventParticipant.create({ eventId, userId });
      res.status(201).json(participant);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при добавлении участника', error });
    }
  },

  async removeParticipant(req: Request, res: Response) {
    try {
      const { eventId, userId } = req.params;
      
      const participant = await EventParticipant.findOne({
        where: { eventId, userId }
      });

      if (!participant) {
        return res.status(404).json({ message: 'Участник не найден' });
      }

      await participant.destroy();
      res.status(200).json({ message: 'Участник удален' });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при удалении участника', error });
    }
  },

  async getEventParticipants(req: Request, res: Response) {
    try {
      const { eventId } = req.params;
      
      const participants = await EventParticipant.findAll({
        where: { eventId },
        include: [{
          model: User,
          attributes: ['id', 'name', 'email']
        }]
      });

      res.status(200).json(participants);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при получении списка участников', error });
    }
  },

  async getParticipantCount(req: Request, res: Response) {
    try {
      const { eventId } = req.params;
      
      const count = await EventParticipant.count({
        where: { eventId }
      });

      res.status(200).json({ count });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при получении количества участников', error });
    }
  }
}; 