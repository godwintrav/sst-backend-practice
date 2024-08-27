import { test, expect, beforeEach, describe, afterEach } from "vitest";
import { invoke } from "@backend-exercise/utils/testing";
import { Config } from "sst/node/config";
import { PrismaClient } from "@prisma/client";
import { UserModel } from "services/user/user.model";

const callLambda = async (id: string) =>
  await invoke.viaHttp({
    endpoint: `/lambda/user/${id}`,
    method: "GET",
    headers: {
      "Mock-Api-Token": Config.MOCK_API_SECRET,
    },
  });
  let dbClient : PrismaClient;
  let user: UserModel;

describe('/lambda/user/{id}', () => {
    beforeEach(async () => {
        dbClient = new PrismaClient();
        await dbClient.user.deleteMany({});
    });

    afterEach(async () => {
        
        await dbClient.$disconnect();
    })

    test('returns 404 if user not found', async () => {
        await expect(() => callLambda("fakeId")).rejects.toThrowError('Request failed with status code 404');
    });

    test('returns 200 if user found', async () => {
        user = await dbClient.user.create({
            data: {
              name: "Godwin",
              email: "Odenigbo2@gmail.com"
            },
          });
        const response = await callLambda(user.id!);
        expect(response).toEqual(expect.objectContaining({
          statusCode: 200,
          body: {
              user
          }
      }));  
  })
})  
