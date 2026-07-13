import {
  BlobSASPermissions,
  BlobServiceClient,
  SASProtocol,
  generateBlobSASQueryParameters,
} from "@azure/storage-blob";
import { DefaultAzureCredential } from "@azure/identity";
import { randomUUID } from "crypto";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing ${name} in local.settings.json`);
  }

  return value;
}

const storageAccountName = getRequiredEnv("AZURE_STORAGE_ACCOUNT_NAME");

const uploadContainerName =
  process.env.AZURE_STORAGE_UPLOAD_CONTAINER || "uploads";

const credential = new DefaultAzureCredential();

const blobServiceClient = new BlobServiceClient(
  `https://${storageAccountName}.blob.core.windows.net`,
  credential
);

function sanitizeFileName(fileName: string) {
  return fileName
    .trim()
    .replace(/[^a-zA-Z0-9.\-_]/g, "-")
    .replace(/-+/g, "-");
}

export type CreateUploadSasResult = {
  blobName: string;
  containerName: string;
  uploadUrl: string;
  expiresOn: string;
};

export async function createUploadSasUrl(
  fileName: string,
  contentType?: string
): Promise<CreateUploadSasResult> {
  const safeFileName = sanitizeFileName(fileName);

  const today = new Date().toISOString().slice(0, 10);

  const blobName = `incoming/${today}/${randomUUID()}-${safeFileName}`;

  const containerClient =
    blobServiceClient.getContainerClient(uploadContainerName);

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const startsOn = new Date(Date.now() - 5 * 60 * 1000);
  const expiresOn = new Date(Date.now() + 10 * 60 * 1000);

  const userDelegationKey = await blobServiceClient.getUserDelegationKey(
    startsOn,
    expiresOn
  );

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName: uploadContainerName,
      blobName,
      permissions: BlobSASPermissions.parse("cw"),
      startsOn,
      expiresOn,
      protocol: SASProtocol.Https,
      contentType: contentType || "text/csv",
    },
    userDelegationKey,
    storageAccountName
  ).toString();

  return {
    blobName,
    containerName: uploadContainerName,
    uploadUrl: `${blockBlobClient.url}?${sasToken}`,
    expiresOn: expiresOn.toISOString(),
  };
}