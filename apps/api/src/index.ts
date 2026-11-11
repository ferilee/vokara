import { startServer } from "./server";

const { server } = await startServer();

console.log(`Vokara API berjalan di http://localhost:${server.port}`);
