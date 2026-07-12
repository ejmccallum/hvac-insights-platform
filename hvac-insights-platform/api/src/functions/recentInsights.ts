import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { queryDatabase } from "../services/database";

type RecentInsightRow = {
  recommendationId: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  createdAt: Date | string;
  insightTopic: string | null;
  sentiment: string | null;
  severity: string | null;
  revenueRiskLevel: string | null;
  maintenancePlanOpportunity: boolean | null;
  technicianRecognition: boolean | null;
  technicianName: string | null;
  locationName: string | null;
};

export async function recentInsights(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Recent insights request received: ${request.url}`);

  try {
    const rows = await queryDatabase<RecentInsightRow>(`
      SELECT
        RecommendationId AS recommendationId,
        Title AS title,
        [Description] AS description,
        [Priority] AS priority,
        [Status] AS status,
        CreatedAt AS createdAt,
        InsightTopic AS insightTopic,
        Sentiment AS sentiment,
        Severity AS severity,
        RevenueRiskLevel AS revenueRiskLevel,
        MaintenancePlanOpportunity AS maintenancePlanOpportunity,
        TechnicianRecognition AS technicianRecognition,
        TechnicianName AS technicianName,
        LocationName AS locationName
      FROM reporting.vwRecentBusinessInsights;
    `);

    const insights = rows.map((row) => ({
      ...row,
      createdAt:
        row.createdAt instanceof Date
          ? row.createdAt.toISOString()
          : row.createdAt,
    }));

    return {
      status: 200,
      jsonBody: {
        insights,
        count: insights.length,
        lastUpdated: new Date().toISOString(),
      },
    };
  } catch (error) {
    context.error("Recent insights query failed:", error);

    return {
      status: 500,
      jsonBody: {
        status: "error",
        message: "Recent insights query failed.",
      },
    };
  }
}

app.http("recentInsights", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: recentInsights,
});