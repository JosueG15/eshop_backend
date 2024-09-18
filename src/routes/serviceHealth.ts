import { Router } from "express";
import { getServiceHealth } from "../controllers/serviceHealthController";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ServiceHealth:
 *       type: object
 *       properties:
 *         serviceName:
 *           type: string
 *           description: Name of the service
 *         checkDate:
 *           type: string
 *           format: date-time
 *           description: Date and time the service health was checked
 *         isUp:
 *           type: boolean
 *           description: Whether the service is up or down
 *         serviceVersion:
 *           type: string
 *           description: Current version of the service
 *         statusMessage:
 *           type: string
 *           description: Message describing the current status of the service
 *         connectedServices:
 *           type: array
 *           description: Health statuses of connected services like MongoDB
 *           items:
 *             type: object
 *             properties:
 *               serviceName:
 *                 type: string
 *               isUp:
 *                 type: boolean
 *               statusMessage:
 *                 type: string
 *               checkDate:
 *                 type: string
 *                 format: date-time
 */

/**
 * @swagger
 * /service-health:
 *   get:
 *     summary: Get service health status
 *     description: Retrieves the health status of the service, including connected services like MongoDB if the `deep` parameter is passed.
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
 *               $ref: '#/components/schemas/ServiceHealth'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/service-health", getServiceHealth);

export default router;
