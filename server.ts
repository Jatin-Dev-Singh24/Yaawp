import express from "express";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;
  const isProduction =
    process.env.NODE_ENV === "production" ||
    (typeof __filename !== "undefined" && __filename.endsWith(".cjs"));

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "YAAWP", time: new Date().toISOString() });
  });

  app.get("/_health", (req, res) => {
    res.status(200).send("ok");
  });

  app.get("/healthz", (req, res) => {
    res.status(200).send("ok");
  });

  // Vite middleware for development vs static bundle for production
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} (production: ${isProduction})`);
  });
}

startServer();
