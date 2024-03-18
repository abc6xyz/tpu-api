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
        res.status(500).json({
          error: "Internal server error"
        }) as Response;
      }
    }
  }
);

export const getActiveInstances = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const response = await fetch('https://console.vast.ai/api/v0/instances', {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${process.env.VASTAI_KEY}`,
        }
      });

      const output = await response.json();

      return res.status(200).json(output);

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

export const getRecommendedTemplates = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const response = await fetch('https://cloud.vast.ai/api/v0/users/118874/templates/referral/', {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${process.env.VASTAI_KEY}`,
        }
      });

      const output = await response.json();

      return res.status(200).json(output);

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

export const startInstance = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const instanceConfig = req.body;
      const {id} = req.params;
      const response = await fetch(
        `https://console.vast.ai/api/v0/asks/${id}/`,
        {
          method: "PUT",
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${process.env.VASTAI_KEY}`,
          },
          body: JSON.stringify(instanceConfig)
        }
      );
      const output = await response.json();

      return res.status(200).json(output);

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

export const deleteInstance = asyncHandler(
  async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const response = await fetch(
          `https://console.vast.ai/api/v0/instances/${id}/?api_key=${process.env.VASTAI_KEY}`,
          {
            method: "DELETE"
          }
        )
        
        const output = await response.json();

        return res.status(200).json(output);

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