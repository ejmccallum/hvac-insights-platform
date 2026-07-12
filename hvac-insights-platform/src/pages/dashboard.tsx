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
import { useEffect, useState } from "react";
import {
  getApiHealth,
  getDashboardSummary,
  getRecentInsights,
} from "../services/api";

import type {
  DashboardSummaryResponse,
  RecentInsight,
} from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">(
    "checking"
  );

  const [apiMessage, setApiMessage] = useState("Checking API connection...");

  const [dashboardSummary, setDashboardSummary] =
  useState<DashboardSummaryResponse | null>(null);

const [dashboardSummaryError, setDashboardSummaryError] = useState("");

const [recentInsights, setRecentInsights] = useState<RecentInsight[]>([]);
const [recentInsightsError, setRecentInsightsError] = useState("");

useEffect(() => {
  async function checkApiHealth() {
    try {
     const data = await getApiHealth();

      setApiStatus("online");
      setApiMessage(data.message);
    } catch {
  setApiStatus("offline");
  setApiMessage("Could not connect to the Azure Functions API.");
}
  }

  checkApiHealth();
}, []);
useEffect(() => {
  async function loadDashboardSummary() {
    try {
      const data = await getDashboardSummary();

      setDashboardSummary(data);
      setDashboardSummaryError("");
    } catch {
      setDashboardSummaryError("Dashboard summary unavailable.");
    }
  }

  loadDashboardSummary();
}, []);
useEffect(() => {
  async function loadRecentInsights() {
    try {
      const data = await getRecentInsights();

      setRecentInsights(data.insights);
      setRecentInsightsError("");
    } catch {
      setRecentInsightsError("Recent business insights unavailable.");
    }
  }

  loadRecentInsights();
}, []);


const totalRevenueDisplay = dashboardSummary
  ? new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(dashboardSummary.totalRevenue)
  : "--";

const serviceCallsDisplay = dashboardSummary
  ? dashboardSummary.serviceCalls.toString()
  : "--";

const averageRatingDisplay = dashboardSummary
  ? dashboardSummary.averageRating.toFixed(1)
  : "--";

const openRecommendationsDisplay = dashboardSummary
  ? dashboardSummary.openRecommendations.toString()
  : "--";

function getPriorityColor(
  priority: string
): "error" | "warning" | "success" | "default" {
  switch (priority) {
    case "High":
      return "error";
    case "Medium":
      return "warning";
    case "Low":
      return "success";
    default:
      return "default";
  }
}

function getInsightLabel(insight: RecentInsight) {
  if (insight.technicianRecognition) {
    return "Recognition";
  }

  if (insight.maintenancePlanOpportunity) {
    return "Maintenance Plan";
  }

  if (insight.revenueRiskLevel) {
    return "Revenue Risk";
  }

  return insight.insightTopic || "Business Insight";
}

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
          value={totalRevenueDisplay}
          helperText="Across completed service calls"
          icon={<AttachMoneyIcon />}
        />

        <StatCard
          title="Service Calls"
          value={serviceCallsDisplay}
          helperText="Completed and callback jobs"
          icon={<EngineeringIcon />}
        />

        <StatCard
            title="Average Rating"
            value={averageRatingDisplay}
            helperText="Across customer reviews"
            icon={<RateReviewIcon />}
        />

        <StatCard
          title="Open Recommendations"
          value={openRecommendationsDisplay}
          helperText="Action items for the team"
          icon={<RecommendIcon />}
        />
      </Box>
{dashboardSummaryError && (
  <Typography color="error" sx={{ mb: 3 }}>
    {dashboardSummaryError}
  </Typography>
)}
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

            {recentInsightsError && (
  <Typography color="error" sx={{ mb: 2 }}>
    {recentInsightsError}
  </Typography>
)}

{!recentInsightsError && recentInsights.length === 0 && (
  <Typography variant="body2" color="text.secondary">
    No recent business insights found.
  </Typography>
)}

<Stack spacing={2}>
  {recentInsights.map((insight) => (
    <Box
      key={insight.recommendationId}
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: "#f8fafc",
        border: "1px solid #e5e7eb",
      }}
    >
      <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: "wrap" }}>
        <Chip
          label={`${insight.priority} Priority`}
          size="small"
          color={getPriorityColor(insight.priority)}
        />

        <Chip label={getInsightLabel(insight)} size="small" />

        {insight.status && (
          <Chip label={insight.status} size="small" variant="outlined" />
        )}
      </Stack>

      <Typography sx={{ fontWeight: 700 }}>{insight.title}</Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {insight.description}
      </Typography>

      {(insight.technicianName || insight.locationName) && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
          {insight.technicianName && `Technician: ${insight.technicianName}`}
          {insight.technicianName && insight.locationName && " • "}
          {insight.locationName && `Location: ${insight.locationName}`}
        </Typography>
      )}
    </Box>
  ))}
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