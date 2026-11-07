import { Database } from "bun:sqlite";

const initialMigrationName = "0000_initial";

export async function runMigrations(database: Database): Promise<void> {
  database.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const applied = database
    .query<{ name: string }, [string]>(
      "SELECT name FROM _migrations WHERE name = ?",
    )
    .get(initialMigrationName);

  if (applied) {
    return;
  }

  const migrationSql = await Bun.file(
    new URL("../migrations/0000_initial.sql", import.meta.url),
  ).text();

  const transaction = database.transaction(() => {
    database.exec(migrationSql);
    database
      .query("INSERT INTO _migrations (name) VALUES (?)")
      .run(initialMigrationName);
  });

  transaction();
}
