import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import Replicate from "replicate";

export const getHardware = asyncHandler(

  async (req: Request, res: Response) => {
    try {
      const replicate = new Replicate({
        auth: process.env.REPLICATE_API_KEY as string,
      });

      const response = await replicate.request("/hardware", {
        method: "GET",
      });    

      const output = await response.json();
      
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
