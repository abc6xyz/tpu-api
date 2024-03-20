import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import Replicate from "replicate";
import { minimalBalance, pricePsec } from "../const";
import { prisma } from "../utils/prisma";
import { Llama2Tokenizer } from "@lenml/llama2-tokenizer";
import { load_vocab } from "@lenml/llama2-tokenizer-vocab-llama2"
import { pricePerInputToken, pricePerOutputToken } from "../const";

async function tokenize(text:string) {
  const llamaTokenizer = new Llama2Tokenizer()
  const vocab = load_vocab()
  llamaTokenizer.install_vocab(vocab)
  const tokens = llamaTokenizer.tokenize(text)
  return tokens.length
}

async function calculateCost(input:string, output:string,model:string) {
  const inputCost = pricePerInputToken[model]
  const outputCost = pricePerOutputToken[model]
  const inputTokens = await tokenize(input)
  const outputTokens = await tokenize(output)
  const inputTotal = inputTokens * inputCost
  const outputTotal = outputTokens * outputCost
  console.log(inputTotal + outputTotal)
  return inputTotal + outputTotal
}

export const prediction = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      console.log(req.user, req.body)
      let id;
      if (req.user) {
        id =  req.user.id;
      } else {
        id = req.body.userId;
      }
      const user = await prisma.user.findUnique({
        where: {
          id
        }
      })
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }
      if (user.balance < minimalBalance) {
        return res.status(400).json({ error: 'Not sufficient balance' });
      }

      const replicate = new Replicate({
        auth: process.env.REPLICATE_API_KEY as string,
      });

      const { model, input } = req.body;

      const startTime = Date.now()

      const output = await replicate.run(
        model,
        {
          input: input
        }
      );

      let issuedBalance = 0;
      if (model in pricePerInputToken) {
        issuedBalance = await calculateCost(input.prompt, (output as any).output.join(''), model)
      } else {
        const endTime = Date.now()
        const issuedTime = (endTime - startTime + 999) / 1000;
        issuedBalance = issuedTime * pricePsec.nvidia_a40_1x_48gb_10x_72gb
      }

      await prisma.user.update({
        where: {
          id
        },
        data: {
          balance: user.balance - issuedBalance
        }
      })
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
