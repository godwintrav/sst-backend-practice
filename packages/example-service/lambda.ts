import axios from "axios";
import { ApiHandler } from "sst/node/api";
import { Config } from "sst/node/config";
import { mswDecorator } from "@backend-exercise/utils";
import { handlers } from "mocks/handlers";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export const handler = ApiHandler(
  mswDecorator(
    async () => {
      const apiResponse = await axios.get("https://reqres.in/api/users");
      const dbResponse = await db.user.findFirst();

      return {
        statusCode: 200,
        body: JSON.stringify({
          apiResponse: apiResponse.data,
          dbResponse,
        }),
      };
    },
    handlers,
    Config.MOCK_API_SECRET
  )
);
