export interface ErrorResponse<T> {
  id: string;
  message: string;
  statusCode: number;
  additionalInfo?: T;
}
