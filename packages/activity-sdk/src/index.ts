export type ActivityMode = "quiz" | "explore" | "whiteboard";
export type ActivityStatus = "draft" | "review" | "published" | "deprecated";
export type OfflineReadiness = "ready" | "limited" | "not_ready";

export type ActivityDefinition = {
  id: string;
  title: string;
  description: string;
  subject: string;
  mode: ActivityMode;
  version: string;
  sdkVersion: string;
  configSchemaVersion: string;
  entry: string;
  status: ActivityStatus;
  learningObjectives: string[];
  capabilities: string[];
  offlineReadiness: OfflineReadiness;
};

export type QuizOption = {
  id: string;
  label: string;
};

export type QuizConfig = {
  schemaVersion: "quiz.v1";
  instructions: string;
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
  feedback: {
    correct: string;
    incorrect: string;
  };
};

export type ActivityRecord = {
  definition: ActivityDefinition;
  config: QuizConfig;
};

export type ValidationIssue = {
  path: string;
  message: string;
};

export type ValidationResult = {
  valid: boolean;
  issues: ValidationIssue[];
};

const validModes = new Set<ActivityMode>(["quiz", "explore", "whiteboard"]);
const validStatuses = new Set<ActivityStatus>([
  "draft",
  "review",
  "published",
  "deprecated",
]);

export function validateDefinition(
  definition: ActivityDefinition,
): ValidationResult {
  const issues: ValidationIssue[] = [];

  if (!definition.id.trim()) issues.push({ path: "id", message: "ID aktivitas wajib diisi." });
  if (!definition.title.trim()) issues.push({ path: "title", message: "Judul aktivitas wajib diisi." });
  if (!definition.description.trim()) issues.push({ path: "description", message: "Deskripsi aktivitas wajib diisi." });
  if (!definition.subject.trim()) issues.push({ path: "subject", message: "Subject aktivitas wajib diisi." });
  if (!validModes.has(definition.mode)) issues.push({ path: "mode", message: "Mode aktivitas tidak didukung." });
  if (!definition.version.trim()) issues.push({ path: "version", message: "Versi aktivitas wajib diisi." });
  if (!definition.sdkVersion.trim()) issues.push({ path: "sdkVersion", message: "Versi SDK wajib diisi." });
  if (!definition.configSchemaVersion.trim()) issues.push({ path: "configSchemaVersion", message: "Versi schema konfigurasi wajib diisi." });
  if (!definition.entry.trim()) issues.push({ path: "entry", message: "Entry point aktivitas wajib diisi." });
  if (!validStatuses.has(definition.status)) issues.push({ path: "status", message: "Status publikasi tidak didukung." });
  if (definition.learningObjectives.length === 0) issues.push({ path: "learningObjectives", message: "Minimal satu tujuan belajar wajib diisi." });
  if (definition.capabilities.length === 0) issues.push({ path: "capabilities", message: "Minimal satu capability wajib diisi." });

  return { valid: issues.length === 0, issues };
}

export function validateQuizConfig(config: QuizConfig): ValidationResult {
  const issues: ValidationIssue[] = [];
  const optionIds = config.options.map((option) => option.id);

  if (config.schemaVersion !== "quiz.v1") issues.push({ path: "schemaVersion", message: "Schema kuis tidak kompatibel dengan runtime MVP." });
  if (!config.instructions.trim()) issues.push({ path: "instructions", message: "Instruksi kuis wajib diisi." });
  if (!config.prompt.trim()) issues.push({ path: "prompt", message: "Pertanyaan kuis wajib diisi." });
  if (config.options.length !== 4) issues.push({ path: "options", message: "Kuis tracer harus memiliki tepat empat opsi." });
  if (new Set(optionIds).size !== optionIds.length) issues.push({ path: "options", message: "ID opsi kuis harus unik." });
  if (config.options.some((option) => !option.label.trim())) issues.push({ path: "options", message: "Label setiap opsi wajib diisi." });
  if (!optionIds.includes(config.correctOptionId)) issues.push({ path: "correctOptionId", message: "Jawaban benar harus menunjuk salah satu opsi." });
  if (!config.feedback.correct.trim()) issues.push({ path: "feedback.correct", message: "Umpan balik jawaban benar wajib diisi." });
  if (!config.feedback.incorrect.trim()) issues.push({ path: "feedback.incorrect", message: "Umpan balik jawaban salah wajib diisi." });

  return { valid: issues.length === 0, issues };
}

export function validateActivity(activity: ActivityRecord): ValidationResult {
  const definitionResult = validateDefinition(activity.definition);
  const configResult = validateQuizConfig(activity.config);
  const issues = [...definitionResult.issues, ...configResult.issues];

  if (activity.definition.mode !== "quiz") {
    issues.push({ path: "mode", message: "Konfigurasi tracer hanya kompatibel dengan mode quiz." });
  }
  if (activity.definition.configSchemaVersion !== activity.config.schemaVersion) {
    issues.push({ path: "configSchemaVersion", message: "Versi schema definition dan konfigurasi tidak sama." });
  }

  return { valid: issues.length === 0, issues };
}
