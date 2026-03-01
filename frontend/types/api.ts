import { AxiosError } from "axios";

export interface ApiErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
}

export type ApiError = AxiosError<ApiErrorResponse>;

export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return error.response?.data?.message || "An unexpected error occurred";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
};

export const isApiError = (error: unknown): error is ApiError => {
  return (error as AxiosError).isAxiosError === true;
};
