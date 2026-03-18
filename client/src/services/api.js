import axios from "axios";
import { getToken } from "./auth";

const baseURL = "http://16.171.39.67:5000/api" || "http://localhost:5000/api";

export const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});