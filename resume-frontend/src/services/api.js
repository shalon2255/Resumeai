import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const setupCsrf = () => {
  return axios.get(`${API_URL}/api/auth/csrf/`, { withCredentials: true })
    .then(res => {
      axios.defaults.headers.common['X-CSRFToken'] = res.data.csrfToken;
    });
};

export const analyzeResume = (formData) => {
  return axios.post(`${API_URL}/analyze/`, formData, { withCredentials: true });
};