import { Platform } from "react-native";

// For Android emulator, localhost maps to 10.0.2.2
// For iOS simulator, localhost works directly
// For web, use localhost
const getApiUrl = () => {
  if (Platform.OS === "android") {
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
