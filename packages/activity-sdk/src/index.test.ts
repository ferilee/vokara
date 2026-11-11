import { expect, test } from "bun:test";
import { validateActivity, validateQuizConfig } from "./index";

const validConfig = {
  schemaVersion: "quiz.v1" as const,
  instructions: "Pilih jawaban yang benar.",
  prompt: "Berapakah 2 + 2?",
  options: [
    { id: "a", label: "3" },
    { id: "b", label: "4" },
    { id: "c", label: "5" },
    { id: "d", label: "6" },
  ],
  correctOptionId: "b",
  feedback: { correct: "Benar.", incorrect: "Coba hitung kembali." },
};

test("validates the tracer quiz configuration", () => {
  expect(validateQuizConfig(validConfig).valid).toBe(true);
  expect(validateQuizConfig({ ...validConfig, options: validConfig.options.slice(0, 3) }).valid).toBe(false);
});

test("rejects an activity with incompatible schema", () => {
  const result = validateActivity({
    definition: {
      id: "quiz.tracer",
      title: "Kuis Tracer",
      description: "Kuis",
      subject: "Aljabar",
      mode: "quiz",
      version: "1.0.0",
      sdkVersion: "1.0.0",
      configSchemaVersion: "quiz.v2",
      entry: "quiz",
      status: "published",
      learningObjectives: ["Menghitung"],
      capabilities: ["studentInput"],
      offlineReadiness: "limited",
    },
    config: validConfig,
  });

  expect(result.valid).toBe(false);
  expect(result.issues.some((issue) => issue.path === "configSchemaVersion")).toBe(true);
});
