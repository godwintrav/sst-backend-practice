import { test, expect, beforeAll, describe, afterAll } from "vitest";
import { invoke } from "@backend-exercise/utils/testing";
import { Config } from "sst/node/config";
import { PrismaClient } from "@prisma/client";

interface bodyType {
    name: string;
    email: string;
}

const callLambda = async (body: bodyType) =>
  await invoke.viaHttp({
    endpoint: "/lambda",
    method: "POST",
    headers: {
      "Mock-Api-Token": Config.MOCK_API_SECRET,
    },
    body
  });
  let dbClient : PrismaClient;

describe('/lambda', () => {

    beforeAll(async () => {
        dbClient = new PrismaClient();
    });

    afterAll(async () => {
        await dbClient.user.deleteMany({});
        await dbClient.$disconnect();
    })

    test("Responds with 201 CREATED", async () => {
        const body = {
            "name": "Odenigbo",
            "email": "godwin180@gmail.com"
        }
      const response = await callLambda(body);
      console.log(response);
      expect(response.statusCode).toBe(201);
    });

    test("Should fail If Email Already Exists", async () => {
        const body = {
            "name": "Odenigbo",
            "email": "godwin180@gmail.com"
        }
        expect(() => callLambda(body)).rejects.toThrowError('Request failed with status code 422');
      });

      test("Should fail If Email Invalid", async () => {
        const body = {
            "name": "Odenigbo",
            "email": "godwin180"
        }
        expect(() => callLambda(body)).rejects.toThrowError('Request failed with status code 422');
      });

      test("Should fail If Email and Name is empty", async () => {
        const body = {
            "name": "",
            "email": ""
        }
        expect(() => callLambda(body)).rejects.toThrowError('Request failed with status code 422');
      });
})


