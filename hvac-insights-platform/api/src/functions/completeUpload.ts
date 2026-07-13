import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { markUploadAsUploaded } from "../services/uploadHistory";

type CompleteUploadRequest = {
  uploadId?: string;
};

export async function completeUpload(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Complete upload request received: ${request.url}`);

  try {
    const body = (await request.json().catch(() => null)) as
      | CompleteUploadRequest
      | null;

    if (!body?.uploadId) {
      return {
        status: 400,
        jsonBody: {
          status: "error",
          message: "uploadId is required.",
        },
      };
    }

    const rowsUpdated = await markUploadAsUploaded(body.uploadId);

    if (rowsUpdated === 0) {
      return {
        status: 404,
        jsonBody: {
          status: "error",
          message: "Upload history record not found.",
        },
      };
    }

    return {
      status: 200,
      jsonBody: {
        status: "ok",
        message: "Upload marked as uploaded.",
        uploadId: body.uploadId,
      },
    };
  } catch (error) {
    context.error("Complete upload failed:", error);

    return {
      status: 500,
      jsonBody: {
        status: "error",
        message: "Could not complete upload.",
      },
    };
  }
}

app.http("completeUpload", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: completeUpload,
});