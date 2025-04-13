import { useMutation } from "react-query";
import { createUser, updateUser, deleteUser, User } from "../api/userService";

export const useCreateUser = () => useMutation(createUser);
export const useUpdateUser = () => useMutation(({ id, data }: { id: number; data: Partial<User> }) => updateUser(id, data));
export const useDeleteUser = () => useMutation(deleteUser);