import axios from "axios";

// Create a new Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_BACK_END_URL, // Set your API base URL
  timeout: 5000, // Set a reasonable timeout value
  withCredentials: true,
});
export default api;
