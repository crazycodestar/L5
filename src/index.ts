import { Hono } from "hono";
import { cors } from "hono/cors";
import uploadRouter from "./routes/upload";
import certificateRouter from "./routes/certificate";

const app = new Hono();

// CORS configuration with whitelist
const corsConfig = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8080",
    process.env.SITE_URL || "",
  ],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400, // 24 hours
};

// Apply CORS middleware
app.use("*", cors(corsConfig));

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// Mount the upload router
app.route("/", uploadRouter);

// Mount the certificate router
app.route("/", certificateRouter);

const port = 8787;
console.log(`Server is running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
