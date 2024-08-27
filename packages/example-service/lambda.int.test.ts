import { test, expect } from "vitest";
import { invoke } from "@backend-exercise/utils/testing";
import { Config } from "sst/node/config";
import { users } from "./mocks/handlers";

const callLambda = async () =>
  await invoke.viaHttp({
    endpoint: "/lambda",
    method: "GET",
    headers: {
      "Mock-Api-Token": Config.MOCK_API_SECRET,
    },
  });

test("Responds with 200 OK", async () => {
  const response = await callLambda();
  //console.log(response);
  expect(response.body.apiResponse).toMatchObject(users);
});
