import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { Database } from "bun:sqlite";
import { runMigrations } from "@vokara/database";
import { createApp } from "./app";
import { createRuntime } from "./server";

let database: Database;

beforeEach(async () => {
  database = new Database(":memory:");
  await runMigrations(database);
});

afterEach(() => {
  database.close();
});

describe("API integration", () => {
  test("health check reports API and database as healthy", async () => {
    const response = await createApp(database).request("/health");

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      status: "ok",
      service: "vokara-api",
      database: "ok",
    });
  });

  test("migration is idempotent", async () => {
    await runMigrations(database);
    const migrations = database
      .query<{ count: number }, []>("SELECT COUNT(*) AS count FROM _migrations")
      .get();

    expect(migrations?.count).toBe(1);
  });

  test("unknown endpoint returns a safe error", async () => {
    const response = await createApp(database).request("/unknown");

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      error: "not_found",
      message: "Endpoint tidak ditemukan.",
    });
  });

  test("catalog exposes the published tracer activity and its detail", async () => {
    const app = createApp(database);
    const catalogResponse = await app.request("/api/activities");
    const catalog = (await catalogResponse.json()) as { activities: Array<{ id: string; status: string }> };

    expect(catalogResponse.status).toBe(200);
    expect(catalog.activities).toHaveLength(1);
    expect(catalog.activities[0]).toMatchObject({
      id: "quiz.tracer.aljabar-dasar",
      status: "published",
    });

    const detailResponse = await app.request("/api/activities/quiz.tracer.aljabar-dasar");
    expect(detailResponse.status).toBe(200);
    expect((await detailResponse.json()).config.schemaVersion).toBe("quiz.v1");
  });
});

test("API initializes with a temporary database and serves health check", async () => {
  const runtime = await createRuntime({ databasePath: ":memory:" });

  try {
    const response = await runtime.app.request("/health");

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      status: "ok",
      database: "ok",
    });
  } finally {
    runtime.database.close();
  }
});
