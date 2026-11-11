import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import videoRoutes from "./routes/videoRoute.js";
// =====================================
// ENVIRONMENT VARIABLES
// =====================================
dotenv.config();

// =====================================
// EXPRESS APP
// =====================================

const app = express();

// =====================================
// __dirname FOR ES MODULES
// =====================================

const __filename = fileURLToPath(import.meta.url);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
const __dirname = path.dirname(__filename);


// =====================================
// MIDDLEWARE
// =====================================

app.use(
  cors({
    origin: [
      "https://videos-gules-delta.vercel.app",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({
  extended: true,
}));


// =====================================
// STATIC UPLOADS
// =====================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// Keep existing files from the legacy singular upload directory available.
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "upload")
  )
);


// =====================================
// API ROUTES
// =====================================

app.use(
  "/api/video",
  videoRoutes
);

// app.use("/api/admin", adminRoutes);


// =====================================
// HEALTH CHECK
// =====================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "video API is running",
  });
});


// =====================================
// 404 HANDLER
// =====================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


// =====================================
// ERROR HANDLER
// =====================================

app.use((err, req, res, next) => {
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON body. Send a JSON object, not a quoted or double-stringified JSON value.",
    });
  }

  if (err?.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      success: false,
      message: "File too large. Video and cover image files must each be 50 MB or smaller.",
    });
  }

  console.error("Server Error:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});


export default app;