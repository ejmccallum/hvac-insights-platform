import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export type ApiHealthResponse = {
  status: string;
  service: string;
  message: string;
  timestamp: string;
};

export type DashboardSummaryResponse = {
  totalRevenue: number;
  serviceCalls: number;
  averageRating: number;
  openRecommendations: number;
  lastUpdated: string;
};

export type RecentInsight = {
  recommendationId: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
  insightTopic: string | null;
  sentiment: string | null;
  severity: string | null;
  revenueRiskLevel: string | null;
  maintenancePlanOpportunity: boolean | null;
  technicianRecognition: boolean | null;
  technicianName: string | null;
  locationName: string | null;
};

export type CreateUploadSasResponse = {
  status: string;
  blobName: string;
  containerName: string;
  uploadUrl: string;
  expiresOn: string;
};

export async function getApiHealth() {
  const response = await apiClient.get<ApiHealthResponse>("/healthCheck");
  return response.data;
}

export async function getDashboardSummary() {
  const response = await apiClient.get<DashboardSummaryResponse>(
    "/dashboardSummary"
  );

  return response.data;
}

export type RecentInsightsResponse = {
  insights: RecentInsight[];
  count: number;
  lastUpdated: string;
};

export async function getRecentInsights() {
  const response = await apiClient.get<RecentInsightsResponse>(
    "/recentInsights"
  );

  return response.data;
}

export async function createUploadSas(fileName: string, contentType: string) {
  const response = await apiClient.post<CreateUploadSasResponse>(
    "/createUploadSas",
    {
      fileName,
      contentType,
    }
  );

  return response.data;
}

