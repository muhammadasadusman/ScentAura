
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import connectDB from "./config/db.js";
import cors from "cors";
import orderRoutes from "./routes/orderRoutes.js";
import dotenv from "dotenv";
import uploadRoutes from "./routes/uploadRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

const app = express();

// ===============================
// Connect MongoDB
// ===============================
connectDB();

// ===============================
// Request Check Middleware
// ===============================
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ===============================
// CORS CONFIGURATION
// ===============================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "https://scent-aura-khaki.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      console.log("❌ CORS blocked:", origin);
      return callback(new Error("Not allowed by CORS"));
    },

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],

    credentials: true,
  })
);



// ===============================
// Body Parser
// ===============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// API ROUTES
// ===============================
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/messages", messageRoutes);

// ===============================
// HOME ROUTE
// ===============================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 ScentAura Backend Running...",
  });
});

// ===============================
// GLOBAL ERROR HANDLER
// ===============================
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:");
  console.error(err);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS blocked this origin",
    });
  }

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ===============================
// SERVER
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
