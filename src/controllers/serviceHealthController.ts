import { Request, Response } from "express";
import { ServiceHealthService } from "../services/serviceHealthService";
import { getInternalServerError } from "../helpers/errorHelper";

export const getServiceHealth = async (req: Request, res: Response) => {
  const serviceHealthService = new ServiceHealthService();

  try {
    const deep = req.query.deep as string;
    const healthResponse = await serviceHealthService.getFullServiceHealth(
      deep
    );
    res.json(healthResponse);
  } catch (error) {
    const errorResponse = getInternalServerError(
      "Unexpected error while doing service health check",
      error
    );
    res.status(errorResponse.statusCode).json(errorResponse);
  }
};
