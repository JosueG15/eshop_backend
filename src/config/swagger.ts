import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce API",
      version: "1.0.0",
      description: "A dynamic API documentation for the E-commerce platform",
    },
    components: {
      schemas: {
        Error: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Unique identifier for the error",
              example: "123e4567-e89b-12d3-a456-426614174000",
            },
            message: {
              type: "string",
              description: "Error message",
              example: "Unexpected error while doing service health check",
            },
            statusCode: {
              type: "integer",
              description: "HTTP status code",
              example: 500,
            },
            additionalInfo: {
              type: "object",
              description: "Additional error details",
              example: {
                stack: "Error stack trace or additional details here...",
              },
            },
          },
        },
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.API_PORT || 3000}`,
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

export const setupSwagger = (app: Express): void => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
