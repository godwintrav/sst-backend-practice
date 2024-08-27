import axios, { RawAxiosRequestHeaders } from "axios";
import { Api } from "sst/node/api";

interface HttpParams {
  endpoint: string;
  method: "GET" | "DELETE" | "POST" | "PUT";
  headers?: RawAxiosRequestHeaders;
  body?: object;
}

export const viaHttp = async ({
  endpoint,
  method = "GET",
  headers,
  body,
}: HttpParams) => {
  const endpointNoLeadingSlash = endpoint.startsWith("/")
    ? endpoint.substring(1)
    : endpoint;

  const url = `${Api.api.url}/${endpointNoLeadingSlash}`;
  const setContentTypeToJson = method === "POST" || method === "PUT";

  const response = await axios(url, {
    method,
    headers: {
      ...(setContentTypeToJson && { "Content-Type": "application/json" }),
      ...headers,
    },
    data: body,
  });

  return {
    statusCode: response.status,
    body: response.data,
  };
};
