import { axiosInstance } from './axios';
import { Event, EventCategory } from '../types/event';
import { User } from '../types/user';
import { EventParticipant } from '../types/eventParticipant';
import { AxiosError } from 'axios';

export const eventService = {
  getEvents: async (category?: EventCategory): Promise<Event[]> => {
    const response = await axiosInstance.get('/events', {
      params: { category },
    });
    return response.data;
  },

  getEventById: async (id: number): Promise<Event> => {
    const response = await axiosInstance.get(`/events/${id}`);
    return response.data;
  },

  createEvent: async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> => {
    const response = await axiosInstance.post('/events', eventData);
    return response.data;
  },

  updateEvent: async (id: number, eventData: Partial<Event>): Promise<Event> => {
    const response = await axiosInstance.put(`/events/${id}`, eventData);
    return response.data;
  },

  deleteEvent: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/events/${id}`);
  },

  registerForEvent: async (eventId: number): Promise<void> => {
    try {
      await axiosInstance.post(`/events/${eventId}/register`);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Ошибка при регистрации на мероприятие');
    }
  },

  getEventParticipants: async (eventId: number): Promise<EventParticipant[]> => {
    const response = await axiosInstance.get(`/events/${eventId}/participants`);
    return response.data;
  },

  getUserById: async (userId: number): Promise<User> => {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data;
  },

  getUserEvents: async (userId: number): Promise<Event[]> => {
    const response = await axiosInstance.get(`/events/user/${userId}`);
    return response.data;
  }
};
