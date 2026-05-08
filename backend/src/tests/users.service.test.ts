import { describe, it, expect, vi, beforeEach } from "vitest";
import type { UserEntity } from "../repositories/users.repository";

vi.mock("../repositories/users.repository", () => {
  const store: Record<string, UserEntity> = {};
  return {
    usersRepository: {
      async getAll()             { return Object.values(store); },
      async getById(id: string)  { return store[id]; },
      async add(data: Omit<UserEntity, "id" | "createdAt">) {
        if (Object.values(store).some((u) => u.email === data.email)) {
          throw new Error("UNIQUE constraint failed: Users.email");
        }
        const id  = `id-${Date.now()}-${Math.random()}`;
        const now = new Date().toISOString();
        store[id] = { ...data, id, createdAt: now };
        return store[id];
      },
      async update(id: string, data: Partial<UserEntity>) {
        if (!store[id]) return undefined;
        Object.assign(store[id], data);
        return store[id];
      },
      async remove(id: string) {
        if (!store[id]) return false;
        delete store[id];
        return true;
      },
    },
  };
});

beforeEach(() => { vi.resetModules(); });

describe("usersService.create()", () => {
  it("створює користувача і повертає id", async () => {
    const { usersService } = await import("../services/users.service");
    const r = await usersService.create({ name: "Alice", email: "alice@test.com" });
    expect(r).toMatchObject({ name: "Alice", email: "alice@test.com" });
    expect(r.id).toBeTruthy();
  });

  it("email зберігається в нижньому регістрі", async () => {
    const { usersService } = await import("../services/users.service");
    const r = await usersService.create({ name: "Bob", email: "BOB@TEST.COM" });
    expect(r.email).toBe("bob@test.com");
  });

  it("400 якщо name < 2 символів", async () => {
    const { usersService } = await import("../services/users.service");
    await expect(usersService.create({ name: "A", email: "a@test.com" })).rejects.toThrow();
  });

  it("400 якщо email без @", async () => {
    const { usersService } = await import("../services/users.service");
    await expect(usersService.create({ name: "Alice", email: "notanemail" })).rejects.toThrow();
  });

  it("UNIQUE constraint при дублікаті email → помилка", async () => {
    const { usersService } = await import("../services/users.service");
    await usersService.create({ name: "Charlie", email: "charlie@test.com" });
    await expect(
      usersService.create({ name: "Charlie2", email: "charlie@test.com" }),
    ).rejects.toThrow();
  });
});

describe("usersService.getById()", () => {
  it("повертає користувача за id", async () => {
    const { usersService } = await import("../services/users.service");
    const created = await usersService.create({ name: "Dave", email: "dave@test.com" });
    const found   = await usersService.getById(created.id);
    expect(found.id).toBe(created.id);
  });

  it("404 якщо id не існує", async () => {
    const { usersService } = await import("../services/users.service");
    await expect(usersService.getById("fake")).rejects.toThrow();
  });
});
