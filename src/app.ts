import dotenv from "dotenv";
dotenv.config();

import express from "express";
import morgan from "morgan";
import cors from "cors";
import { connectDB } from "./config/database";
import serviceHealthRoutes from "./routes/serviceHealth";
import categoryRoutes from "./routes/categoryRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import { setupSwagger } from "./config/swagger";

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan(process.env.API_LOGGING_LEVEL || "tiny"));
app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Swagger
setupSwagger(app);

// Database connection
connectDB();

// Routes
app.use(`${process.env.API_BASE_URL}`, serviceHealthRoutes);
app.use(`${process.env.API_V1_URL}`, categoryRoutes);
app.use(`${process.env.API_V1_URL}`, productRoutes);
app.use(`${process.env.API_V1_URL}`, userRoutes);
app.use(`${process.env.API_V1_URL}`, authRoutes);
app.use(`${process.env.API_V1_URL}`, orderRoutes);

app.listen(process.env.API_PORT, () => {
  console.log(`The server is running in port 3000`);
});
