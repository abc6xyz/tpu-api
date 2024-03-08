import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";

export const searchByQuery = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const queryParams = req.params ? `?${new URLSearchParams(req.params).toString()}` : '';
      const fullUrl = `https://console.vast.ai/api/v0/bundles${queryParams}`;

      const offers = await (await fetch(fullUrl)).json();

      res.status(200).json(offers) as Response;

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

export const searchByFilter = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const queryParams = req.body;

      const fullUrl = `https://console.vast.ai/api/v0/bundles/`;

      const offers = await (await fetch(fullUrl, {
        method: "POST",
        body: JSON.stringify(queryParams)
      })).json();

      res.status(200).json(offers) as Response;

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
