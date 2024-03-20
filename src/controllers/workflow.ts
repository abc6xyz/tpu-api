import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import { prisma } from "../utils/prisma";

export const createWorkflow = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.user;

      const workflow = await prisma.workflow.create({
        data: {
          name: "Untitled",
          nodes: [],
          user: { connect: { id } }
        }
      })

      res.status(200).json(workflow) as Response;

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

export const deleteWorkflow = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.user;

      const workflowId = parseInt(req.params.workflow_id);

      await prisma.workflow.findFirst({
        where: {
          id: workflowId,
          user_id: id,
        },
      });

      res.status(200).json(true) as Response;

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

export const publish = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.user;

      const workflowId = parseInt(req.params.workflow_id);
      const {name, nodes} = req.body;
      const workflow = await prisma.workflow.update({
        where: {
          id: workflowId,
          user_id: id
        },
        data: {
          name,
          nodes
        }
      })

      res.status(200).json(workflow) as Response;

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
      const { id } = req.user;

      const workflowId = parseInt(req.params.workflow_id);
      const workflow =  await prisma.workflow.findUnique({
        where:{
          id: workflowId,
          user_id: id
        }
      })
      
      res.status(200).json(workflow) as Response;

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

export const run = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.user;

      const workflowId = parseInt(req.params.workflow_id);
      const workflow =  await prisma.workflow.findUnique({
        where:{
          id: workflowId,
          user_id: id
        }
      })

      res.status(200).json(workflow) as Response;
      
    } catch (error) {
      console.log(error);

      if (error instanceof Error) {
        res.status(500).json({
          error: "Internal server error"
        }) as Response;
      }
    }
  }
)