import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import PageHeader from "../components/common/PageHeader";

type UploadStatus = "idle" | "selected" | "uploading" | "success" | "error";

function UploadData() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const isCsvFile = file.name.toLowerCase().endsWith(".csv");

    if (!isCsvFile) {
      setSelectedFile(null);
      setUploadStatus("error");
      setErrorMessage("Please select a CSV file.");
      return;
    }

    setSelectedFile(file);
    setUploadStatus("selected");
    setProgress(0);
    setErrorMessage("");
  }

  async function handleUpload() {
    if (!selectedFile) {
      setUploadStatus("error");
      setErrorMessage("Please choose a CSV file before uploading.");
      return;
    }

    setUploadStatus("uploading");
    setProgress(0);
    setErrorMessage("");

    for (let value = 20; value <= 100; value += 20) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setProgress(value);
    }

    setUploadStatus("success");
  }

  function handleClearFile() {
    setSelectedFile(null);
    setUploadStatus("idle");
    setProgress(0);
    setErrorMessage("");
  }

  return (
    <Box>
      <PageHeader
        title="Upload Data"
        subtitle="Upload HVAC service data, reviews, and operational files for processing."
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "2fr 1fr",
          },
          gap: 3,
        }}
      >
        <Stack spacing={3}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #e5e7eb",
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
                    Upload CSV File
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Choose a CSV export from ServiceTitan, Housecall Pro, Jobber, or another HVAC system.
                  </Typography>
                </Box>

                <Box
                  sx={{
                    border: "2px dashed #cbd5e1",
                    borderRadius: 3,
                    p: 4,
                    textAlign: "center",
                    backgroundColor: "#f8fafc",
                  }}
                >
                  <CloudUploadIcon sx={{ fontSize: 48, color: "#2563eb", mb: 1 }} />

                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Select a CSV file
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                    CSV files only. Later this will upload to Azure Blob Storage.
                  </Typography>

                  <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
                    Choose File
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      hidden
                      onChange={handleFileChange}
                    />
                  </Button>
                </Box>

                {selectedFile && (
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: "1px solid #e5e7eb",
                      backgroundColor: "#ffffff",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <InsertDriveFileIcon sx={{ color: "#2563eb" }} />

                      <Box>
                        <Typography sx={{ fontWeight: 700 }}>{selectedFile.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </Typography>
                      </Box>
                    </Box>

                    <Button variant="text" color="inherit" onClick={handleClearFile}>
                      Clear
                    </Button>
                  </Box>
                )}

                {uploadStatus === "uploading" && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Uploading and validating file...
                    </Typography>
                    <LinearProgress variant="determinate" value={progress} />
                  </Box>
                )}

                {uploadStatus === "success" && (
                  <Alert icon={<CheckCircleIcon />} severity="success">
                    File uploaded successfully. In the next phase, this will trigger Azure processing.
                  </Alert>
                )}

                {uploadStatus === "error" && (
                  <Alert icon={<ErrorIcon />} severity="error">
                    {errorMessage}
                  </Alert>
                )}

                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                  <Button variant="outlined" onClick={handleClearFile}>
                    Reset
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    onClick={handleUpload}
                    disabled={uploadStatus === "uploading"}
                  >
                    Upload File
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{
              border: "1px solid #e5e7eb",
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
                Recent Uploads
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                This will eventually come from the UploadHistory table.
              </Typography>

              <Stack spacing={1.5}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid #e5e7eb",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>
                      MileHighHVAC_ServiceTitan_Demo_Export.csv
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Uploaded 35 minutes ago
                    </Typography>
                  </Box>

                  <Chip label="Processed" color="success" size="small" />
                </Box>

                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid #e5e7eb",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>
                      sample_reviews_import.csv
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Demo placeholder
                    </Typography>
                  </Box>

                  <Chip label="Ready" color="primary" size="small" />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Stack>

        <Stack spacing={3}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #e5e7eb",
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <InfoIcon sx={{ color: "#2563eb" }} />
                <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
                  Expected CSV Format
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                For the MVP, we will start with service call and review data.
              </Typography>

              <Stack spacing={1}>
                <Chip label="Customer Name" />
                <Chip label="Technician Name" />
                <Chip label="Service Type" />
                <Chip label="Job Status" />
                <Chip label="Revenue Amount" />
                <Chip label="Review Rating" />
                <Chip label="Review Text" />
              </Stack>
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{
              border: "1px solid #e5e7eb",
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
                Upload Pipeline
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                This page is currently front-end only. Next, we will connect it to Azure Blob Storage.
              </Typography>

              <Stack spacing={1.5} sx={{ mt: 2 }}>
                <Chip label="1. Select CSV" color="primary" />
                <Chip label="2. Upload to Blob Storage" />
                <Chip label="3. Trigger Azure Function" />
                <Chip label="4. Validate and insert into SQL" />
                <Chip label="5. Refresh Power BI report" />
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Box>
  );
}

export default UploadData;