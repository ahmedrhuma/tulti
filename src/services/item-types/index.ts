import app from '@/connect';

export const service = app.service('api/item-types');

export const getTypes = () => service.find();

export const createType = (data: Items.Types) => service.create(data);

export const updateType = (id: number, data: Partial<Items.Types>) => service.patch(id, data);

export const deleteType = (id: number) => service.remove(id);