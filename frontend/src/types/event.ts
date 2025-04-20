import { User } from './user';

export type EventCategory = 'концерт' | 'лекция' | 'выставка';

export interface Event {
    id: number;
    title: string;
    description: string | null;
    date: string;
    location: string;
    imageUrl: string;
    organizer: User;
    participants: User[];
    category: EventCategory;
    createdBy: number;
    createdAt: string;
    updatedAt: string;
} 