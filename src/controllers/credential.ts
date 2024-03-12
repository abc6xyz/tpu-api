import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import { randomUUID } from "crypto";

export const generateApiKey = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { keyName } = req.body;

      if ( !keyName ) {
        return res.status(400).json({ error: 'Key name is required in the request body.' });
      }

      const apiKey = randomUUID();

      res.status(200).json({
        success: true,
        data: {
          keyName,
          apiKey
        }
      }) as Response;

    } catch (error) {
      console.log(error);

      if (error instanceof Error) {
        res.status(400).json({
          error: error.message.toString(),
        }) as Response;
      }
    }
  }
);
