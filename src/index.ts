import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { model } from "./routes";

// Create the express app and import the type of app from express;
const app: Application = express();

// Cors
app.use(cors());
// Configure env:
dotenv.config();

// Parser
// Body parser middleware
// Raw json:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Declate the PORT:
const port = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("TPU API Server running...");
});

// Users Routes
app.use("/api/model", model);

// Listen the server
app.listen(port, async () => {
  console.log(`=> Server running at http://localhost:${port}`);
});
