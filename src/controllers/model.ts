import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import Replicate from "replicate";

export const prediction = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const replicate = new Replicate({
        auth: req.headers.authorization,
      });

      const { model, input } = req.body;

      const output = await replicate.run(
        model,
        {
          input: input
        }
      );

      res.status(200).json({
        status: 200,
        output: output
      }) as Response;

    } catch (error) {
      console.log(error);

      if (error instanceof Error) {
        res.status(400).json({
          status: 400,
          message: error.message.toString(),
        }) as Response;
      }
    }
  }
);
