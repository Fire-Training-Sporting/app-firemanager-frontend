import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api"
});

// interceptor para adicionar token JWT em todas as requisições
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export async function getAllPages(url, params = {}) {
  const pageSize = 100;
  const firstResponse = await api.get(url, {
    params: { ...params, page: 0, size: pageSize },
  });
  const firstData = firstResponse.data;
  const getContent = (data) =>
    Array.isArray(data) ? data : Array.isArray(data?.content) ? data.content : [];
  const content = getContent(firstData);

  if (Array.isArray(firstData) || Number(firstData?.totalPages) <= 1) {
    return content;
  }

  const totalPages = Number(firstData?.totalPages) || 1;
  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      api.get(url, {
        params: { ...params, page: index + 1, size: pageSize },
      })
    )
  );

  return content.concat(...remainingPages.map((response) => getContent(response.data)));
}