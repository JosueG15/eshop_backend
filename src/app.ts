import express, { Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { connectDB } from "./config/database";
import serviceHealthRoutes from "./routes/serviceHealth";
import { setupSwagger } from "./config/swagger";

dotenv.config();

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
app.use(process.env.API_BASE_URL || "/api", serviceHealthRoutes);

app.listen(process.env.API_PORT, () => {
  console.log(`The server is running in port 3000`);
});
