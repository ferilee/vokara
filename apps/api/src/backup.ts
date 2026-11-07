import { existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { Database } from "bun:sqlite";
import { runMigrations } from "@vokara/database";

const operation = Bun.argv[2];
const databasePath = resolve(process.env.DATABASE_URL ?? "data/vokara.sqlite");

function sqlString(value: string): string {
  return `'${value.replaceAll("'", "''")}'`;
}

async function backup(outputPath: string): Promise<void> {
  const output = resolve(outputPath);
  mkdirSync(dirname(output), { recursive: true });

  if (existsSync(output)) {
    throw new Error(`Backup sudah ada: ${output}`);
  }

  const database = new Database(databasePath, { readonly: true });
  database.exec(`VACUUM INTO ${sqlString(output)}`);
  database.close();
  console.log(`Backup dibuat: ${output}`);
}

async function restore(inputPath: string, targetPath: string): Promise<void> {
  const input = resolve(inputPath);
  const target = resolve(targetPath);

  if (!existsSync(input)) {
    throw new Error(`File backup tidak ditemukan: ${input}`);
  }

  if (existsSync(target) && process.env.ALLOW_OVERWRITE !== "true") {
    throw new Error(
      `Database tujuan sudah ada. Set ALLOW_OVERWRITE=true untuk menggantinya: ${target}`,
    );
  }

  mkdirSync(dirname(target), { recursive: true });
  await Bun.write(target, Bun.file(input));

  const restored = new Database(target, { readonly: true });
  await runMigrations(restored);
  restored.close();
  console.log(`Database dipulihkan: ${target}`);
}

try {
  if (operation === "backup") {
    await backup(Bun.argv[3] ?? `backups/vokara-${Date.now()}.sqlite`);
  } else if (operation === "restore") {
    const input = Bun.argv[3];
    if (!input) throw new Error("Gunakan: bun src/backup.ts restore <backup> [tujuan]");
    await restore(input, Bun.argv[4] ?? databasePath);
  } else {
    throw new Error(
      "Gunakan: bun src/backup.ts backup [output] atau bun src/backup.ts restore <backup> [tujuan]",
    );
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
