import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
  timeout: 15000,
});

export const fetchProjects = () => api.get("/projects").then((r) => r.data);
export const fetchProject = (slug) => api.get(`/projects/${slug}`).then((r) => r.data);
export const fetchRepos = () => api.get("/github/repos").then((r) => r.data);
export const fetchStats = () => api.get("/stats").then((r) => r.data);
export const submitContact = (payload) => api.post("/contact", payload).then((r) => r.data);
