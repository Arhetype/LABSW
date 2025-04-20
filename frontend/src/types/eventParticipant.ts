import { User } from './user';

export interface EventParticipant {
  id: number;
  userId: number;
  eventId: number;
  User: User;
} 