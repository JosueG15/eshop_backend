import { v4 as uuidv4 } from "uuid";
import { StatusCodes } from "http-status-codes";
import { ErrorResponse } from "../models/errorResponse";

export function getInternalServerError<T>(
  message: string,
  additionalInfo?: T
): ErrorResponse<T> {
  return {
    id: uuidv4(),
    message,
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    additionalInfo,
  };
}

export function getNotFoundError<T>(
  message: string,
  additionalInfo?: T
): ErrorResponse<T> {
  return {
    id: uuidv4(),
    message,
    statusCode: StatusCodes.NOT_FOUND,
    additionalInfo,
  };
}

export function getBadRequestError<T>(
  message: string,
  additionalInfo?: T
): ErrorResponse<T> {
  return {
    id: uuidv4(),
    message,
    statusCode: StatusCodes.BAD_REQUEST,
    additionalInfo,
  };
}
