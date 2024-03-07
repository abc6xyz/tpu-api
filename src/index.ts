import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { prediction, workflow } from "./routes";

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

const requireAuthorization = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Replicate API key missing' });
  }
  next(); // Continue to the next middleware or route handler
};
// Apply the requireAuthorization middleware to all routes under "/api/prediction" model running...
app.use("/api/model", requireAuthorization);

app.get("/", (req: Request, res: Response) => {
  res.send("TPU API Server running...");
});

// All Routes
app.use("/api/model", prediction);
app.use("/api/workflow", workflow);

// Listen the server
app.listen(port, async () => {
  console.log(`=> Server running at http://localhost:${port}`);
});
