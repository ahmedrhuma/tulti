import app from '@/connect';

const service = app.service('api/groups');

export const createGroup = (group: Pick<Group.Data, 'name'>) => service.create(group);

export const updateGroup = (id: number, group: Partial<Group.Data>) => service.patch(id, group);

export const fetchGroups = () => service.find();

export const removeGroup = (id: number) => service.remove(id);

export const searchGroup = (d: string) => service.find({ query: { name: d } });