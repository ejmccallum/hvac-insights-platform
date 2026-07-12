import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { queryDatabase } from "../services/database";

type DashboardSummaryRow = {
  totalRevenue: number;
  serviceCalls: number;
  averageRating: number;
  openRecommendations: number;
};

export async function dashboardSummary(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Dashboard summary request received: ${request.url}`);

  try {
    const rows = await queryDatabase<DashboardSummaryRow>(`
  SELECT
    TotalRevenue AS totalRevenue,
    ServiceCalls AS serviceCalls,
    AverageRating AS averageRating,
    OpenRecommendations AS openRecommendations
  FROM reporting.vwDashboardSummary;
`);

    const summary = rows[0];

    return {
      status: 200,
      jsonBody: {
        totalRevenue: Number(summary.totalRevenue),
        serviceCalls: Number(summary.serviceCalls),
        averageRating: Number(summary.averageRating),
        openRecommendations: Number(summary.openRecommendations),
        lastUpdated: new Date().toISOString(),
      },
    };
  } catch (error) {
    context.error("Dashboard summary query failed:", error);

    return {
      status: 500,
      jsonBody: {
        status: "error",
        message: "Dashboard summary query failed.",
      },
    };
  }
}

app.http("dashboardSummary", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: dashboardSummary,
});