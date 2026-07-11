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
        COALESCE((
          SELECT SUM(RevenueAmount)
          FROM ServiceCalls
          WHERE IsDeleted = 0
        ), 0) AS totalRevenue,

        COALESCE((
          SELECT COUNT(*)
          FROM ServiceCalls
          WHERE IsDeleted = 0
        ), 0) AS serviceCalls,

        COALESCE((
          SELECT AVG(CAST(Rating AS decimal(10, 2)))
          FROM REVIEWS
          WHERE IsDeleted = 0
        ), 0) AS averageRating,

        COALESCE((
          SELECT COUNT(*)
          FROM Recommendations
          WHERE IsDeleted = 0
            AND [Status] = 'Open'
        ), 0) AS openRecommendations;
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