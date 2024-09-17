import mongoose, { mongo } from "mongoose";
import { ServiceHealthResponse } from "../models/serviceHealthModel";
import { PackageModel } from "../models/packageModel";
import fs from "fs";
import path from "path";

export class ServiceHealthService {
  private package: PackageModel;

  constructor() {
    const packagePath = path.resolve(__dirname, "../../package.json");
    this.package = JSON.parse(fs.readFileSync(packagePath, "utf-8"));
  }

  public getServiceHealth(): ServiceHealthResponse {
    const response: ServiceHealthResponse = {
      serviceName: this.package.name,
      checkDate: new Date().toISOString(),
      isUp: true,
      serviceVersion: this.package.version,
      statusMessage: "Service is working",
      connectedServices: [],
    };

    return response;
  }

  public async getConnectedServices(): Promise<ServiceHealthResponse[]> {
    const services: ServiceHealthResponse[] = [];

    const mongoHealth: ServiceHealthResponse = {
      serviceName: "MongoDB",
      checkDate: new Date().toISOString(),
      isUp: mongoose.connection.readyState === 1,
      statusMessage:
        mongoose.connection.readyState === 1
          ? "Service is working"
          : "Service is not working",
      serviceVersion: mongoose.version,
    };

    services.push(mongoHealth);

    return services;
  }

  public async getFullServiceHealth(
    deep = "none"
  ): Promise<ServiceHealthResponse> {
    const appHealth = this.getServiceHealth();

    if (deep === "all") {
      const connectedServices = await this.getConnectedServices();
      appHealth.connectedServices = connectedServices;
    }

    return appHealth;
  }
}
