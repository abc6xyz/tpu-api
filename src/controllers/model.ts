import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import { prisma } from "../utils/prisma";

/**
 * Get information about a model
 *
 * @param {string} model_owner - Required. The name of the user or organization that owns the model
 * @param {string} model_name - Required. The name of the model
 * @returns {Promise<object>} Resolves with the model data
 */
export const getModel = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const model_owner = req.params.model_owner;
      const model_name = req.params.model_name;

      const modelData = await prisma.model.findFirst({
        where:{
          name: model_name,
          owner: model_owner
        }
      })

      res.status(200).json(modelData) as Response;
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

/**
 * List model versions
 *
 * @param {string} model_owner - Required. The name of the user or organization that owns the model
 * @param {string} model_name - Required. The name of the model
 * @returns {Promise<object>} Resolves with the list of model versions
 */
export const listModelVersions = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const model_owner = req.params.model_owner;
      const model_name = req.params.model_name;

      const modelData = await prisma.model.findFirst({
        where:{
          name: model_name,
          owner: model_owner
        }
      })

      res.status(200).json(modelData?.latest_version) as Response;
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

/**
 * Get a specific model version
 *
 * @param {string} model_owner - Required. The name of the user or organization that owns the model
 * @param {string} model_name - Required. The name of the model
 * @param {string} version_id - Required. The model version
 * @returns {Promise<object>} Resolves with the model version data
 */
export const getModelVersion = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const model_owner = req.params.model_owner;
      const model_name = req.params.model_name;
      const version_id = req.params.version_id;

      const modelData = await prisma.model.findFirst({
        where:{
          name: model_name,
          owner: model_owner
        }
      })

      res.status(200).json(modelData?.latest_version) as Response;

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

/**
 * List all public models
 *
 * @returns {Promise<object>} Resolves with the model version data
 */
export const listModels = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const modelsData = await prisma.model.findMany({
        select: {
          cover_image_url: true,
          created_at: true,
          default_example: true,
          description: true,
          github_url: true,
          latest_version: true,
          license_url: true,
          name: true,
          owner: true,
          paper_url: true,
          run_count: true,
          url: true,
          visibility: true
        },
      });

      res.status(200).json(modelsData) as Response;
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

// /**
//  * Create a new model
//  *
//  * @param {string} model_owner - Required. The name of the user or organization that will own the model. This must be the same as the user or organization that is making the API request. In other words, the API token used in the request must belong to this user or organization.
//  * @param {string} model_name - Required. The name of the model. This must be unique among all models owned by the user or organization.
//  * @param {object} options
//  * @param {("public"|"private")} options.visibility - Required. Whether the model should be public or private. A public model can be viewed and run by anyone, whereas a private model can be viewed and run only by the user or organization members that own the model.
//  * @param {string} options.hardware - Required. The SKU for the hardware used to run the model. Possible values can be found by calling `Replicate.hardware.list()`.
//  * @param {string} options.description - A description of the model.
//  * @param {string} options.github_url - A URL for the model's source code on GitHub.
//  * @param {string} options.paper_url - A URL for the model's paper.
//  * @param {string} options.license_url - A URL for the model's license.
//  * @param {string} options.cover_image_url - A URL for the model's cover image. This should be an image file.
//  * @returns {Promise<object>} Resolves with the model version data
//  */
// export const createModel = asyncHandler(
//   async (req: Request, res: Response) => {
//     try {
//       const replicate = new Replicate({
//         auth: process.env.REPLICATE_API_KEY as string,
//       });

//       const { model_owner, model_name, options } = req.body;
//       const data = { owner: model_owner, name: model_name, ...options };

//       const response = await replicate.request("/models", {
//         method: "POST",
//         data,
//       });
    
//       const output = await response.json();

//       res.status(200).json(output) as Response;

//     } catch (error) {
//       console.log(error);

//       if (error instanceof Error) {
//         res.status(500).json({
//           error: "Internal server error"
//         }) as Response;
//       }
//     }
//   }
// );
