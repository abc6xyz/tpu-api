import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { model, workflow, machine, credential, hardware, training, collection, prediction } from "./routes";
import { decryptApiKey, verifyToken } from "./utils";

interface User {
  id: number;
}

declare global {
  namespace Express {
    interface Request {
      user: User; // Define user property as optional
    }
  }
}

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

const requireTpuApiKey = async (req: Request, res: Response, next: NextFunction) => {
  const apiKeyHeader = req.headers['tpu-api-key'] as string;
  if (!apiKeyHeader) {
    return res.status(401).json({ error: 'TPU API key missing' });
  }
  try {
    const apiKeyInfo = await JSON.parse(decryptApiKey(apiKeyHeader));
    req.body.userId = apiKeyInfo.userId;
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ error: 'Invalid TPU API key' });
  }
};

// Apply the requireTpuApiKey middleware to all routes under "/api/model" model running...
app.use("/api/prediction", requireTpuApiKey);
// app.use("/api/training", requireTpuApiKey);
app.use("/api/machine", (req, res, next) => {
  if(req.path.match('/search')) {
    next();
  } else {
    requireTpuApiKey(req, res, next);
  }
});

app.use("/api/workflow", verifyToken);
app.use("/api/credential", (req, res, next) => {
  if (req.path === '/') {
      next(); // Skip token verification for /credential endpoint
  } else {
      verifyToken(req, res, next);
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("TPU API Server running...");
});

// All Routes
app.use("/api/model", model);
app.use("/api/workflow", workflow);
app.use("/api/machine", machine);
app.use("/api/credential", credential);
app.use("/api/hardware", hardware);
app.use("/api/training", training);
app.use("/api/collection", collection);
app.use("/api/prediction", prediction);

// Listen the server
app.listen(port, async () => {
  console.log(`=> Server running at http://localhost:${port}`);
});
