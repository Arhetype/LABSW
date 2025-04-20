import { Request, Response } from 'express';
import { Event } from '../models/Event';
import { User } from '../models/User';
import { EventParticipant } from '../models/EventParticipant';
import { AuthRequest } from '../types/AuthRequest';

export const eventController = {
  getAllEvents: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const events = await Event.findAll();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching events' });
    }
  },

  getUserEvents: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId);
      const events = await Event.findAll({
        where: { createdBy: userId }
      });
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user events' });
    }
  },

  getEventById: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const event = await Event.findByPk(req.params.id);
      if (!event) {
        res.status(404).json({ message: 'Event not found' });
        return;
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching event' });
    }
  },

  createEvent: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const event = await Event.create({
        ...req.body,
        createdBy: req.user?.id
      });
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ message: 'Error creating event' });
    }
  },

  updateEvent: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const event = await Event.findByPk(req.params.id);
      if (!event) {
        res.status(404).json({ message: 'Event not found' });
        return;
      }
      await event.update(req.body);
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: 'Error updating event' });
    }
  },

  deleteEvent: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const event = await Event.findByPk(req.params.id);
      if (!event) {
        res.status(404).json({ message: 'Event not found' });
        return;
      }
      await event.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting event' });
    }
  },

  getEventParticipants: async (req: Request, res: Response): Promise<void> => {
    try {
      const eventId = parseInt(req.params.id);
      const participants = await EventParticipant.findAll({
        where: { eventId },
        include: [User]
      });
      res.json(participants);
    } catch (error) {
      console.error('Error in getEventParticipants:', error);
      res.status(500).json({ message: 'Error fetching participants' });
    }
  },

  addParticipant: async (req: Request, res: Response): Promise<void> => {
    try {
      const eventId = parseInt(req.params.id);
      const userId = req.body.userId;
      
      const [participant] = await EventParticipant.findOrCreate({
        where: { eventId, userId }
      });
      
      res.status(201).json(participant);
    } catch (error) {
      res.status(500).json({ message: 'Error adding participant' });
    }
  },

  registerForEvent: async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as unknown as User;
      const eventId = parseInt(req.params.id);
      
      const event = await Event.findByPk(eventId);
      if (!event) {
        res.status(404).json({ message: 'Event not found' });
        return;
      }

      if (event.createdBy === user.id) {
        res.status(400).json({ message: 'You cannot register for your own event' });
        return;
      }

      const existingRegistration = await EventParticipant.findOne({
        where: {
          eventId,
          userId: user.id
        }
      });

      if (existingRegistration) {
        res.status(200).json({ message: 'You are already registered for this event' });
        return;
      }

      const participant = await EventParticipant.create({
        eventId,
        userId: user.id
      });

      res.status(201).json({ message: 'Successfully registered for the event', participant });
    } catch (error) {
      console.error('Error in registerForEvent:', error);
      res.status(500).json({ message: 'Error registering for event' });
    }
  }
}; 