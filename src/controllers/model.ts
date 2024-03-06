import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import type { IModel } from "../types/index";
import Replicate from "replicate";

export const runModel = asyncHandler(

  async (req: Request, res: Response) => {
    try {
      const replicateApiToken = req.headers.authorization;
      if (!replicateApiToken) {
        return res.status(403).json({
          status: 403,
          message: "API key required.",
        });
      }

      const replicate = new Replicate({
        auth: replicateApiToken,
      });

      const { model, input } = req.body as IModel;

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
