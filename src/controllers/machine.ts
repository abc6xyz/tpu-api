import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";

export const search = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      let offers = {}
      if (req.method === "GET"){
        console.log(req.params)
        const queryParams = req.params ? `?${new URLSearchParams(req.params).toString()}` : '';
        console.log(queryParams);
        const fullUrl = `https://console.vast.ai/api/v0/bundles${queryParams}`;
        offers = await (await fetch(fullUrl)).json();
      }

      if (req.method === "POST"){
        const queryParams = req.body;
        console.log(queryParams);
        const fullUrl = `https://console.vast.ai/api/v0/bundles/`;
        offers = await (await fetch(fullUrl, {
          method: "POST",
          body: JSON.stringify(queryParams)
        })).json();
      }

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
