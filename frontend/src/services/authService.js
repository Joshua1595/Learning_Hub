import api from "./api";
import { saveToken } from "../utils/storage";

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (Data) => {
  const response = await api.post("/auth/login", Data);
  saveToken(response.data.session.access_token);

  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};