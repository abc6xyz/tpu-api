import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import Replicate from "replicate";

export const prediction = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const replicate = new Replicate({
        auth: process.env.REPLICATE_API_KEY as string,
      });

      const { model, input } = req.body;
      console.log(model, input)

      const output = await replicate.run(
        model,
        {
          input: input
        }
      );

      res.status(200).json(output) as Response;

    } catch (error) {
      console.log(error);

      if (error instanceof Error) {
        res.status(500).json({
          error: "Internal server error"
        }) as Response;
      }
    }
  }
);
