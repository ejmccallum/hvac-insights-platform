import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { createUploadSasUrl } from "../services/blobStorage";
import { createUploadHistoryRecord } from "../services/uploadHistory";

type CreateUploadSasRequest = {
  fileName?: string;
  contentType?: string;
};

function isCsvFile(fileName: string, contentType?: string) {
  const lowerFileName = fileName.toLowerCase();

  return (
    lowerFileName.endsWith(".csv") ||
    contentType === "text/csv" ||
    contentType === "application/vnd.ms-excel"
  );
}

export async function createUploadSas(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Create upload SAS request received: ${request.url}`);

  try {
    const body = (await request.json().catch(() => null)) as
      | CreateUploadSasRequest
      | null;

    if (!body?.fileName) {
      return {
        status: 400,
        jsonBody: {
          status: "error",
          message: "fileName is required.",
        },
      };
    }

    if (!isCsvFile(body.fileName, body.contentType)) {
      return {
        status: 400,
        jsonBody: {
          status: "error",
          message: "Only CSV files are allowed.",
        },
      };
    }

    const sasResult = await createUploadSasUrl(
      body.fileName,
      body.contentType
    );

    const uploadHistory = await createUploadHistoryRecord({
  fileName: body.fileName,
  blobName: sasResult.blobName,
  fileType: "CSV",
});

    return {
      status: 200,
      jsonBody: {
        status: "ok",
        uploadId: uploadHistory.uploadId,
        ...sasResult,
      },
    };
  } catch (error) {
    context.error("Create upload SAS failed:", error);

    return {
      status: 500,
      jsonBody: {
        status: "error",
        message: "Could not create upload URL.",
      },
    };
  }
}

app.http("createUploadSas", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: createUploadSas,
});