import { Database } from "bun:sqlite";
import { cors } from "hono/cors";
import { Hono } from "hono";
import { validateActivity } from "@vokara/activity-sdk";
import { activityCatalog } from "./catalog";

type AppEnv = {
  Variables: {
    database: Database;
  };
};

export function createApp(database: Database) {
  const app = new Hono<AppEnv>();
  const publishedActivities = activityCatalog.filter(
    (activity) => activity.definition.status === "published" && validateActivity(activity).valid,
  );

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

  app.get("/api/activities", (context) =>
    context.json({
      activities: publishedActivities.map(({ definition }) => definition),
    }),
  );

  app.get("/api/activities/:id", (context) => {
    const activity = publishedActivities.find(
      ({ definition }) => definition.id === context.req.param("id"),
    );

    if (!activity) {
      return context.json(
        { error: "activity_not_found", message: "Aktivitas tidak ditemukan." },
        404,
      );
    }

    return context.json(activity);
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
