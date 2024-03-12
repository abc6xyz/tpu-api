import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";

export const publish = asyncHandler(

  async (req: Request, res: Response) => {
    try {
      const workflow_id = req.params.workflow_id;

      res.status(200).json({
        status: 200,
        data: {}
      }) as Response;

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

export const get = asyncHandler(

  async (req: Request, res: Response) => {
    try {
      const workflow_id = req.params.workflow_id;

      res.status(200).json({
        status: 200,
        data: {}
      }) as Response;

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