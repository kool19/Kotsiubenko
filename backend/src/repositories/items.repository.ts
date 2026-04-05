import { Severity, Status } from "../dtos/items.dto";

export interface ItemEntity {
  id: string;
  user: string;
  severity: Severity;
  status: Status;
  text: string;
  createdAt: string;
}

const items: ItemEntity[] = [];

export const itemsRepository = {
  getAll(): ItemEntity[] {
    return items;
  },

  getById(id: string): ItemEntity | undefined {
    return items.find((i) => i.id === id);
  },

  add(item: ItemEntity): ItemEntity {
    items.push(item);
    return item;
  },

  update(id: string, data: Partial<ItemEntity>): ItemEntity | undefined {
    const item = items.find((i) => i.id === id);
    if (!item) return undefined;
    Object.assign(item, data);
    return item;
  },

  remove(id: string): boolean {
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return false;
    items.splice(index, 1);
    return true;
  },
};
