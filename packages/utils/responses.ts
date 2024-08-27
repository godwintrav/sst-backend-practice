export enum ErrorCodes {
  MISSING_REQUEST_BODY = "MISSING_REQUEST_BODY",
  DATA_PROVISION_ERROR = "DATA_PROVISION_ERROR",
  UNAUTHORIZED = "UNAUTHORIZED",
}

interface ErrorResponseParams {
  statusCode?: number;
  message: string;
  code: ErrorCodes;
  service: string;
}

interface ErrorBodyParams {
  errorCode: ErrorCodes;
  errorMessage: string;
  service: string;
}

export const ErrorResponse = ({
  statusCode,
  message,
  code,
  service,
}: ErrorResponseParams) => ({
  statusCode: statusCode!,
  body: ErrorBody({ errorMessage: message, errorCode: code, service }),
});

export const ServerError = ({
  statusCode = 500,
  message,
  code,
  service,
}: ErrorResponseParams) =>
  ErrorResponse({
    statusCode,
    message,
    code,
    service,
  });

export const InvalidRequestError = ({
  statusCode = 422,
  message,
  code,
  service,
}: ErrorResponseParams) =>
  ErrorResponse({
    statusCode,
    message,
    code,
    service,
  });

export const ErrorBody = ({
  errorCode,
  errorMessage,
  service,
}: ErrorBodyParams) =>
  JSON.stringify({
    errorCode,
    errorMessage,
    service,
  });
