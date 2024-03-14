import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import { prisma } from "../utils/prisma";

export const getCollections = asyncHandler(

  async (req: Request, res: Response) => {
    try {
      const collectionData = await prisma.collection.findMany({
        select: {
          name: true,
          slug: true,
          description: true
        },
      })

      res.status(200).json(collectionData) as Response;
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

export const getCollection = asyncHandler(

  async (req: Request, res: Response) => {
    try {
      const collection_slug = req.params.collection_slug;
      
      const collectionData = await prisma.collection.findFirst({
        where: {
          slug: collection_slug
        }
      });
      
      if (!collectionData) {
        res.status(404).json({error:"collection slug not found"}) as Response;
        return;
      }
      
      const models = await prisma.model.findMany({
        where: {
          collection_id: {
            has: collectionData.id
          }
        }
      });

      res.status(200).json({...collectionData, models}) as Response;
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
