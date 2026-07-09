import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EngineeringIcon from "@mui/icons-material/Engineering";
import RateReviewIcon from "@mui/icons-material/RateReview";
import RecommendIcon from "@mui/icons-material/Recommend";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import BarChartIcon from "@mui/icons-material/BarChart";
import SyncIcon from "@mui/icons-material/Sync";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import axios from "axios";
import { useEffect, useState } from "react";

type ApiHealthResponse = {
  status: string;
  service: string;
  message: string;
  timestamp: string;
};

function Dashboard() {
  const navigate = useNavigate();

  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">(
    "checking"
  );

  const [apiMessage, setApiMessage] = useState("Checking API connection...");

useEffect(() => {
  async function checkApiHealth() {
    try {
      const response = await axios.get<ApiHealthResponse>(
        "http://localhost:7071/api/healthCheck"
      );

      setApiStatus("online");
      setApiMessage(response.data.message);
    } catch {
  setApiStatus("offline");
  setApiMessage("Could not connect to the Azure Functions API.");
}
  }

  checkApiHealth();
}, []);

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back. Here is a quick snapshot of your HVAC business performance."
        action={
          <Button
            variant="contained"
            startIcon={<UploadFileIcon />}
            onClick={() => navigate("/upload")}
          >
            Upload Data
          </Button>
        }
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 3,
          mb: 3,
        }}
      >
        <StatCard
          title="Total Revenue"
          value="$9.3K"
          helperText="Across completed service calls"
          icon={<AttachMoneyIcon />}
        />

        <StatCard
          title="Service Calls"
          value="8"
          helperText="Completed and callback jobs"
          icon={<EngineeringIcon />}
        />

        <StatCard
          title="Average Rating"
          value="4.3"
          helperText="Across customer reviews"
          icon={<RateReviewIcon />}
        />

        <StatCard
          title="Open Recommendations"
          value="5"
          helperText="Action items for the team"
          icon={<RecommendIcon />}
        />
      </Box>

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
        <Card
          elevation={0}
          sx={{
            border: "1px solid #e5e7eb",
            borderRadius: 3,
          }}
        >
          <CardContent>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
              Recent Business Insights
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
              AI-style recommendations and operational patterns will appear here.
            </Typography>

            <Stack spacing={2}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e5e7eb",
                }}
              >
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <Chip label="High Priority" size="small" color="error" />
                  <Chip label="Callback Risk" size="small" />
                </Stack>

                <Typography sx={{ fontWeight: 700 }}>
                  Investigate AC repair callback trend
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  A recent AC repair required a callback. Review technician notes,
                  parts quality, and customer communication.
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e5e7eb",
                }}
              >
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <Chip label="Opportunity" size="small" color="success" />
                  <Chip label="Maintenance Plan" size="small" />
                </Stack>

                <Typography sx={{ fontWeight: 700 }}>
                  Follow up on maintenance plan interest
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  A customer mentioned interest in regular maintenance after a duct
                  cleaning visit.
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e5e7eb",
                }}
              >
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <Chip label="Recognition" size="small" color="primary" />
                  <Chip label="Technician Performance" size="small" />
                </Stack>

                <Typography sx={{ fontWeight: 700 }}>
                  Recognize strong technician performance
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Positive customer feedback highlights punctuality, communication,
                  and strong technical work.
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Stack spacing={3}>
          <Card
  elevation={0}
  sx={{
    border: "1px solid #e5e7eb",
    borderRadius: 3,
  }}
>
  <CardContent>
    <Stack
  direction="row"
  spacing={1.5}
  sx={{ alignItems: "center" }}
>
      {apiStatus === "online" ? (
        <CheckCircleIcon color="success" />
      ) : (
        <WarningAmberIcon
  color={apiStatus === "checking" ? "warning" : "error"}
/>
      )}

      <Box>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
          API Status
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {apiMessage}
        </Typography>
      </Box>
    </Stack>

    <Chip
      label={
        apiStatus === "online"
          ? "Online"
          : apiStatus === "checking"
          ? "Checking"
          : "Offline"
      }
      color={
        apiStatus === "online"
          ? "success"
          : apiStatus === "checking"
          ? "warning"
          : "error"
      }
      size="small"
      sx={{ mt: 2 }}
    />
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
                Quick Actions
              </Typography>

              <Stack spacing={1.5} sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<UploadFileIcon />}
                  onClick={() => navigate("/upload")}
                  fullWidth
                >
                  Upload CSV
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<BarChartIcon />}
                  onClick={() => navigate("/reports")}
                  fullWidth
                >
                  View Reports
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<SyncIcon />}
                  onClick={() => navigate("/integrations")}
                  fullWidth
                >
                  Manage Integrations
                </Button>
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
                Power BI Reports
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Your embedded Power BI dashboards will live on the Reports page.
                This card is a preview placeholder for now.
              </Typography>

              <Button
                variant="contained"
                startIcon={<BarChartIcon />}
                onClick={() => navigate("/reports")}
                sx={{ mt: 2 }}
                fullWidth
              >
                Open Reports
              </Button>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Box>
  );
}

export default Dashboard;