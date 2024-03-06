interface Model_Input {
  width?: number,
  height?: number,
  prompt: string,
  scheduler?: string,
  num_outputs?: number,
  guidance_scale?: number,
  apply_watermark?: boolean,
  negative_prompt?: string,
  prompt_strength?: number,
  num_inference_steps?: number
}

export interface IModel {
  model: `${string}/${string}` | `${string}/${string}:${string}`;
  input: Model_Input;
}