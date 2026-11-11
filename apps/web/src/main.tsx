import { StrictMode, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import type { ActivityDefinition, ActivityRecord } from "@vokara/activity-sdk";
import { validateActivity } from "@vokara/activity-sdk";
import "./styles.css";

type Screen = "catalog" | "detail" | "runtime";
const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

function browserName() {
  const ua = navigator.userAgent;
  if (ua.includes("Edg/")) return "Microsoft Edge";
  if (ua.includes("Chrome/")) return "Chrome atau Chromium";
  if (ua.includes("Firefox/")) return "Firefox";
  if (ua.includes("Safari/")) return "Safari";
  return "Browser tidak teridentifikasi";
}

function snapshot() {
  return {
    viewport: window.innerWidth + " × " + window.innerHeight + "px",
    touchPoints: navigator.maxTouchPoints,
    online: navigator.onLine,
    browser: browserName(),
    storage: "Memeriksa…",
  };
}

function App() {
  const [screen, setScreen] = useState<Screen>("catalog");
  const [connection, setConnection] = useState("checking");
  const [device, setDevice] = useState(snapshot);
  const [activities, setActivities] = useState<ActivityDefinition[]>([]);
  const [selected, setSelected] = useState<ActivityRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let disposed = false;
    const refresh = async () => {
      const next = snapshot();
      const estimate = await navigator.storage?.estimate?.();
      if (estimate?.quota && estimate.usage !== undefined) {
        next.storage = Math.round((estimate.usage / estimate.quota) * 100) + "% terpakai";
      }
      if (!disposed) setDevice(next);
    };
    const check = async () => {
      try {
        const response = await fetch(apiUrl + "/health", { cache: "no-store", signal: AbortSignal.timeout(3000) });
        if (!disposed) setConnection(response.ok ? "connected" : "unavailable");
      } catch {
        if (!disposed) setConnection("unavailable");
      }
    };
    void refresh();
    void check();
    window.addEventListener("resize", refresh);
    window.addEventListener("online", check);
    window.addEventListener("offline", check);
    return () => {
      disposed = true;
      window.removeEventListener("resize", refresh);
      window.removeEventListener("online", check);
      window.removeEventListener("offline", check);
    };
  }, []);

  useEffect(() => {
    let disposed = false;
    fetch(apiUrl + "/api/activities", { signal: AbortSignal.timeout(5000) })
      .then(async (response) => {
        if (!response.ok) throw new Error("catalog");
        return (await response.json()) as { activities: ActivityDefinition[] };
      })
      .then((payload) => { if (!disposed) setActivities(payload.activities); })
      .catch(() => { if (!disposed) setError("Katalog belum dapat dimuat. Periksa koneksi API lalu coba lagi."); });
    return () => { disposed = true; };
  }, []);

  const openActivity = async (definition: ActivityDefinition) => {
    try {
      const response = await fetch(apiUrl + "/api/activities/" + definition.id);
      if (!response.ok) throw new Error("activity");
      const activity = (await response.json()) as ActivityRecord;
      const result = validateActivity(activity);
      if (!result.valid) throw new Error(result.issues[0]?.message ?? "Konfigurasi tidak valid.");
      setSelected(activity);
      setError(null);
      setScreen("detail");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Detail aktivitas belum dapat dimuat.");
    }
  };

  return (
    <main className="app-shell">
      <header className="hero-panel">
        <div className="brand-mark" aria-hidden="true">V</div>
        <div><p className="eyebrow">Platform pembelajaran matematika</p><h1>Vokara</h1><p className="hero-copy">Aktivitas belajar yang nyaman dipakai guru di IFP dan siswa di HP.</p></div>
        <div className={"status-pill status-" + connection}><span className="status-dot" />{connection === "connected" ? "API terhubung" : connection === "unavailable" ? "API belum tersedia" : "Memeriksa API"}</div>
      </header>
      <section className="content-panel" aria-live="polite">
        {screen === "catalog" && <Catalog activities={activities} error={error} onOpen={openActivity} />}
        {screen === "detail" && selected && <Detail activity={selected} onBack={() => setScreen("catalog")} onStart={() => setScreen("runtime")} />}
        {screen === "runtime" && selected && <Quiz activity={selected} onBack={() => setScreen("detail")} onDone={() => setScreen("detail")} />}
      </section>
      <section className="diagnostics-card" aria-labelledby="diagnostics-title">
        <div className="card-heading"><div><p className="eyebrow">Device baseline</p><h2 id="diagnostics-title">Informasi perangkat</h2></div><span className="mode-badge">{window.innerWidth >= 1024 ? "IFP / layar besar" : "HP / layar kecil"}</span></div>
        <dl className="diagnostics-list">
          <div><dt>Viewport</dt><dd>{device.viewport}</dd></div><div><dt>Browser</dt><dd>{device.browser}</dd></div><div><dt>Touch points</dt><dd>{device.touchPoints}</dd></div><div><dt>Jaringan perangkat</dt><dd>{device.online ? "Terhubung" : "Offline"}</dd></div><div><dt>Browser storage</dt><dd>{device.storage}</dd></div>
        </dl>
      </section>
      <footer className="app-footer"><span>Activity SDK 1.0.0</span><span aria-hidden="true">·</span><span>Baseline cloud</span></footer>
    </main>
  );
}

function Catalog({ activities, error, onOpen }: { activities: ActivityDefinition[]; error: string | null; onOpen: (activity: ActivityDefinition) => void }) {
  return <div className="catalog-screen"><div className="section-heading"><div><p className="eyebrow">Katalog aktivitas</p><h2>Mulai dari aktivitas yang tersedia</h2><p>Pilih aktivitas yang sudah divalidasi untuk pilot.</p></div><span className="count-badge">{activities.length} aktivitas</span></div>
    {error && <div className="alert-card" role="alert"><strong>Katalog belum tersedia</strong><span>{error}</span><button type="button" onClick={() => window.location.reload()}>Coba lagi</button></div>}
    {!error && activities.length === 0 && <p className="empty-state">Memuat aktivitas…</p>}
    <div className="activity-grid">{activities.map((activity) => <article className="activity-card" key={activity.id}><div className="activity-card-top"><span className="mode-badge">{activity.mode}</span><span className="version-label">v{activity.version}</span></div><h3>{activity.title}</h3><p>{activity.description}</p><div className="activity-meta"><span>{activity.subject}</span><span>{activity.offlineReadiness === "ready" ? "Siap offline" : "Perlu koneksi"}</span></div><button type="button" onClick={() => onOpen(activity)}>Lihat detail</button></article>)}</div>
  </div>;
}

function Detail({ activity, onBack, onStart }: { activity: ActivityRecord; onBack: () => void; onStart: () => void }) {
  const definition = activity.definition;
  return <div className="detail-screen"><button className="secondary-button" type="button" onClick={onBack}>← Kembali ke katalog</button><div className="detail-heading"><div><p className="eyebrow">Detail aktivitas</p><h2>{definition.title}</h2><p>{definition.description}</p></div><span className="status-tag">Tersedia untuk pilot</span></div><div className="detail-grid"><div className="detail-card"><h3>Tujuan belajar</h3><ul>{definition.learningObjectives.map((item) => <li key={item}>{item}</li>)}</ul></div><div className="detail-card"><h3>Capability</h3><ul>{definition.capabilities.map((item) => <li key={item}>{item}</li>)}</ul><p className="muted">Versi {definition.version} · SDK {definition.sdkVersion}</p></div></div><button className="primary-action" type="button" onClick={onStart}>Mulai kuis</button></div>;
}

function Quiz({ activity, onBack, onDone }: { activity: ActivityRecord; onBack: () => void; onDone: () => void }) {
  const [answer, setAnswer] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const valid = useMemo(() => validateActivity(activity), [activity]);
  if (!valid.valid) return <div className="alert-card" role="alert"><strong>Kuis tidak dapat dijalankan</strong><span>{valid.issues[0]?.message}</span><button type="button" onClick={onBack}>Kembali</button></div>;
  const correct = answer === activity.config.correctOptionId;
  return <div className="quiz-screen"><button className="secondary-button" type="button" onClick={onBack}>← Kembali ke detail</button><p className="eyebrow">Kuis tracer · v{activity.definition.version}</p><h2>{activity.config.prompt}</h2><p className="quiz-instructions">{activity.config.instructions}</p><div className="option-list" role="radiogroup" aria-label="Pilihan jawaban">{activity.config.options.map((option) => <button key={option.id} type="button" className={"option-button " + (answer === option.id ? "option-selected" : "")} aria-pressed={answer === option.id} onClick={() => { setAnswer(option.id); setSubmitted(false); }}><span className="option-marker">{option.id.toUpperCase()}</span><span>{option.label}</span></button>)}</div>{submitted && <div className={"feedback-card " + (correct ? "feedback-correct" : "feedback-incorrect")} role="status"><strong>{correct ? "Jawaban benar" : "Jawaban belum tepat"}</strong><span>{correct ? activity.config.feedback.correct : activity.config.feedback.incorrect}</span></div>}<div className="quiz-actions"><button className="primary-action" type="button" disabled={!answer} onClick={() => setSubmitted(true)}>Periksa jawaban</button>{submitted && <button className="secondary-button" type="button" onClick={onDone}>Selesai</button>}</div></div>;
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
