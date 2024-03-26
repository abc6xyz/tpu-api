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

      await prisma.workflow.delete({
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
      const data = req.body;
      const workflow = await prisma.workflow.update({
        where: {
          id: workflowId,
          user_id: id
        },
        data
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

      if(!workflow) return res.status(400).json('Workflow Not Found.') as Response;

      const { input } = req.body;

      let _tWorkflow = workflow;

      // Find the node ID with type "workflow_constants"
      let constantsNodes: any[] = _tWorkflow.nodes.filter((node: any) => node.type === 'workflow_constants');
      if (constantsNodes.length) {
        constantsNodes.forEach((constantsNode) => {
          // Find edges with source ID equal to the constants node ID
          let relevantEdges: any[] = _tWorkflow.edges.filter((edge: any) => edge.source === constantsNode.id);
          relevantEdges.forEach((edge) => {
            const sourceHandle = edge.sourceHandle;
            const targetHandle = edge.targetHandle;
            const [targetNodeId, constInput] = targetHandle.split('-')

            // Remove the workflow_constants node and related edges
            _tWorkflow.nodes = _tWorkflow.nodes.filter((node: any) => node.id !== constantsNode.id);
            _tWorkflow.edges = _tWorkflow.edges.filter((edge: any) => edge.source !== constantsNode.id);

            // Find the target node
            const targetNodeIndex = _tWorkflow.nodes.findIndex((node: any) => node.id === targetNodeId);
            
            // Replace placeholder in the template of the target node
            if (targetNodeIndex !== -1) {
              (_tWorkflow.nodes[targetNodeIndex] as any).data.template = (_tWorkflow.nodes[targetNodeIndex] as any).data.template.replace(`{{ ${constInput} }}`, constantsNode.data.workflow_constants[sourceHandle].value);
            }
          });
        })
      }

      let node_results: any = {};
      let output: any = {};
      let source_ids = ["1"]; // Entry node ID
      try {
        while (true) {
          let entry_edges = _tWorkflow.edges.filter((edge: any) => source_ids.includes(edge.source));
          _tWorkflow.edges = _tWorkflow.edges.filter((edge: any) => !source_ids.includes(edge.source));
          source_ids = [];

          for (let i = 0; i < entry_edges.length; i++) {
            if((entry_edges[i] as any).target === "2") {  // "2" : Output node ID
              output[(_tWorkflow.nodes[1] as any).data.workflow_outputs[`${(entry_edges[i] as any).targetHandle}`].key] = node_results[`${(entry_edges[i] as any).targetHandle}`];
              continue;
            }

            let entry_node = _tWorkflow.nodes.find((node: any) => node.id === (entry_edges[i] as any).target)
            Object.keys((entry_node as any).data.supported_inputs).forEach(key => {
              let replace = '';
              if((entry_edges[i] as any).source === "1") replace = input[key];
              else replace = node_results[`${(entry_edges[i] as any).targetHandle}`];
              (entry_node as any).data.template = (entry_node as any).data.template.replace(`{{ ${key} }}`, replace)
            });

            // Prediction Call

            const result = await (await fetch('/prediction', {
              method: "POST",
              body: JSON.stringify({
                model: (entry_node as any).data.model_id,
                input : {
                  template: (entry_node as any).data.template,
                  system_template: (entry_node as any).data.system_template
                }
              })
            })).json();

            _tWorkflow.edges.filter((edge: any) => edge.source === (entry_edges[i] as any).target).forEach((edge: any) => node_results[edge.targetHandle] = result.output.join());
            source_ids.push((entry_edges[i] as any).target)
          }

          if(_tWorkflow.edges.length === 0) break;
        }
      } catch (error) {
        return res.status(400).json('Bad Request.') as Response;
      }

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
)