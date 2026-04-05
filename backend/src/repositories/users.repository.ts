export interface UserEntity {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

const users: UserEntity[] = [];

export const usersRepository = {
  getAll(): UserEntity[] {
    return users;
  },

  getById(id: string): UserEntity | undefined {
    return users.find((u) => u.id === id);
  },

  add(user: UserEntity): UserEntity {
    users.push(user);
    return user;
  },

  update(id: string, data: Partial<UserEntity>): UserEntity | undefined {
    const user = users.find((u) => u.id === id);
    if (!user) return undefined;
    Object.assign(user, data);
    return user;
  },

  remove(id: string): boolean {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
  },
};
