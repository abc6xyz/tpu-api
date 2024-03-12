import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import Replicate from "replicate";

/**
 * Create a new training
 *
 * @param {string} model_owner - Required. The username of the user or organization who owns the model
 * @param {string} model_name - Required. The name of the model
 * @param {string} version_id - Required. The version ID
 * @param {object} options
 * @param {string} options.destination - Required. The destination for the trained version in the form "{username}/{model_name}"
 * @param {object} options.input - Required. An object with the model inputs
 * @param {string} [options.webhook] - An HTTPS URL for receiving a webhook when the training updates
 * @param {string[]} [options.webhook_events_filter] - You can change which events trigger webhook requests by specifying webhook events (`start`|`output`|`logs`|`completed`)
 * @returns {Promise<object>} Resolves with the data for the created training
 */
export const createTraining = asyncHandler(

  async (req: Request, res: Response) => {
    try {
      const replicate = new Replicate({
        auth: process.env.REPLICATE_API_KEY as string,
      });
      
      const {model_owner, model_name, version_id, options} = req.body;
      const { ...data } = options;

      if (data.webhook) {
        try {
          // eslint-disable-next-line no-new
          new URL(data.webhook);
        } catch (err) {
          throw new Error("Invalid webhook URL");
        }
      }
    
      const response = await replicate.request(
        `/models/${model_owner}/${model_name}/versions/${version_id}/trainings`,
        {
          method: "POST",
          data,
        }
      );

      const output = await response.json();

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

/**
 * Fetch a training by ID
 *
 * @param {string} training_id - Required. The training ID
 * @returns {Promise<object>} Resolves with the data for the training
 */
export const getTraining = asyncHandler(

  async (req: Request, res: Response) => {
    try {
      const replicate = new Replicate({
        auth: process.env.REPLICATE_API_KEY as string,
      });
      
      const training_id = req.params.training_id;

      const response = await replicate.request(`/trainings/${training_id}`, {
        method: "GET",
      });

      const output = await response.json();

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

/**
 * Cancel a training by ID
 *
 * @param {string} training_id - Required. The training ID
 * @returns {Promise<object>} Resolves with the data for the training
 */
export const cancelTraining = asyncHandler(

  async (req: Request, res: Response) => {
    try {
      const replicate = new Replicate({
        auth: process.env.REPLICATE_API_KEY as string,
      });
      
      const training_id = req.params.training_id;

      const response = await replicate.request(`/trainings/${training_id}/cancel`, {
        method: "POST",
      });

      const output = await response.json();

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

/**
 * List all trainings
 *
 * @returns {Promise<object>} - Resolves with a page of trainings
 */
export const listTrainings = asyncHandler(

  async (req: Request, res: Response) => {
    try {
      const replicate = new Replicate({
        auth: process.env.REPLICATE_API_KEY as string,
      });

      const response = await replicate.request("/trainings", {
        method: "GET",
      });    

      const output = await response.json();

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
