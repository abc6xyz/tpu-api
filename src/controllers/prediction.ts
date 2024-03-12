import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import Replicate from "replicate";

export const prediction = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      console.log("key: ", req.headers["tpu-api-key"])
      const replicate = new Replicate({
        auth: req.headers["tpu-api-key"] as string,
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
        res.status(400).json({
          status: 400,
          message: error.message.toString(),
        }) as Response;
      }
    }
  }
);
