export interface User {
  id: number | null;
  name: string | null;
  email: string | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

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

export type EventCategory = 'концерт' | 'лекция' | 'выставка';

export interface EventsState {
  items: Event[];
  userEvents: Event[];
  selectedEvent: Event | null;
  loading: boolean;
  error: string | null;
  filter: EventCategory | null;
}

export interface UiState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

export interface RootState {
  auth: AuthState;
  events: EventsState;
  ui: UiState;
}
