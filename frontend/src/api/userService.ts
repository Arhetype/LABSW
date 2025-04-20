import axiosInstance from './axiosInstance';

export interface User {
  id: number;
  name: string;
  email: string;
}

export const userService = {
  async getCurrentUser(): Promise<User> {
    const { data } = await axiosInstance.get<User>('/users/me');
    return data;
  },

  async getUserById(id: number): Promise<User> {
    const { data } = await axiosInstance.get<User>(`/users/${id}`);
    return data;
  },
}; 