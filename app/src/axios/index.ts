import axios from "axios";

export const client = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_TNCALC_ENDPOINT,
  validateStatus: (status) => status < 500,
});
