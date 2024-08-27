import { describe, it, expect } from "vitest";
import {
  ErrorBody,
  ErrorCodes,
  ErrorResponse,
  InvalidRequestError,
  ServerError,
} from "./responses";
import { faker } from "@faker-js/faker";

describe("responses", () => {
  describe("ErrorBody()", () => {
    it("should return in the correct error format", () => {
      const param = {
        errorCode: faker.helpers.enumValue(ErrorCodes),
        errorMessage: faker.string.uuid(),
        service: faker.string.uuid(),
      };
      const body = ErrorBody(param);

      expect(typeof body).toBe("string");
      expect(JSON.parse(body)).toStrictEqual(param);
    });
  });

  describe("ErrorResponse()", () => {
    it("should return in the correct error format", () => {
      const param = {
        statusCode: 418,
        code: faker.helpers.enumValue(ErrorCodes),
        message: faker.string.uuid(),
        service: faker.string.uuid(),
      };
      const response = ErrorResponse(param);

      expect(response.statusCode).toStrictEqual(param.statusCode);
      expect(typeof response.body).toBe("string");
      expect(JSON.parse(response.body)).toStrictEqual({
        errorCode: param.code,
        errorMessage: param.message,
        service: param.service,
      });
    });
  });

  describe("ServerError()", () => {
    it("should return in the correct error format", () => {
      const param = {
        code: faker.helpers.enumValue(ErrorCodes),
        message: faker.string.uuid(),
        service: faker.string.uuid(),
      };
      const response = ServerError(param);

      expect(response.statusCode).toStrictEqual(500);
      expect(typeof response.body).toBe("string");
      expect(JSON.parse(response.body)).toStrictEqual({
        errorCode: param.code,
        errorMessage: param.message,
        service: param.service,
      });
    });

    describe("InvalidRequestError()", () => {
      it("should return in the correct error format", () => {
        const param = {
          code: faker.helpers.enumValue(ErrorCodes),
          message: faker.string.uuid(),
          service: faker.string.uuid(),
        };
        const response = InvalidRequestError(param);

        expect(response.statusCode).toStrictEqual(422);
        expect(typeof response.body).toBe("string");
        expect(JSON.parse(response.body)).toStrictEqual({
          errorCode: param.code,
          errorMessage: param.message,
          service: param.service,
        });
      });
    });
  });
});
