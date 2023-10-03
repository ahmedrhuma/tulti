import app from '@/connect';

const service = app.service('api/items');

export const createItem = (data: Items.ItemData): Promise<Items.ItemData> => service.create(data);

export const fetchItems = (params: API.Pagination): Promise<Items.Items> => service.find({ query: params });

export const deleteItem = (id: number) => service.remove(id);

export const patchItem = (id: number, data: Partial<Items.ItemData>|{ image: string; status: string}): Promise<Items.ItemData> => service.patch(id, data);

export const uploadImage = (id: number, image: File): Promise<{ file: string }> => service.patch(id, { image });

export const searchItem = (d: string) => service.find<Items.ItemData[]>({ query: { search: true, name: d } });
export const getItem = (d: number) => service.get<Items.ItemData>(d);