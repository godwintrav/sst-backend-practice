
import { ApiHandler } from "sst/node/api";
import { Config } from "sst/node/config";
import { mswDecorator } from "@backend-exercise/utils";
import { handlers } from "mocks/handlers";
import { createUser } from "controllers/user.controller";
import { APIGatewayProxyEventV2 } from "aws-lambda";

export const handler = ApiHandler(
  mswDecorator(
    async (event: APIGatewayProxyEventV2) => {

      return await createUser(event.body!);
    },
    handlers,
    Config.MOCK_API_SECRET
  )
);