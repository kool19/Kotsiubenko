import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ItemEntity } from "../repositories/items.repository";

// Мокаємо репозиторій — тести не торкаються реального SQLite
vi.mock("../repositories/items.repository", () => {
  const store: Record<string, ItemEntity> = {};
  return {
    itemsRepository: {
      async getAll(f: Record<string, unknown> = {}) {
        let items = Object.values(store);
        if (f.status)   items = items.filter((i) => i.status   === f.status);
        if (f.severity) items = items.filter((i) => i.severity === f.severity);
        const page = Number(f.page) || 1;
        const ps   = Number(f.pageSize) || 10;
        return { items: items.slice((page - 1) * ps, page * ps), total: items.length };
      },
      async getById(id: string) { return store[id]; },
      async add(data: Omit<ItemEntity, "id" | "createdAt"> & { status?: string }) {
        const id  = `id-${Date.now()}-${Math.random()}`;
        const now = new Date().toISOString();
        store[id] = { ...data, id, status: (data.status ?? "Open") as ItemEntity["status"], createdAt: now };
        return store[id];
      },
      async update(id: string, data: Partial<ItemEntity>) {
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

describe("itemsService.create()", () => {
  it("повертає item з id та createdAt", async () => {
    const { itemsService } = await import("../services/items.service");
    const r = await itemsService.create({ user: "john", severity: "High", text: "Server down" });
    expect(r).toMatchObject({ user: "john", severity: "High", status: "Open" });
    expect(r.id).toBeTruthy();
  });

  it("статус за замовчуванням = Open", async () => {
    const { itemsService } = await import("../services/items.service");
    const r = await itemsService.create({ user: "alice", severity: "Low", text: "Minor issue" });
    expect(r.status).toBe("Open");
  });

  it("400 якщо user порожній", async () => {
    const { itemsService } = await import("../services/items.service");
    await expect(itemsService.create({ user: "", severity: "High", text: "Test" })).rejects.toThrow();
  });

  it("400 якщо severity невалідний", async () => {
    const { itemsService } = await import("../services/items.service");
    await expect(
      itemsService.create({ user: "john", severity: "Critical" as "High", text: "Test" }),
    ).rejects.toThrow();
  });

  it("400 якщо user > 10 символів", async () => {
    const { itemsService } = await import("../services/items.service");
    await expect(
      itemsService.create({ user: "verylongname", severity: "Low", text: "Test" }),
    ).rejects.toThrow();
  });

  it("400 якщо text порожній", async () => {
    const { itemsService } = await import("../services/items.service");
    await expect(itemsService.create({ user: "j", severity: "Low", text: "" })).rejects.toThrow();
  });
});

describe("itemsService.getById()", () => {
  it("повертає item за id", async () => {
    const { itemsService } = await import("../services/items.service");
    const created = await itemsService.create({ user: "bob", severity: "Medium", text: "Test" });
    const found   = await itemsService.getById(created.id);
    expect(found.id).toBe(created.id);
  });

  it("404 якщо id не існує", async () => {
    const { itemsService } = await import("../services/items.service");
    await expect(itemsService.getById("fake")).rejects.toThrow();
  });
});

describe("itemsService.getAll()", () => {
  it("фільтрує за status", async () => {
    const { itemsService } = await import("../services/items.service");
    await itemsService.create({ user: "u1", severity: "High", text: "A", status: "Open" });
    await itemsService.create({ user: "u2", severity: "Low",  text: "B", status: "Done" });
    const r = await itemsService.getAll({ status: "Open" });
    expect(r.items.every((i) => i.status === "Open")).toBe(true);
  });

  it("пагінація повертає meta з total і pageSize", async () => {
    const { itemsService } = await import("../services/items.service");
    for (let i = 0; i < 5; i++) {
      await itemsService.create({ user: `u${i}`, severity: "Low", text: `Item ${i}` });
    }
    const r = await itemsService.getAll({ page: "1", pageSize: "3" });
    expect(r.items.length).toBeLessThanOrEqual(3);
    expect(r.pageSize).toBe(3);
    expect(r.total).toBeGreaterThanOrEqual(5);
  });
});

describe("itemsService.update()", () => {
  it("оновлює всі поля", async () => {
    const { itemsService } = await import("../services/items.service");
    const c = await itemsService.create({ user: "john", severity: "High", text: "Original" });
    const u = await itemsService.update(c.id, { user: "john", severity: "Low", status: "Done", text: "Updated" });
    expect(u.severity).toBe("Low");
    expect(u.status).toBe("Done");
    expect(u.text).toBe("Updated");
  });

  it("404 при оновленні неіснуючого id", async () => {
    const { itemsService } = await import("../services/items.service");
    await expect(
      itemsService.update("fake", { user: "j", severity: "Low", status: "Done", text: "x" }),
    ).rejects.toThrow();
  });
});

describe("itemsService.patch()", () => {
  it("оновлює тільки status, решта без змін", async () => {
    const { itemsService } = await import("../services/items.service");
    const c = await itemsService.create({ user: "john", severity: "High", text: "Patch me" });
    const p = await itemsService.patch(c.id, { status: "Done" });
    expect(p.status).toBe("Done");
    expect(p.severity).toBe("High");
    expect(p.text).toBe("Patch me");
  });
});

describe("itemsService.remove()", () => {
  it("після видалення getById кидає 404", async () => {
    const { itemsService } = await import("../services/items.service");
    const c = await itemsService.create({ user: "john", severity: "Low", text: "Delete me" });
    await itemsService.remove(c.id);
    await expect(itemsService.getById(c.id)).rejects.toThrow();
  });

  it("404 при видаленні неіснуючого id", async () => {
    const { itemsService } = await import("../services/items.service");
    await expect(itemsService.remove("fake")).rejects.toThrow();
  });
});
