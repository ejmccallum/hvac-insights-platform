import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";

export async function healthCheck(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Health check request received: ${request.url}`);

  return {
    status: 200,
    jsonBody: {
      status: "ok",
      service: "hvac-insights-api",
      message: "Azure Functions API is running locally.",
      timestamp: new Date().toISOString(),
    },
  };
}

app.http("healthCheck", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: healthCheck,
});