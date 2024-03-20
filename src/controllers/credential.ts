import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import { apiKeyGen } from "../utils";
import { prisma } from "../utils/prisma";

export const generateApiKey = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { keyName } = req.body;

      if ( !keyName ) {
        return res.status(400).json({ error: 'Key name is required in the request body.' });
      }

      const userWallet = req.headers['user-wallet'] as string;
      const user = await prisma.user.findUnique({
        where: {
          wallet: userWallet
        },
        select: {
          id: true
        }
      });
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      const apiKey = apiKeyGen(JSON.stringify({keyName}));

      const existingApiKey = await prisma.apiKey.findFirst({
        where: {
          name: keyName,
          user_id: user.id
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
              connect: { id: user.id } // Associate the API key with the user
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
      const userWallet = req.headers['user-wallet'] as string;
      const user = await prisma.user.findUnique({
        where: {
          wallet: userWallet
        },
        select: {
          id: true
        }
      });
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      const apis = await prisma.apiKey.findMany({
        where: {
          user_id: user.id
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

export const getCredential = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const userWallet = req.headers['user-wallet'] as string;
      const user = await prisma.user.findUnique({
        where: {
          wallet: userWallet
        }
      });
      if (!user) {
        const newUser = await prisma.user.create({
          data: {
            wallet: userWallet,
          },
          select: {
            wallet: true,
            balance: true,
          }
        })
        return res.status(200).json(newUser) as Response;
      }

      return res.status(200).json({wallet: user.wallet, balance: user.balance}) as Response;
      
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