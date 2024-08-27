import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  APIGatewayProxyStructuredResultV2,
  Context,
} from "aws-lambda";
import { HttpHandler } from "msw";
import { setupServer, type SetupServer } from "msw/node";

export const mswDecorator = (
  lambdaHandlerToDecorate: APIGatewayProxyHandlerV2,
  handlers: HttpHandler[],
  mockApiSecret: string
) => {
  return async (event: APIGatewayProxyEventV2, context: Context) => {
    const mswEnabled = mockApiSecret === event.headers["mock-api-token"];

    let server: SetupServer | null = null;
    console.log(event.headers);

    if (mswEnabled) {
      server = setupServer(...handlers);
      server.listen();
      console.info("MSW running");
    } else {
      console.debug("MSW skipped");
    }

    const response = (await lambdaHandlerToDecorate(
      event,
      context,
      () => {}
    )) as APIGatewayProxyStructuredResultV2 | void;
    //console.log(response);

    if (server) {
      server.close();
      console.info("MSW listener closed");
    }

    return response;
  };
};
