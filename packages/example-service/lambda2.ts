import axios from "axios";
import { ApiHandler } from "sst/node/api";
import { Config } from "sst/node/config";
import { mswDecorator } from "@backend-exercise/utils";
import { handlers } from "mocks/handlers";
import { PrismaClient } from "@prisma/client";
import { APIGatewayProxyEventV2 } from "aws-lambda";

const db = new PrismaClient();

export const handler = ApiHandler(
  mswDecorator(
    async (event: APIGatewayProxyEventV2) => {
        try {
            const newUser = await db.user.create({
              data: {
                name: "Godwin",
                email: "Odenigbo"
                // Add other fields as needed
              },
            });
            console.log('User created:', newUser);
          } catch (error) {
            console.error('Error creating user:', error);
          } finally {
            await db.$disconnect();
          }
      const apiResponse = await axios.get(`https://reqres.in/api/users/${event.pathParameters!.id}`);
      return {
        statusCode: 200,
        body: JSON.stringify({
          apiResponse: apiResponse.data,
        }),
      };
    },
    handlers,
    Config.MOCK_API_SECRET
  )
);
