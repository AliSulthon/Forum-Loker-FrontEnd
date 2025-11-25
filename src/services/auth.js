import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export async function login(payload) {
  return axios.post(`${API_URL}/login`, payload);
}

export function getAuthToken() {
  return localStorage.getItem("auth_token");
}

export function authHeader() {
  const token = getAuthToken();
  return {
    Authorization: `Bearer ${token}`
  };
}
