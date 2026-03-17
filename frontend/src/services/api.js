import axios from "axios";

const normalizeApiBaseUrl = (rawUrl) => {
  const fallback = "http://localhost:5000/api";
  const value = (rawUrl || fallback).trim();
  const withoutTrailingSlash = value.replace(/\/+$/, "");

  if (withoutTrailingSlash.endsWith("/api")) {
    return withoutTrailingSlash;
  }

  return `${withoutTrailingSlash}/api`;
};

const api = axios.create({
  baseURL: normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  signup: (payload) => api.post("/auth/signup", payload),
  login: (payload) => api.post("/auth/login", payload),
  me: () => api.get("/auth/me"),
};

export const booksApi = {
  list: (params) => api.get("/books", { params }),
  searchMeta: (params) => api.get("/books/search/meta", { params }),
  create: (payload) => api.post("/books", payload, { headers: { "Content-Type": "multipart/form-data" } }),
  update: (id, payload) =>
    api.put(`/books/${id}`, payload, { headers: { "Content-Type": "multipart/form-data" } }),
  remove: (id) => api.delete(`/books/${id}`),
};

export const transactionsApi = {
  list: () => api.get("/transactions"),
  issue: (bookId) => api.post("/transactions/issue", { bookId }),
  sendReturnEmail: (id, returnDate) =>
    api.post(`/transactions/${id}/send-return-email`, { returnDate }),
  returnBook: (id, returnDate) => api.put(`/transactions/${id}/return`, { returnDate }),
};

export const reservationsApi = {
  list: () => api.get("/reservations"),
  reserve: (bookId) => api.post(`/reservations/${bookId}`),
  cancel: (id) => api.delete(`/reservations/${id}`),
};

export const dashboardApi = {
  admin: () => api.get("/dashboard/admin"),
};

export default api;
