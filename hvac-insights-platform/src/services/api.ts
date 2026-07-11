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