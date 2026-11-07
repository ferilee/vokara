import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

type ConnectionState = "checking" | "connected" | "unavailable";

type DeviceSnapshot = {
  viewport: string;
  touchPoints: number;
  online: boolean;
  storage: string;
  browser: string;
};

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

function getBrowser(): string {
  const userAgent = navigator.userAgent;
  if (userAgent.includes("Edg/")) return "Microsoft Edge";
  if (userAgent.includes("Chrome/")) return "Chrome atau Chromium";
  if (userAgent.includes("Firefox/")) return "Firefox";
  if (userAgent.includes("Safari/")) return "Safari";
  return "Browser tidak teridentifikasi";
}

async function readStorage(): Promise<string> {
  if (!navigator.storage?.estimate) return "Tidak tersedia";

  const estimate = await navigator.storage.estimate();
  if (!estimate.quota || estimate.usage === undefined) return "Tidak tersedia";

  const used = Math.round((estimate.usage / estimate.quota) * 100);
  return `${used}% terpakai`;
}

function getDeviceSnapshot(): DeviceSnapshot {
  return {
    viewport: `${window.innerWidth} × ${window.innerHeight}px`,
    touchPoints: navigator.maxTouchPoints,
    online: navigator.onLine,
    storage: "Memeriksa…",
    browser: getBrowser(),
  };
}

function App() {
  const [connection, setConnection] = useState<ConnectionState>("checking");
  const [device, setDevice] = useState<DeviceSnapshot>(getDeviceSnapshot);

  useEffect(() => {
    let disposed = false;

    const refreshDevice = async () => {
      const snapshot = getDeviceSnapshot();
      snapshot.storage = await readStorage();
      if (!disposed) setDevice(snapshot);
    };

    const checkApi = async () => {
      try {
        const response = await fetch(`${apiUrl}/health`, {
          cache: "no-store",
          signal: AbortSignal.timeout(3000),
        });
        if (!disposed) setConnection(response.ok ? "connected" : "unavailable");
      } catch {
        if (!disposed) setConnection("unavailable");
      }
    };

    const handleNetworkChange = () => {
      void refreshDevice();
      void checkApi();
    };

    void refreshDevice();
    void checkApi();
    window.addEventListener("resize", handleNetworkChange);
    window.addEventListener("online", handleNetworkChange);
    window.addEventListener("offline", handleNetworkChange);

    const interval = window.setInterval(checkApi, 15000);
    return () => {
      disposed = true;
      window.clearInterval(interval);
      window.removeEventListener("resize", handleNetworkChange);
      window.removeEventListener("online", handleNetworkChange);
      window.removeEventListener("offline", handleNetworkChange);
    };
  }, []);

  const connectionLabel = {
    checking: "Memeriksa API",
    connected: "API terhubung",
    unavailable: "API belum tersedia",
  }[connection];

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="brand-mark" aria-hidden="true">V</div>
        <div>
          <p className="eyebrow">Fondasi platform pembelajaran</p>
          <h1>Vokara</h1>
          <p className="hero-copy">
            Satu ruang untuk media matematika yang nyaman dipakai guru di IFP
            dan siswa di HP.
          </p>
        </div>
        <div className={`status-pill status-${connection}`}>
          <span className="status-dot" />
          {connectionLabel}
        </div>
      </section>

      <section className="content-grid" aria-labelledby="welcome-title">
        <div className="welcome-card">
          <p className="eyebrow">Issue 001</p>
          <h2 id="welcome-title">Perangkat siap diperiksa</h2>
          <p>
            Halaman ini adalah baseline awal. Katalog aktivitas dan sesi kelas
            akan ditambahkan setelah fondasi perangkat dinyatakan siap.
          </p>
          <button type="button" onClick={() => window.location.reload()}>
            Muat ulang pemeriksaan
          </button>
        </div>

        <section className="diagnostics-card" aria-labelledby="diagnostics-title">
          <div className="card-heading">
            <div>
              <p className="eyebrow">Device baseline</p>
              <h2 id="diagnostics-title">Informasi perangkat</h2>
            </div>
            <span className="mode-badge">
              {window.innerWidth >= 1024 ? "IFP / layar besar" : "HP / layar kecil"}
            </span>
          </div>
          <dl className="diagnostics-list">
            <div><dt>Viewport</dt><dd>{device.viewport}</dd></div>
            <div><dt>Browser</dt><dd>{device.browser}</dd></div>
            <div><dt>Touch points</dt><dd>{device.touchPoints}</dd></div>
            <div><dt>Jaringan perangkat</dt><dd>{device.online ? "Terhubung" : "Offline"}</dd></div>
            <div><dt>Browser storage</dt><dd>{device.storage}</dd></div>
          </dl>
        </section>
      </section>

      <footer className="app-footer">
        <span>React + Vite + TypeScript</span>
        <span aria-hidden="true">·</span>
        <span>Baseline cloud</span>
      </footer>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
