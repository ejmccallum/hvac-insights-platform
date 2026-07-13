import { randomUUID } from "crypto";
import sql from "mssql";
import { getSqlPool } from "./database";

type CreateUploadHistoryInput = {
  fileName: string;
  blobName: string;
  fileType: string;
};

export async function createUploadHistoryRecord(
  input: CreateUploadHistoryInput
) {
  const pool = await getSqlPool();
  const uploadId = randomUUID();

  await pool
    .request()
    .input("uploadId", sql.UniqueIdentifier, uploadId)
    .input("fileName", sql.NVarChar(255), input.fileName)
    .input("blobName", sql.NVarChar(500), input.blobName)
    .input("fileType", sql.NVarChar(50), input.fileType)
    .query(`
      DECLARE @TenantId uniqueidentifier;
      DECLARE @UploadedByUserId uniqueidentifier;
      DECLARE @IntegrationId uniqueidentifier;

      SELECT TOP (1)
        @TenantId = TenantId
      FROM dbo.TENANTS
      WHERE CompanyName = 'Mile High HVAC'
        AND IsDeleted = 0;

      SELECT TOP (1)
        @UploadedByUserId = UserId
      FROM dbo.USERS
      WHERE Email = 'owner@milehighhvac.com'
        AND IsDeleted = 0;

      SELECT TOP (1)
        @IntegrationId = IntegrationId
      FROM dbo.Integrations
      WHERE ProviderName = 'ServiceTitan'
        AND IsDeleted = 0;

      IF @TenantId IS NULL
        THROW 50001, 'Default tenant not found.', 1;

      INSERT INTO dbo.UploadHistory
      (
        UploadId,
        TenantId,
        UploadedByUserId,
        IntegrationId,
        FileName,
        BlobName,
        FileType,
        UploadStatus,
        CreatedAt,
        UpdatedAt,
        IsDeleted
      )
      VALUES
      (
        @uploadId,
        @TenantId,
        @UploadedByUserId,
        @IntegrationId,
        @fileName,
        @blobName,
        @fileType,
        'UploadUrlIssued',
        SYSUTCDATETIME(),
        NULL,
        0
      );
    `);

  return { uploadId };
}

export async function markUploadAsUploaded(uploadId: string) {
  const pool = await getSqlPool();

  const result = await pool
    .request()
    .input("uploadId", sql.UniqueIdentifier, uploadId)
    .query(`
      UPDATE dbo.UploadHistory
      SET
        UploadStatus = 'Uploaded',
        UpdatedAt = SYSUTCDATETIME()
      WHERE UploadId = @uploadId
        AND IsDeleted = 0;

      SELECT @@ROWCOUNT AS rowsUpdated;
    `);

  return result.recordset[0]?.rowsUpdated ?? 0;
}