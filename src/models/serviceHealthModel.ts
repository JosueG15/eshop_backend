export interface ServiceHealthResponse {
  serviceName: string;
  checkDate: string;
  isUp: boolean;
  serviceVersion: string;
  statusMessage: string;
  connectedServices?: Array<ServiceHealthResponse>;
}
