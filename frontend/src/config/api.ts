import { Platform } from "react-native";

// API URL configuration
// In production (Docker), use environment variable
// In development, use localhost with platform-specific handling
const getApiUrl = () => {
  // Check for environment variable first (set during build)
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) {
    return envUrl;
  }

  // Development fallback
  if (Platform.OS === "android") {
    // Android emulator uses 10.0.2.2 to access host machine
    return "http://10.0.2.2:8000/api/v1";
  }
  return "http://localhost:8000/api/v1";
};

export const API_URL = getApiUrl();

export const API_ENDPOINTS = {
  projects: `${API_URL}/projects`,
  skills: `${API_URL}/skills`,
  skillCategories: `${API_URL}/skills/categories`,
} as const;
