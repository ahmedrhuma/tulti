import app from '@/connect';

const service = app.service('api/users');

export const addUser = (user: User.Data): Promise<User.Data> => service.create(user);

export const updateUser = (id: number, user: Partial<User.Data> & { action: string }): Promise<User.Data> => service.patch(id, user);

export const removeUser = (id: number) => service.remove(id);

export const fetchUsers = (query: any): Promise<User.Users> => service.find({ query });

export const changePassword = (data: any): Promise<User.Users> => service.patch(null, data);