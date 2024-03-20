import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import { apiKeyGen, generateToken } from "../utils";
import { prisma } from "../utils/prisma";

export const generateApiKey = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.user;
      const { keyName } = req.body;

      if ( !keyName ) {
        return res.status(400).json({ error: 'Key name is required in the request body.' });
      }

      const apiKey = apiKeyGen(JSON.stringify({userId: id}));

      const existingApiKey = await prisma.apiKey.findFirst({
        where: {
          name: keyName,
          user_id: id
        }
      });
      
      if (existingApiKey) {
        // Update the existing API key
        await prisma.apiKey.update({
          where: {
            id: existingApiKey.id
          },
          data: {
            key: apiKey // Update the API key
          }
        });
      } else {
        // Create a new API key
        await prisma.apiKey.create({
          data: {
            name: keyName,
            key: apiKey,
            user: {
              connect: { id } // Associate the API key with the user
            }
          }
        });
      }

      res.status(200).json({
        success: true,
        data: {
          keyName,
          apiKey
        }
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

export const getApiKeys = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.user;

      const apis = await prisma.apiKey.findMany({
        where: {
          user_id: id
        },
        select: {
          name: true,
          key: true
        }
      });

      res.status(200).json(apis) as Response;

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

// login user, sign up user if not exist.
export const getCredential = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { wallet } = req.body;

      let user = await prisma.user.findUnique({
        where: {
          wallet
        }
      });
      if (!user) {
        user = await prisma.user.create({
          data: {
            wallet,
          },
          select: {
            id: true,
            wallet: true,
            balance: true,
          }
        })
      }

      const token = generateToken({ id:user.id });
      return res.status(200).json({ token }) as Response;

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