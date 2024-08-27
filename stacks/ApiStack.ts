import { Config, Api, StackContext } from "sst/constructs";
import { v4 as uuid } from "uuid";

export function ApiStack({ stack }: StackContext) {
  const mockApiSecret = new Config.Parameter(stack, "MOCK_API_SECRET", {
    value: uuid(),
  });

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [mockApiSecret],
        runtime: "nodejs18.x",
      },
    },
    routes: {
      "GET  /lambda": "packages/example-service/lambda.handler",
      "GET  /lambda/{id}": "packages/example-service/lambda2.handler",
      "POST  /lambda": "packages/example-service/create-user.handler",
      "GET  /lambda/user/{id}": "packages/example-service/get-user-lambda.handler",
    },
  });

  stack.addOutputs({
    ApiUrl: api.url,
    MockApiSecret: mockApiSecret.value,
  });

  return { api };
}
