import { Event } from '../types/event';
import { User } from '../types/user';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const getAuthHeader = (): Record<string, string> => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const getEventById = async (id: string): Promise<Event> => {
    const response = await fetch(`${API_URL}/events/${id}`, {
        headers: getAuthHeader()
    });
    if (!response.ok) {
        throw new Error('Failed to fetch event');
    }
    return response.json();
};

export const registerForEvent = async (eventId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/events/${eventId}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        credentials: 'include',
    });
    
    const data = await response.json();
    
    if (!response.ok && response.status !== 200) {
        throw new Error(data.message || 'Failed to register for event');
    }
    
    return data;
};

export const getEventParticipants = async (eventId: string): Promise<User[]> => {
    const response = await fetch(`${API_URL}/events/${eventId}/participants`, {
        headers: getAuthHeader()
    });
    if (!response.ok) {
        throw new Error('Failed to fetch participants');
    }
    return response.json();
}; 