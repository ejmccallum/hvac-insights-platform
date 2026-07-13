import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import type { ChangeEvent } from "react";
import PageHeader from "../components/common/PageHeader";
import { createUploadSas } from "../services/api";

function UploadData() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");

  const [message, setMessage] = useState("");

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setSelectedFile(null);
      setUploadStatus("error");
      setMessage("Only CSV files are allowed.");
      return;
    }

    setSelectedFile(file);
    setUploadStatus("idle");
    setMessage("");
  }

  async function handleUpload() {
    if (!selectedFile) {
      setUploadStatus("error");
      setMessage("Please select a CSV file first.");
      return;
    }

    try {
      setUploadStatus("uploading");
      setMessage("Requesting secure upload URL...");

      const sasResponse = await createUploadSas(
        selectedFile.name,
        selectedFile.type || "text/csv"
      );

      setMessage("Uploading file to Azure Blob Storage...");

      const uploadResponse = await fetch(sasResponse.uploadUrl, {
        method: "PUT",
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": selectedFile.type || "text/csv",
        },
        body: selectedFile,
      });

      if (!uploadResponse.ok) {
        throw new Error("Blob upload failed.");
      }

      setUploadStatus("success");
      setMessage(`Upload complete. Blob saved as ${sasResponse.blobName}`);
    } catch {
      setUploadStatus("error");
      setMessage("Upload failed. Check the API terminal and browser console.");
    }
  }

  return (
    <Box>
      <PageHeader
        title="Upload Data"
        subtitle="Upload HVAC business CSV files into Azure Blob Storage for processing."
      />

      <Card
        elevation={0}
        sx={{
          border: "1px solid #e5e7eb",
          borderRadius: 3,
          maxWidth: 720,
        }}
      >
        <CardContent>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
                CSV Upload
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Select a CSV file. The app will request a temporary upload URL
                from the API, then upload the file directly to Azure Blob
                Storage.
              </Typography>
            </Box>

            <Button
              variant="outlined"
              component="label"
              startIcon={<InsertDriveFileIcon />}
              disabled={uploadStatus === "uploading"}
            >
              Choose CSV File
              <input
                type="file"
                accept=".csv,text/csv"
                hidden
                onChange={handleFileChange}
              />
            </Button>

            {selectedFile && (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e5e7eb",
                }}
              >
                <Typography sx={{ fontWeight: 700 }}>
                  {selectedFile.name}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </Typography>
              </Box>
            )}

            {uploadStatus === "uploading" && <LinearProgress />}

            {message && (
              <Typography
                variant="body2"
                color={
                  uploadStatus === "error"
                    ? "error"
                    : uploadStatus === "success"
                    ? "success.main"
                    : "text.secondary"
                }
              >
                {message}
              </Typography>
            )}

            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              onClick={handleUpload}
              disabled={!selectedFile || uploadStatus === "uploading"}
            >
              Upload to Azure Blob Storage
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default UploadData;