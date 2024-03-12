import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import Replicate from "replicate";

export const getCollections = asyncHandler(

  async (req: Request, res: Response) => {
    try {
      const replicate = new Replicate({
        auth: process.env.REPLICATE_API_KEY as string,
      });
      
      const response = await replicate.request("/collections", {
        method: "GET",
      });

      const output = await response.json()

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

export const getCollection = asyncHandler(

  async (req: Request, res: Response) => {
    try {
      const replicate = new Replicate({
        auth: process.env.REPLICATE_API_KEY as string,
      });
      
      const collection_slug = req.params.collection_slug;

      const response = await replicate.request(`/collections/${collection_slug}`, {
        method: "GET",
      });

      const output = await response.json()

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
