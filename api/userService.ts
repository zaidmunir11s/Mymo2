import axiosInstance from "./axiosInstance";
export interface User {
    id?: number;
    email: string;
    password?: string;
    name?: string;
  }
  
  export const createUser = async (user: User) => {
    return await axiosInstance.post("/users", user);
  };
  
  export const updateUser = async (id: number, user: Partial<User>) => {
    return await axiosInstance.put(`/users/${id}`, user);
  };
  
  export const deleteUser = async (id: number) => {
    return await axiosInstance.delete(`/users/${id}`);
  };
  