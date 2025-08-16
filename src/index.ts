import { Hono } from "hono";
import uploadRouter from "./routes/upload";
import certificateRouter from "./routes/certificate";

const app = new Hono();

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
