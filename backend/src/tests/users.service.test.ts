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
  });
});
