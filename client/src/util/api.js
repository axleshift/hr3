import axios from 'axios'

const API = import.meta.env.VITE_APP_API_URL || 'https://hr3.axleshift.com'

const api = axios.create({
  baseURL: `${API}/api`,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
