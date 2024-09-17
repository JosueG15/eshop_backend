import { Request, Response } from "express";
import { ServiceHealthService } from "../services/serviceHealthService";
import { getInternalServerError } from "../helpers/errorHelper";

/**
 * @swagger
 * components:
 *   schemas:
 *     HealthCheckResponse:
 *       type: object
 *       properties:
 *         serviceName:
 *           type: string
 *           description: The name of the service
 *           example: "my-service"
 *         checkDate:
 *           type: string
 *           description: The time the check was performed
 *           example: "2024-09-17T12:34:56.789Z"
 *         isUp:
 *           type: boolean
 *           description: Whether the service is running
 *           example: true
 *         serviceVersion:
 *           type: string
 *           description: The current version of the service
 *           example: "1.0.0"
 *         statusMessage:
 *           type: string
 *           description: A status message indicating the health of the service
 *           example: "The service is working"
 *         connectedServices:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ConnectedService'
 *     ConnectedService:
 *       type: object
 *       properties:
 *         serviceName:
 *           type: string
 *           example: "MongoDB"
 *         isUp:
 *           type: boolean
 *           example: true
 *         statusMessage:
 *           type: string
 *           example: "MongoDB is working"
 *         checkDate:
 *           type: string
 *           example: "2024-09-17T12:34:56.789Z"
 *     Error:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the error
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         message:
 *           type: string
 *           description: Error message
 *           example: "Unexpected error while doing service health check"
 *         statusCode:
 *           type: integer
 *           description: HTTP status code
 *           example: 500
 *         additionalInfo:
 *           type: object
 *           description: Additional error details
 *           example: { stack: "Error stack trace or additional details here..." }
 */

/**
 * @swagger
 * /service-health:
 *   get:
 *     summary: Get service health status
 *     description: Retrieves the health status of the service, including connected services like MongoDB if deep parameter is passed.
 *     tags: [Service Health]
 *     parameters:
 *       - in: query
 *         name: deep
 *         schema:
 *           type: string
 *         description: If set to "all", performs a deeper health check of connected services
 *     responses:
 *       200:
 *         description: Service health status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheckResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
