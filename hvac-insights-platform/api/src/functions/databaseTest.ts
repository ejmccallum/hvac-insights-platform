import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { queryDatabase } from "../services/database";

type DatabaseTestRow = {
  testValue: number;
  databaseName: string;
  sqlUser: string;
};

export async function databaseTest(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Database test request received: ${request.url}`);

  try {
    const rows = await queryDatabase<DatabaseTestRow>(`
      SELECT
        1 AS testValue,
        DB_NAME() AS databaseName,
        SUSER_SNAME() AS sqlUser;
    `);

    return {
      status: 200,
      jsonBody: {
        status: "ok",
        message: "Azure SQL connection successful.",
        result: rows[0],
      },
    };
  } catch (error) {
    context.error("Azure SQL connection failed:", error);

    return {
      status: 500,
      jsonBody: {
        status: "error",
        message: "Azure SQL connection failed.",
      },
    };
  }
}

app.http("databaseTest", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: databaseTest,
});