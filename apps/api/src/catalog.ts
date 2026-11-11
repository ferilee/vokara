import type { ActivityRecord } from "@vokara/activity-sdk";

export const tracerQuiz: ActivityRecord = {
  definition: {
    id: "quiz.tracer.aljabar-dasar",
    title: "Kuis Tracer Aljabar Dasar",
    description: "Kuis singkat untuk memeriksa pemahaman operasi aljabar dasar.",
    subject: "Aljabar",
    mode: "quiz",
    version: "1.0.0",
    sdkVersion: "1.0.0",
    configSchemaVersion: "quiz.v1",
    entry: "quiz",
    status: "published",
    learningObjectives: ["Mengidentifikasi hasil operasi penjumlahan aljabar sederhana."],
    capabilities: ["studentInput", "submissions", "teacherPresentation"],
    offlineReadiness: "ready",
  },
  config: {
    schemaVersion: "quiz.v1",
    instructions: "Pilih satu jawaban yang paling tepat.",
    prompt: "Berapakah hasil dari 3x + 2x?",
    options: [
      { id: "a", label: "5" },
      { id: "b", label: "5x" },
      { id: "c", label: "6x" },
      { id: "d", label: "x" },
    ],
    correctOptionId: "b",
    feedback: {
      correct: "Benar. Suku sejenis dijumlahkan: 3x + 2x = 5x.",
      incorrect: "Belum tepat. Gabungkan koefisien pada suku x: 3 + 2 = 5.",
    },
  },
};

export const activityCatalog = [tracerQuiz];
