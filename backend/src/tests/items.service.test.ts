import { describe, it, expect, beforeEach } from "vitest";

// ── Reset in-memory storage before each test ──────────────
// We reimport the module fresh each time via vi.resetModules()
// Instead we directly manipulate through the service API

let itemsService: typeof import("../services/items.service").itemsService;

beforeEach(async () => {
  // Reset module registry so the in-memory array is cleared
  const mod = await import("../services/items.service");
  itemsService = mod.itemsService;
});

// ─────────────────────────────────────────────────────────
// TEST SUITE 1 — create()
// ─────────────────────────────────────────────────────────
describe("itemsService.create()", () => {
  it("повертає створений item з id та createdAt", () => {
    const result = itemsService.create({
      user: "john",
      severity: "High",
      text: "Server is down",
    });

    expect(result).toMatchObject({
      user: "john",
      severity: "High",
      status: "Open",
      text: "Server is down",
    });
    expect(result.id).toBeTruthy();
    expect(result.createdAt).toBeTruthy();
  });

  it("встановлює status = Open якщо не передано", () => {
    const result = itemsService.create({
      user: "alice",
      severity: "Low",
      text: "Minor issue",
    });
    expect(result.status).toBe("Open");
  });

  it("кидає 400 якщо user порожній", () => {
    expect(() =>
      itemsService.create({ user: "", severity: "High", text: "Test" }),
    ).toThrow();
  });

  it("кидає 400 якщо severity невалідний", () => {
    expect(() =>
      itemsService.create({
        user: "john",
        severity: "Critical" as "High",
        text: "Test",
      }),
    ).toThrow();
  });

  it("кидає 400 якщо user > 10 символів", () => {
    expect(() =>
      itemsService.create({
        user: "verylongusername",
        severity: "Low",
        text: "Test",
      }),
    ).toThrow();
  });

  it("кидає 400 якщо text порожній", () => {
    expect(() =>
      itemsService.create({ user: "john", severity: "Low", text: "" }),
    ).toThrow();
  });
});

// ─────────────────────────────────────────────────────────
// TEST SUITE 2 — getById()
// ─────────────────────────────────────────────────────────
describe("itemsService.getById()", () => {
  it("повертає item за існуючим id", () => {
    const created = itemsService.create({
      user: "bob",
      severity: "Medium",
      text: "Test item",
    });

    const found = itemsService.getById(created.id);
    expect(found.id).toBe(created.id);
    expect(found.user).toBe("bob");
  });

  it("кидає 404 якщо id не існує", () => {
    expect(() => itemsService.getById("non-existent-id")).toThrow();
  });
});

// ─────────────────────────────────────────────────────────
// TEST SUITE 3 — getAll() з фільтрацією
// ─────────────────────────────────────────────────────────
describe("itemsService.getAll() — фільтрація", () => {
  it("фільтрує за status", () => {
    itemsService.create({ user: "u1", severity: "High", text: "Open item", status: "Open" });
    itemsService.create({ user: "u2", severity: "Low", text: "Done item", status: "Done" });

    const result = itemsService.getAll({ status: "Open" });
    expect(result.items.every((i) => i.status === "Open")).toBe(true);
  });

  it("фільтрує за severity", () => {
    itemsService.create({ user: "u3", severity: "High", text: "High item" });
    itemsService.create({ user: "u4", severity: "Low", text: "Low item" });

    const result = itemsService.getAll({ severity: "High" });
    expect(result.items.every((i) => i.severity === "High")).toBe(true);
  });

  it("пагінація — повертає pageSize елементів", () => {
    for (let i = 0; i < 5; i++) {
      itemsService.create({ user: `u${i}`, severity: "Low", text: `Item ${i}` });
    }

    const result = itemsService.getAll({ page: "1", pageSize: "3" });
    expect(result.items.length).toBeLessThanOrEqual(3);
    expect(result.pageSize).toBe(3);
  });

  it("повертає total — загальну кількість до пагінації", () => {
    itemsService.create({ user: "t1", severity: "Low", text: "A" });
    itemsService.create({ user: "t2", severity: "Low", text: "B" });

    const result = itemsService.getAll({});
    expect(result.total).toBeGreaterThanOrEqual(2);
  });
});

// ─────────────────────────────────────────────────────────
// TEST SUITE 4 — update()
// ─────────────────────────────────────────────────────────
describe("itemsService.update()", () => {
  it("оновлює всі поля item", () => {
    const created = itemsService.create({
      user: "john",
      severity: "High",
      text: "Original",
    });

    const updated = itemsService.update(created.id, {
      user: "john",
      severity: "Low",
      status: "Done",
      text: "Updated",
    });

    expect(updated.severity).toBe("Low");
    expect(updated.status).toBe("Done");
    expect(updated.text).toBe("Updated");
  });

  it("кидає 404 при оновленні неіснуючого id", () => {
    expect(() =>
      itemsService.update("fake-id", {
        user: "john",
        severity: "Low",
        status: "Done",
        text: "Test",
      }),
    ).toThrow();
  });

  it("кидає 400 якщо при оновленні severity невалідний", () => {
    const created = itemsService.create({
      user: "john",
      severity: "High",
      text: "Test",
    });

    expect(() =>
      itemsService.update(created.id, {
        user: "john",
        severity: "Invalid" as "High",
        status: "Open",
        text: "Test",
      }),
    ).toThrow();
  });
});

// ─────────────────────────────────────────────────────────
// TEST SUITE 5 — remove()
// ─────────────────────────────────────────────────────────
describe("itemsService.remove()", () => {
  it("видаляє item — після видалення getById кидає 404", () => {
    const created = itemsService.create({
      user: "john",
      severity: "Low",
      text: "To delete",
    });

    itemsService.remove(created.id);
    expect(() => itemsService.getById(created.id)).toThrow();
  });

  it("кидає 404 при видаленні неіснуючого id", () => {
    expect(() => itemsService.remove("non-existent")).toThrow();
  });
});

// ─────────────────────────────────────────────────────────
// TEST SUITE 6 — patch()
// ─────────────────────────────────────────────────────────
describe("itemsService.patch()", () => {
  it("частково оновлює лише status", () => {
    const created = itemsService.create({
      user: "john",
      severity: "High",
      text: "Patch test",
    });

    const patched = itemsService.patch(created.id, { status: "Done" });
    expect(patched.status).toBe("Done");
    expect(patched.severity).toBe("High");
    expect(patched.text).toBe("Patch test");
  });
});
