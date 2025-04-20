import { Request, Response } from 'express';
import { EventParticipant } from '../models/EventParticipant';
import { User } from '../models/User';
import { Event } from '../models/Event';
import { AuthRequest } from '../types/AuthRequest';

export const addParticipant = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Не авторизован' });
      return;
    }

    const event = await Event.findByPk(eventId);
    if (!event) {
      res.status(404).json({ message: 'Мероприятие не найдено' });
      return;
    }

    if (event.createdBy === userId) {
      res.status(400).json({ message: 'Создатель мероприятия не может быть участником' });
      return;
    }

    const [participant, created] = await EventParticipant.findOrCreate({
      where: { userId, eventId: Number(eventId) }
    });

    if (!created) {
      res.status(400).json({ message: 'Вы уже участвуете в этом мероприятии' });
      return;
    }

    res.status(201).json(participant);
  } catch (error) {
    console.error('Ошибка при добавлении участника:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const removeParticipant = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Не авторизован' });
      return;
    }

    const event = await Event.findByPk(eventId);
    if (!event) {
      res.status(404).json({ message: 'Мероприятие не найдено' });
      return;
    }

    const result = await EventParticipant.destroy({
      where: { userId, eventId: Number(eventId) },
    });

    if (result === 0) {
      res.status(404).json({ message: 'Участник не найден' });
      return;
    }

    res.status(200).json({ message: 'Участник удален' });
  } catch (error) {
    console.error('Ошибка при удалении участника:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const getEventParticipants = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;

    const participants = await EventParticipant.findAll({
      where: { eventId: Number(eventId) },
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email'],
        },
      ],
    });

    res.status(200).json(participants);
  } catch (error) {
    console.error('Ошибка при получении участников:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const getParticipantCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;

    const count = await EventParticipant.count({
      where: { eventId: Number(eventId) },
    });

    res.status(200).json({ count });
  } catch (error) {
    console.error('Ошибка при получении количества участников:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const isUserParticipating = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Необходима авторизация' });
      return;
    }

    const event = await Event.findByPk(eventId);
    if (!event) {
      res.status(404).json({ message: 'Событие не найдено' });
      return;
    }

    const participant = await EventParticipant.findOne({
      where: { userId, eventId: Number(eventId) },
    });

    res.status(200).json({ isParticipating: !!participant });
  } catch (error) {
    console.error('Ошибка при проверке участия:', error);
    res.status(500).json({ error: 'Ошибка при проверке участия' });
  }
}; 