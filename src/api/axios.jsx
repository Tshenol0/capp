import axios from "axios";
const BASE_URL = "https://capp-api-9sa2.onrender.com";

export default axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  hearders: { "Content-Type": "application/json" },
  withCredentials: true,
});
