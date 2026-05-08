<<<<<<< HEAD
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
=======
import { describe, it, expect } from "vitest";
import { usersService } from "../services/users.service";

// ─────────────────────────────────────────────────────────
// TEST SUITE 1 — create()
// ─────────────────────────────────────────────────────────
describe("usersService.create()", () => {
  it("створює користувача з id та createdAt", () => {
    const result = usersService.create({
      name: "Olena",
      email: "olena@example.com",
    });

    expect(result.id).toBeTruthy();
    expect(result.name).toBe("Olena");
    expect(result.email).toBe("olena@example.com");
    expect(result.createdAt).toBeTruthy();
  });

  it("кидає 400 якщо name коротше 2 символів", () => {
    expect(() =>
      usersService.create({ name: "X", email: "test@test.com" }),
    ).toThrow();
  });

  it("кидає 400 якщо email без символу @", () => {
    expect(() =>
      usersService.create({ name: "Olena", email: "notanemail" }),
    ).toThrow();
  });

  it("кидає 400 якщо email порожній", () => {
    expect(() =>
      usersService.create({ name: "Olena", email: "" }),
    ).toThrow();
  });

  it("зберігає email у нижньому регістрі", () => {
    const result = usersService.create({
      name: "Test",
      email: "Test@EXAMPLE.COM",
    });
    expect(result.email).toBe("test@example.com");
  });
});

// ─────────────────────────────────────────────────────────
// TEST SUITE 2 — getById()
// ─────────────────────────────────────────────────────────
describe("usersService.getById()", () => {
  it("повертає користувача за id", () => {
    const created = usersService.create({
      name: "Bohdan",
      email: "bohdan@test.com",
    });

    const found = usersService.getById(created.id);
    expect(found.id).toBe(created.id);
  });

  it("кидає 404 для неіснуючого id", () => {
    expect(() => usersService.getById("fake-id-xyz")).toThrow();
>>>>>>> e82abfd8a9042363d87203a1bb54d06388a5c52b
  });
});
