// src/api/dashboardService.ts

import type { DashboardResponse, DashboardMetrics } from "../types/dashboard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/metrics`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: DashboardResponse = await response.json();

    if (data.status !== 200) {
      throw new Error(
        `API error: ${data.message} - ${
          data.errors ? JSON.stringify(data.errors) : "No details provided"
        }`
      );
    }

    return data.data;
  } catch (error) {
    console.error("Failed to fetch dashboard metrics:", error);
    throw error;
  }
};
