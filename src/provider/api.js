import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api"
});

// interceptor para adicionar token JWT em requisições autenticadas
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  
  // Não adicionar token em rotas públicas (login, registro, etc.)
  const publicRoutes = ['/usuarios/login', '/usuarios/register', '/usuarios/forgot-password'];
  const isPublicRoute = publicRoutes.some(route => config.url?.includes(route));
  
  if (token && !isPublicRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;