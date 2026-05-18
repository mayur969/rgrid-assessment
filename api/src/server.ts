import http from "http";
import app from "./app";
import { env } from "../env";
import { initSocket } from "./sockets";
import { connectDB } from "./config/db";
import { seedAdmin } from "./seeders/admin.seeder";

// Connect to DBs
connectDB();

seedAdmin();

const port = env.PORT || 8000;

// Create HTTP server
const server = http.createServer(app);

const io = initSocket(server);

// Start listening
server.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Graceful shutdown
const shutdown = async (signal: string) => {
  server.close(async () => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
