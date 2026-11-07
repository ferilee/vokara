import { Database } from "bun:sqlite";
import { cors } from "hono/cors";
import { Hono } from "hono";

type AppEnv = {
  Variables: {
    database: Database;
  };
};

export function createApp(database: Database) {
  const app = new Hono<AppEnv>();

  app.use(
    "*",
    cors({
      origin: process.env.CORS_ORIGIN ?? "*",
      allowHeaders: ["Content-Type"],
    }),
  );

  app.use("*", async (context, next) => {
    context.set("database", database);
    await next();
  });

  app.get("/health", (context) => {
    try {
      context.get("database").query("SELECT 1").get();
      return context.json({
        status: "ok",
        service: "vokara-api",
        database: "ok",
        environment: process.env.NODE_ENV ?? "development",
      });
    } catch {
      return context.json(
        {
          status: "degraded",
          service: "vokara-api",
          database: "unavailable",
        },
        503,
      );
    }
  });

  app.notFound((context) =>
    context.json(
      {
        error: "not_found",
        message: "Endpoint tidak ditemukan.",
      },
      404,
    ),
  );

  app.onError((error, context) => {
    console.error(error);
    return context.json(
      {
        error: "internal_error",
        message: "Terjadi kesalahan pada server.",
      },
      500,
    );
  });

  return app;
}
