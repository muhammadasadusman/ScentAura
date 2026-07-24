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


dotenv.config();

connectDB();

const app = express();


// Request check middleware
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});


app.use(cors());
app.use(express.json());


app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);


app.get("/", (req, res) => {
  res.send("🚀 ScentAura Backend Running...");
});


const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


// Global Error Handler (last me)
app.use((err, req, res, next) => {

  console.error("GLOBAL ERROR:");
  console.error(err);

  res.status(500).json({
    message: err.message,
  });

});