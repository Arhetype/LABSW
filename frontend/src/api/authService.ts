import { axiosInstance } from './axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
    localStorage.setItem('token', data.token);
    return data;
  },

  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    const { data } = await axiosInstance.post<RegisterResponse>('/auth/register', credentials);
    return data;
  },

  async logout(): Promise<void> {
    try {
      await axiosInstance.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}; 