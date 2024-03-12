import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import { apiKeyGen } from "../utils";

export const generateApiKey = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { keyName } = req.body;

      if ( !keyName ) {
        return res.status(400).json({ error: 'Key name is required in the request body.' });
      }

      const apiKey = apiKeyGen(JSON.stringify({keyName}));

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
        res.status(500).json({
          error: error.message.toString(),
        }) as Response;
      }
    }
  }
);
