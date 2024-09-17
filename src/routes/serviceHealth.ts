import { Router } from "express";
import { getServiceHealth } from "../controllers/serviceHealthController";

const router = Router();

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
 *               type: object
 *               properties:
 *                 serviceName:
 *                   type: string
 *                   example: my-service
 *                 checkDate:
 *                   type: string
 *                   example: 2024-09-17T12:34:56.789Z
 *                 isUp:
 *                   type: boolean
 *                   example: true
 *                 serviceVersion:
 *                   type: string
 *                   example: 1.0.0
 *                 statusMessage:
 *                   type: string
 *                   example: The service is working
 *                 connectedServices:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       serviceName:
 *                         type: string
 *                         example: MongoDB
 *                       isUp:
 *                         type: boolean
 *                         example: true
 *                       statusMessage:
 *                         type: string
 *                         example: MongoDB is working
 *                       checkDate:
 *                         type: string
 *                         example: 2024-09-17T12:34:56.789Z
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/service-health", getServiceHealth);

export default router;
