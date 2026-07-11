import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";

export async function dashboardSummary(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Dashboard summary request received: ${request.url}`);

  return {
    status: 200,
    jsonBody: {
      totalRevenue: 9300,
      serviceCalls: 8,
      averageRating: 4.3,
      openRecommendations: 5,
      lastUpdated: new Date().toISOString(),
    },
  };
}

app.http("dashboardSummary", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: dashboardSummary,
});