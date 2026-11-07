import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { Database } from "bun:sqlite";
import { runMigrations } from "@vokara/database";
import { createApp } from "./app";

const databasePath = resolve(process.env.DATABASE_URL ?? "data/vokara.sqlite");
mkdirSync(dirname(databasePath), { recursive: true });

const database = new Database(databasePath);
database.exec("PRAGMA journal_mode = WAL;");
await runMigrations(database);

const port = Number(process.env.PORT ?? 3000);
const app = createApp(database);

const server = Bun.serve({
  port,
  fetch: app.fetch,
});

console.log(`Vokara API berjalan di http://localhost:${server.port}`);
