import { axiosInstance } from './axios';

export type EventCategory = 'концерт' | 'лекция' | 'выставка';

export interface Event {
  id: number;
  title: string;
  description: string | null;
  date: string;
  category: EventCategory;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  category: EventCategory;
  createdBy: number;
}

export interface UpdateEventData extends Partial<CreateEventData> {}

export const eventService = {
  async getEvents(category?: EventCategory): Promise<Event[]> {
    const { data } = await axiosInstance.get<Event[]>('/events', {
      params: { category }
    });
    return data;
  },

  async getEventById(id: number): Promise<Event> {
    const { data } = await axiosInstance.get<Event>(`/events/${id}`);
    return data;
  },

  async createEvent(eventData: CreateEventData): Promise<Event> {
    const { data } = await axiosInstance.post<Event>('/events', eventData);
    return data;
  },

  async updateEvent(id: number, eventData: UpdateEventData): Promise<Event> {
    const { data } = await axiosInstance.put<Event>(`/events/${id}`, eventData);
    return data;
  },

  async deleteEvent(id: number): Promise<void> {
    await axiosInstance.delete(`/events/${id}`);
  },

  // Публичный маршрут для получения событий без аутентификации
  async getPublicEvents(category?: EventCategory): Promise<Event[]> {
    const { data } = await axiosInstance.get<Event[]>('/public/events', {
      params: { category }
    });
    return data;
  }
}; 