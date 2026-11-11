import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { Database } from "bun:sqlite";
import { runMigrations } from "@vokara/database";
import { createApp } from "./app";

type StartServerOptions = {
  databasePath?: string;
  port?: number;
};

export async function startServer(options: StartServerOptions = {}) {
  const runtime = await createRuntime(options);
  const server = Bun.serve({
    port: options.port ?? Number(process.env.PORT ?? 3000),
    fetch: runtime.app.fetch,
  });

  return { ...runtime, server };
}

export async function createRuntime(options: StartServerOptions = {}) {
  const databasePath = options.databasePath ?? resolve(process.env.DATABASE_URL ?? "data/vokara.sqlite");

  if (databasePath !== ":memory:") {
    mkdirSync(dirname(databasePath), { recursive: true });
  }

  const database = new Database(databasePath);
  database.exec("PRAGMA journal_mode = WAL;");
  await runMigrations(database);

  const app = createApp(database);

  return { database, app };
}
